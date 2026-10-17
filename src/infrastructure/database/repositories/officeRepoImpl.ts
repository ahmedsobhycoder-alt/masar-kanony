import OfficeRepo from "../../../domain/repositories/officeRepo";
import OfficesModel from "../models/officeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import OfficeEntity from "../../../domain/entities/officeEntity";

class OfficeRepoImpl implements OfficeRepo {
    async countDocuments(): Promise<number> {
        return await OfficesModel.find().clone().countDocuments();
    }

    async createOffice(officeData: any): Promise<any> {
        const office = await OfficesModel.create(officeData);
        return office;
    }

    async getOffices(
        query: Record<string, any> = {}
    ): Promise<listType<OfficeEntity>> {
        return await new QueryBuilder<OfficeEntity>(OfficesModel, query)
            .filter()
            .sort()
            .limitFields()
            .populate([
                { path: "floor", select: "floorName" },
                { path: "court", select: "name" },
                { path: "officeType", select: "name" },
            ])
            .paginate()
            .execute();
    }

    async getOfficeById(id: string): Promise<any> {
        const office = await OfficesModel.findById(id);
        return office;
    }

    async updateOfficeById(id: string, data: Partial<OfficeEntity>): Promise<OfficeEntity | null> {
        return OfficesModel.findByIdAndUpdate(id, { $set: data }, {
            new: true,
            runValidators: true,
        }).lean<OfficeEntity | null>();
    }

    async deleteOfficeById(id: string): Promise<any> {
        const office = await OfficesModel.findByIdAndDelete(id);
        return office;
    }
}

const officeRepoImpl = new OfficeRepoImpl();
export default officeRepoImpl;