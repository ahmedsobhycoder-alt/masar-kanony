import OfficeEntity from "../../domain/entities/officeEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface OfficeRepo {
    createOffice(officeData: OfficeEntity): Promise<OfficeEntity>;
    getOffices(query?: Record<string, any>): Promise<{ data: OfficeEntity[]; pagination?: QueryPagination }>;
    getOfficeById(id: string): Promise<OfficeEntity | null>;
    deleteOfficeById(id: string): Promise<OfficeEntity | null>;
    countDocuments(): Promise<number>;
}

export default OfficeRepo;