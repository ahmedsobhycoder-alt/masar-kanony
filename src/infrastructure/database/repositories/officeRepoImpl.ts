import OfficeRepo from "../../../domain/repositories/officeRepo";
import OfficesModel from "../models/officeModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class OfficeRepoImpl implements OfficeRepo {
    async countDocuments(): Promise<number> {
        return await OfficesModel.find().clone().countDocuments();
    }

    async createOffice(officeData: any): Promise<any> {
        const office = await OfficesModel.create(officeData);
        return office;
    }

    async getOffices(query: Record<string, any> = {}): Promise<{ data: any[]; pagination?: QueryPagination }> {
        const totalDocuments = await this.countDocuments();
        const queryBuilder = new QueryBuilder<any>(OfficesModel.find(), query)
            .filter()
            .paginate(totalDocuments)
            .sort()
            .limitFields();

        const offices = await queryBuilder.mongooseQuery.populate([
            { path: "floorId", select: "floorNumber" },
            { path: "courtId", select: "name" },
        ]);

        return {
            data: offices.map((office: any) => office.toJSON ? office.toJSON() : office),
            pagination: queryBuilder.pagination,
        };
    }

    async getOfficeById(id: string): Promise<any> {
        const office = await OfficesModel.findById(id);
        return office;
    }

    async deleteOfficeById(id: string): Promise<any> {
        const office = await OfficesModel.findByIdAndDelete(id);
        return office;
    }
}

const officeRepoImpl = new OfficeRepoImpl();
export default officeRepoImpl;