import CourtEntity from "../../../domain/entities/courtEntity";
import { CourtRepo } from "../../../domain/repositories/courtRepo";
import CourtModel from "../models/courtModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
import { getMaxListeners } from "node:cluster";
import listType from "../../../shared/constants/types";

class CourtRepoImpl implements CourtRepo {

  async createCourt(courtData: CourtEntity) {
    return await CourtModel.create(courtData);
  }

  async getCourts(
    userId?: string,
    query: Record<string, any> = {}
  ): Promise<{ data: CourtEntity[]; pagination?: QueryPagination }> {
    // 1. Build base query
    const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel, query)
      .filter()
      .sort()
      .limitFields();

    // 2. Count total documents
    const totalCourts = await queryBuilder.mongooseQuery.clone().countDocuments();

    // 3. Apply pagination
    queryBuilder.paginate(totalCourts);

    // 4. Fetch documents (keep savedBy temporarily to check isSaved)
    const courts = await queryBuilder.mongooseQuery
      .select("-__v")
      .populate({
        path: "floors",
        select: "-court -_id",
        populate: [
          {
            path: "offices",
            select: "officeType roomNumber locationDirection startingWorkingHours endWorkingHours services",
          },
        ],
      })
      .lean<CourtEntity[]>();

    // 5. Map results and calculate isSaved safely
    const formattedCourts = (courts || []).map((court) => {
      const isSaved = userId
        ? Boolean(court.savedBy?.some((id: any) => id.toString() === userId))
        : false;
console.log({
  receivedUserId: userId,
  userIdType: typeof userId,
  savedByArray: court.savedBy,
  firstElement: court.savedBy?.[0],
  firstElementType: typeof court.savedBy?.[0]
});
      // Delete savedBy so it's not exposed to the client
      delete (court as Partial<CourtEntity>).savedBy;
      return {
        ...court,
        isSaved,
      };
    });

    return {
      data: formattedCourts,
      pagination: queryBuilder.pagination,
    };
  }
  async getCourtById(id: string): Promise<CourtEntity | null> {

    return await CourtModel.findByIdAndUpdate(id, {
      $inc: { nViews: 1 },
    }, { new: true }).populate({
      path: "floors",
      populate: [
        {
          path: "offices", populate: [
            {
              path: "officeType",
              select: "name description-floor-court"
            }
          ],
        },
      ],
    });
  }


  async deleteCourtById(id: string) {
    return await CourtModel.findByIdAndDelete(id);
  }
  async getMostSeenCourts(query: Record<string, any> = {}): Promise<CourtEntity[]> {
    const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel.find())
      .filter();
    const totalCourts = await queryBuilder.mongooseQuery.clone().countDocuments();

    queryBuilder.paginate(totalCourts).sort({ nViews: -1 }).limitFields();
    const courts = await queryBuilder.mongooseQuery;
    return courts;
  }
  async addToSaved(court: CourtEntity, userId: string): Promise<CourtEntity | null> {
    const updatedCourt = await CourtModel.findOneAndUpdate(
      { _id: court._id },
      { $addToSet: { savedBy: userId } },
      { returnDocument: 'after' } // Fixes deprecation warning
    );

    if (!updatedCourt) {
      return null;
    }

    // Convert to plain object so custom runtime properties like `isSaved` persist in JSON
    const result = updatedCourt.toObject();
    result.isSaved = true;

    return result as CourtEntity;
  }

  async removeFromSaved(court: CourtEntity, userId: string): Promise<CourtEntity | null> {
    const updatedCourt = await CourtModel.findOneAndUpdate({ _id: court._id },
      { $pull: { savedBy: userId } },
      { returnDocument: 'after' } // Fixes deprecation warning

    );
    if (!updatedCourt) {
      return null;
    }
    updatedCourt.isSaved = false;
    return updatedCourt;
  }
  async getSavedCourts(query: Record<string, any>, userId: string): Promise<listType<CourtEntity>> {
    const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel, {
      ...query,
      savedBy: userId, // ✅ Matches userId inside the savedBy array
    })
      .filter()
      .sort()
      .limitFields();

    const countDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

    queryBuilder.paginate(countDocuments);

    // ✅ Space separated projection + .lean() for attaching isSaved safely
    const courts = await queryBuilder.mongooseQuery
      .select("-__v -savedBy")
      .lean<CourtEntity[]>();
    if (!courts) {
      return {
        data: [],
        pagination: queryBuilder.pagination,
      };
    } else {
      const formattedCourts = courts.map((court: any) => ({
        ...court,
        isSaved: true,
      }));
      return {
        data: formattedCourts,
        pagination: queryBuilder.pagination,
      };
    }



  }
}


export const courtRepoImpl = new CourtRepoImpl();
