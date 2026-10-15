import OfficeTypeRepo from "../../../domain/repositories/officeTypeRepo";
import { OfficeTypeEntity } from "../../../domain/entities/officeTypeEntity";
import OfficeTypeModel from "../models/officeTypeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class OfficeTypeRepoImpl implements OfficeTypeRepo {

  async createOfficeType(officeTypeData: OfficeTypeEntity): Promise<OfficeTypeEntity> {
    return await OfficeTypeModel.create(officeTypeData);
  }

async getOfficeTypes(
  query: Record<string, any> = {}
): Promise<listType<OfficeTypeEntity>> {
  return await new QueryBuilder<OfficeTypeEntity>(OfficeTypeModel, query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .execute();
}

  async getOfficeTypeById(id: string): Promise<OfficeTypeEntity | null> {
    const officeType = await OfficeTypeModel.findById(id);
    return officeType ? (officeType.toJSON() as OfficeTypeEntity) : null;
  }

  async deleteOfficeTypeById(id: string): Promise<OfficeTypeEntity | null> {
    const officeType = await OfficeTypeModel.findByIdAndDelete(id);
    return officeType ? (officeType.toJSON() as OfficeTypeEntity) : null;
  }
}

const officeTypeRepoImpl = new OfficeTypeRepoImpl();
export default officeTypeRepoImpl;
export { OfficeTypeRepoImpl };
