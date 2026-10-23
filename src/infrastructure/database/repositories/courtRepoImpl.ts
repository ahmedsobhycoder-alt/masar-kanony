import CourtEntity from "../../../domain/entities/courtEntity";
import { CourtRepo } from "../../../domain/repositories/courtRepo";
import CourtModel from "../models/courtModel";
import FloorModel from "../models/floorModel";
import OfficeModel from "../models/officeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class CourtRepoImpl implements CourtRepo {

  async createCourt(courtData: CourtEntity) {
    return await CourtModel.create(courtData);
  }

 async getCourts(
    queries: Record<string, any> = {}
): Promise<listType<CourtEntity>> {
    const { userId, ...otherQueries } = queries;

    // If 'name' is provided, expand it across name, governorate, and courtType
    if (otherQueries.name && typeof otherQueries.name === "string") {
        const searchTerm = otherQueries.name;
        delete otherQueries.name; // remove so it doesn't filter by name alone

        otherQueries.$or = [
            { name: searchTerm },
            { governorate: searchTerm },
            { courtType: searchTerm }
        ];
    }

    // Pass the modified query object to the QueryBuilder
    const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel, otherQueries);

    const courts = await queryBuilder
        .filter(otherQueries)
        .sort()
        .limitFields()
        .populate({
            path: "floors",
            select: "-court",
            populate: [
                {
                    path: "offices",
                    select: "officeType roomNumber locationDirection startingWorkingHours endWorkingHours services",
                },
            ],
        })
        .paginate()
        .execute();

    if (userId) {
        courts.data = this.checkUserSavedCourts(courts.data, userId);
    }

    return courts;
}
   async getSavedCourts(

    queries: Record<string, any> = {}
  ): Promise<listType<CourtEntity>> {
        const {userId,...otherQueries}=queries;

    const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel, {
      ...otherQueries,
      savedBy: userId, // ✅ Matches userId inside the savedBy array
    })
    const courts= await queryBuilder.filter(otherQueries)
      .sort()
      .limitFields("-__v -savedBy")
      .paginate()
      .execute();
      courts.data.forEach((court) => {
        court.isSaved = true;
        delete (court as Partial<CourtEntity>).savedBy;
      });
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
                select: "name description",
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

  async updateCourtById(id: string, courtData: Partial<CourtEntity>): Promise<CourtEntity | null> {
    const court = await CourtModel.findByIdAndUpdate(id, { $set: courtData }, {
      new: true,
      runValidators: true,
    }).lean<CourtEntity | null>();
    if (court) await OfficeModel.updateMany({ court: id }, { $set: {
      courtName: court.name, governorate: court.governorate, courtType: court.courtType,
    } });
    return court;
  }


  async deleteCourtById(id: string) {
    const court = await CourtModel.findById(id);
    if (!court) return null;

    const floors = await FloorModel.find({ court: id } as any).select("_id").lean();
    // Match both ownership links, including offices missing from floor.offices.
    await OfficeModel.deleteMany({
      $or: [{ court: id }, { floor: { $in: floors.map((floor) => floor._id) } }],
    });
    await FloorModel.deleteMany({ court: id } as any);
    // Keep the court until child deletion succeeds so failed requests can be retried.
    return await CourtModel.findByIdAndDelete(id);
  }
  async getMostSeenCourts(
    queries: Record<string, any> = {}
  ): Promise<listType<CourtEntity>> {
            const {userId,...otherQueries}=queries;

    const courts= await new QueryBuilder<CourtEntity>(CourtModel, queries)
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
