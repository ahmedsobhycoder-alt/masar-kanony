import CourtEntity from "../../../domain/entities/courtEntity";
import { CourtRepo } from "../../../domain/repositories/courtRepo";
import CourtModel from "../models/courtModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class CourtRepoImpl implements CourtRepo {

  async createCourt(courtData: CourtEntity) {
    return await CourtModel.create(courtData);
  }

  async getCourts(
    userId?: string,
    query: Record<string, any> = {},
    otherQueries: Record<string, any>={}
  ): Promise<listType<CourtEntity>> {
    // 1. Build base query
    const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel, query);

    const courts = await queryBuilder.filter(otherQueries)
      .sort()
      .limitFields()
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
      .paginate().execute();
    if (userId)
      courts.data = this.checkUserSavedCourts(courts.data, userId);
    return courts;
  }
  async getCourtById(id: string, userId?: string): Promise<CourtEntity | null> {
    const court = await CourtModel.findByIdAndUpdate(id, {
      $inc: { nViews: 1 },
    }, { new: true })
      .populate({
        path: "floors",
        populate: [
          {
            path: "offices",
            populate: [
              {
                path: "officeType",
                select: "name description-floor-court",
              },
            ],
          },
        ],
      })
      .lean<CourtEntity | null>();

    if (!court) {
      return null;
    }

    const isSaved = userId
      ? Boolean((court.savedBy ?? []).some((savedUserId: any) => savedUserId?.toString() === userId))
      : false;

    delete (court as Partial<CourtEntity>).savedBy;

    return {
      ...court,
      isSaved,
    } as CourtEntity;
  }


  async deleteCourtById(id: string) {
    return await CourtModel.findByIdAndDelete(id);
  }
  async getMostSeenCourts(
    userId?: string,
    query: Record<string, any> = {},
    otherQueries: Record<string, any> = {}
  ): Promise<listType<CourtEntity>> {
    const courts= await new QueryBuilder<CourtEntity>(CourtModel, query)
      .filter(otherQueries)
      .sort({ nViews: -1 })
      .limitFields()
      .execute();
          if (userId)
      courts.data = this.checkUserSavedCourts(courts.data, userId);

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
    const { savedBy, ...savedCourt } = result;

    return savedCourt as CourtEntity;
  }

  async removeFromSaved(court: CourtEntity, userId: string): Promise<CourtEntity | null> {
    const updatedCourt = await CourtModel.findOneAndUpdate({ _id: court._id },
      { $pull: { savedBy: userId } },
      { returnDocument: 'after' } // Fixes deprecation warning

    );
    if (!updatedCourt) {
      return null;
    }
    const result = updatedCourt.toObject();
    result.isSaved = true;
    const { savedBy, ...removedCourt } = result;

    return removedCourt as CourtEntity;
  }
  async getSavedCourts(
    query: Record<string, any>,
    userId: string,
    otherQueries: Record<string, any> = {}
  ): Promise<listType<CourtEntity>> {
    const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel, {
      ...query,
      savedBy: userId, // ✅ Matches userId inside the savedBy array
    })
    .filter(otherQueries)
      .sort()
      .limitFields()
      .paginate();

    queryBuilder.mongooseQuery.select("-__v -savedBy");
    const courts = await queryBuilder.execute();
    courts.data = courts.data.map((court) => ({ ...court, isSaved: true }));
    return courts;
  }
  checkUserSavedCourts = (courts: CourtEntity[], userId: string) =>
    (courts || []).map((court) => {
      const isSaved = Boolean(court.savedBy?.some((id: any) => id.toString() === userId.toString));
      // Delete savedBy so it's not exposed to the client
      delete court.savedBy;
      court.isSaved = isSaved;
      return court;
    });

}


export const courtRepoImpl = new CourtRepoImpl();
