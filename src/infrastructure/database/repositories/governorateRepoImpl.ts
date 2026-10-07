import GovernorateRepo from "../../../domain/repositories/governorateRepo";
import GovernorateEntity from "../../../domain/entities/governorateEntity";
import GovernorateModel from "../models/governorateModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
import { ParsedQs } from "qs";
import BaseRepository from "./baseRepository";
class GovernorateRepoImpl extends BaseRepository<GovernorateEntity> implements GovernorateRepo {

    constructor() {
        // Pass the GovernorateModel up to the BaseRepository
        super(GovernorateModel);
    }

    async createGovernorate(
        governorateData: GovernorateEntity,
    ): Promise<GovernorateEntity> {
        return await GovernorateModel.create(governorateData);
    }


    async getGovernorates(
        query: ParsedQs
    ): Promise<{ data: GovernorateEntity[]; pagination?: QueryPagination }> {
        // 1. Build base query with filter, sort, and field limits
        const queryBuilder = new QueryBuilder<GovernorateEntity>(GovernorateModel, query)
            .filter()
            .sort()
            .limitFields();

        // 2. Clone and count documents matching the applied filters
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);

        // 4. Execute query with .lean() for performance
        const governorates = await queryBuilder.mongooseQuery.lean<GovernorateEntity[]>();

        return {
            data: governorates || [],
            pagination: queryBuilder.pagination,
        };
    }


    async getGovernorateById(id: string): Promise<GovernorateEntity | null> {
        const governorate = await GovernorateModel.findById(id).lean();
        return governorate ? (governorate as GovernorateEntity) : null;
    }

    async deleteGovernorateById(id: string): Promise<GovernorateEntity | null> {
        const governorate = await GovernorateModel.findByIdAndDelete(id);
        return governorate ? (governorate.toJSON() as GovernorateEntity) : null;
    }
}

const governorateRepoImpl = new GovernorateRepoImpl();
export default governorateRepoImpl;
export { GovernorateRepoImpl };
