import GovernorateRepo from "../../../domain/repositories/governorateRepo";
import GovernorateEntity from "../../../domain/entities/governorateEntity";
import GovernorateModel from "../models/governorateModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import { ParsedQs } from "qs";
import BaseRepository from "./baseRepository";
import CourtModel from "../models/courtModel";
import ApiError from "../../../shared/errors/apiError";
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

    async updateGovernorateById(id: string, data: Partial<GovernorateEntity>): Promise<GovernorateEntity | null> {
        const existing = await GovernorateModel.findById(id).lean<GovernorateEntity | null>();
        if (!existing) return null;
        const updated = await GovernorateModel.findByIdAndUpdate(id, { $set: data }, {
            new: true,
            runValidators: true,
        }).lean<GovernorateEntity | null>();
        if (updated && data.name && data.name !== existing.name) {
            await CourtModel.updateMany({ governorate: existing.name }, { $set: { governorate: data.name } });
        }
        return updated;
    }

    async deleteGovernorateById(id: string): Promise<GovernorateEntity | null> {
        const existing = await GovernorateModel.findById(id);
        if (existing && await CourtModel.exists({ governorate: existing.name })) {
            throw new ApiError(400, "Governorate is in use by a court");
        }
        const governorate = await GovernorateModel.findByIdAndDelete(id);
        return governorate ? (governorate.toJSON() as GovernorateEntity) : null;
    }
}

const governorateRepoImpl = new GovernorateRepoImpl();
export default governorateRepoImpl;
export { GovernorateRepoImpl };
