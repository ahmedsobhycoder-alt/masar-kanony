import CourtEntity from "../../../domain/entities/courtEntity";
import { CourtRepo } from "../../../domain/repositories/courtRepo";
import CourtModel from "../models/courtModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
import { getMaxListeners } from "node:cluster";

class CourtRepoImpl implements CourtRepo {

    async createCourt(courtData: CourtEntity) {
        return await CourtModel.create(courtData);
    }

async getCourts(
        query: Record<string, any> = {}
    ): Promise<{ data: CourtEntity[]; pagination?: QueryPagination }> {
        // 1. Build the base query with all modifiers except pagination
        const queryBuilder = new QueryBuilder<CourtEntity>(CourtModel, query)
            .filter()
            .sort()
            .limitFields();

        // 2. Clone and count based on the filtered query
        const totalCourts = await queryBuilder.mongooseQuery.clone().countDocuments();

        // 3. Apply pagination using the total count
        queryBuilder.paginate(totalCourts);

        // 4. Execute the query
        const courts = await queryBuilder.mongooseQuery.populate({
            path: "floors",
            select: "-court-_id",
            populate: [
                { path: "offices",  select: "officeType roomNumber locationDirection startingWorkingHours endWorkingHours services" },
            ],
        });

        return {
            data: courts,
            pagination: queryBuilder.pagination,
        };
    }
    async getCourtById(id: string) {
        return await CourtModel.findByIdAndUpdate(id, {
            $inc: { nViews: 1 },
        }, { new: true }).populate({
            path: "floors",
            populate: [
                { path: "offices", populate: [
                    {
                        path: "officeType",
                        select : "name description-floor-court"
                    }
                ] ,  },
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
}

export const courtRepoImpl = new CourtRepoImpl();
