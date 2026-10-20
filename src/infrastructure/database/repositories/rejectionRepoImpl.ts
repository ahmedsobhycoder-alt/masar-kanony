import RejectionEntity from "../../../domain/entities/rejectionEntity";
import listType from "../../../shared/constants/types";
import RejectionRepo from "../../../domain/repositories/rejectionRepo";
import RejectionModel from "../models/rejectionModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";


class RejectionRepoImpl implements RejectionRepo {
   async getRejections(query: Record<string, any>): Promise<listType<RejectionEntity>> {
   const queryBuilder : QueryBuilder = new QueryBuilder<RejectionEntity>(RejectionModel, query);

        return await queryBuilder
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .execute(); 
    }
    async createRejection(rejectionData: RejectionEntity): Promise<RejectionEntity> {

        const rejection = await RejectionModel.create(rejectionData);
        return rejection;
    }
    async getRejectionById(id: string): Promise<RejectionEntity | null> {
        const rejection = await RejectionModel.findById(id).lean();
        return rejection as RejectionEntity | null;
    }

    async updateRejectionById(
        id: string,
        updateData: Partial<RejectionEntity>
    ): Promise<RejectionEntity | null> {
        const updated = await RejectionModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();
        return updated as RejectionEntity | null;
    }

    async deleteRejectionById(id: string): Promise<RejectionEntity | null> {
        const deleted = await RejectionModel.findByIdAndDelete(id).lean();
        return deleted as RejectionEntity | null;
    }
}
export default  RejectionRepoImpl;