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
    async countDocuments(): Promise<number> {
        return await GovernorateModel.find().clone().countDocuments();
    }

    async createGovernorate(
        governorateData: GovernorateEntity,
    ): Promise<GovernorateEntity> {
        return await GovernorateModel.create(governorateData);
    }

    async getGovernorates(query: ParsedQs): Promise<{ data: GovernorateEntity[], pagination?: QueryPagination }> {

        return this.getAllPaginated(query);
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
