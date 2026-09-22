import CourtEntity from "../../../domain/entities/courtEntity";
import { CourtRepo } from "../../../domain/repositories/courtRepo";
import CourtModel from "../models/courtModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class CourtRepoImpl implements CourtRepo {

    async countDocuments(): Promise<number> {
        return await CourtModel.find().clone().countDocuments();
    }

    async createCourt(courtData: CourtEntity) {
        return await CourtModel.create(courtData);
    }

    async getCourts(
        query: Record<string, any> = {}
    ): Promise<{ data: CourtEntity[]; pagination?: QueryPagination }> {
        const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel.find(), query)
            .filter();

        // Count matching courts before applying pagination.
        const totalCourts = await queryBuilder.mongooseQuery.clone().countDocuments();

        queryBuilder
            .paginate(totalCourts)
            .sort()
            .limitFields();

        const courts = await queryBuilder.mongooseQuery
            .populate("governorate")
            .populate("courtType")
            .populate({
                path: "floors",
                ref: "Floors",
                select: "-court ",
                populate: [
                    { path: "offices", select: "-floorId" },
                    { path: "floorName" },
                ],
            });

        return {
            data: courts,
            pagination: queryBuilder.pagination,
        };
    }

    async getCourtById(id: string) {
        return await CourtModel.findById(id).populate("floors", "-courtId");
    }

    async deleteCourtById(id: string) {
        return await CourtModel.findByIdAndDelete(id);
    }
}

export const courtRepoImpl = new CourtRepoImpl();
