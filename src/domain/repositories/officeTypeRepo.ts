import { OfficeTypeEntity } from "../entities/officeTypeEntity";
import listType from "../../shared/constants/types";

interface OfficeTypeRepo {
  createOfficeType(officeTypeData: OfficeTypeEntity): Promise<OfficeTypeEntity>;
  getOfficeTypes(query?: Record<string, any>): Promise<listType<OfficeTypeEntity>>;
  getOfficeTypeById(id: string): Promise<OfficeTypeEntity | null>;
  deleteOfficeTypeById(id: string): Promise<OfficeTypeEntity | null>;
}

export default OfficeTypeRepo;
