import GovernorateRepo from "../../../domain/repositories/governorateRepo";
import GovernorateEntity from "../../../domain/entities/governorateEntity";
import GovernorateModel from "../models/governorateModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
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
    ): Promise<listType<GovernorateEntity>> {
        return await new QueryBuilder<GovernorateEntity>(GovernorateModel, query)
            .filter()
            .sort({createdAt:1})
            .limitFields()
            .paginate()
            .execute();
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
