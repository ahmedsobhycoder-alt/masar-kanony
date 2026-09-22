import { OfficeTypeEntity } from "../entities/officeTypeEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface OfficeTypeRepo {
  createOfficeType(officeTypeData: OfficeTypeEntity): Promise<OfficeTypeEntity>;
  getOfficeTypes(query?: Record<string, any>): Promise<{ data: OfficeTypeEntity[]; pagination?: QueryPagination }>;
  getOfficeTypeById(id: string): Promise<OfficeTypeEntity | null>;
  deleteOfficeTypeById(id: string): Promise<OfficeTypeEntity | null>;
  countDocuments(): Promise<number>;
}

export default OfficeTypeRepo;
