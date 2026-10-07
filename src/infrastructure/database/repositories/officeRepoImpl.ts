import OfficeRepo from "../../../domain/repositories/officeRepo";
import OfficesModel from "../models/officeModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
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
    ): Promise<{ data: OfficeEntity[]; pagination?: QueryPagination }> {
        // 1. Build the base query with filters, sorting, and field limiting
        const queryBuilder = new QueryBuilder<OfficeEntity>(OfficesModel, query)
            .filter()
            .sort()
            .limitFields();

        // 2. Clone and count documents matching the applied filters
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);

        // 4. Execute query with population and .lean() for performance
        const offices = await queryBuilder.mongooseQuery
            .populate([
                { path: "floorId", select: "floorNumber" },
                { path: "courtId", select: "name" },
            ])
            .lean<OfficeEntity[]>();

        return {
            data: offices || [],
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