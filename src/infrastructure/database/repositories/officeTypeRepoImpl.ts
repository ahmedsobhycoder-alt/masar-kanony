import OfficeTypeRepo from "../../../domain/repositories/officeTypeRepo";
import { OfficeTypeEntity } from "../../../domain/entities/officeTypeEntity";
import OfficeTypeModel from "../models/officeTypeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

import { nextOfficeTypeId } from "./officeTypeSequence";
import OfficeModel from "../models/officeModel";
import ApiError from "../../../shared/errors/apiError";

const handleTypeWrite = async <T>(operation: () => Promise<T>): Promise<T> => {
  try { return await operation(); }
  catch (error: any) {
    if (error?.code === 11000) throw new ApiError(409, "Office type ID or name already exists");
    throw error;
  }
};

class OfficeTypeRepoImpl implements OfficeTypeRepo {

  async createOfficeType(officeTypeData: Omit<OfficeTypeEntity, "id" | "_id">): Promise<OfficeTypeEntity> {
    const id = await nextOfficeTypeId();
    return handleTypeWrite(() => OfficeTypeModel.create({ ...officeTypeData, id }));
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

  async updateOfficeTypeById(id: string, data: Partial<OfficeTypeEntity>): Promise<OfficeTypeEntity | null> {
    const { id: ignoredId, _id: ignoredMongoId, ...updates } = data;
    const type = await handleTypeWrite(async () => OfficeTypeModel.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }));
    if (type) await OfficeModel.updateMany({ officeType: id }, { $set: { name: type.name } });
    return type ? type.toJSON() as OfficeTypeEntity : null;
  }

  async deleteOfficeTypeById(id: string): Promise<OfficeTypeEntity | null> {
    if (await OfficeModel.exists({ officeType: id })) throw new ApiError(409, "Office type is used by existing offices");
    const officeType = await OfficeTypeModel.findByIdAndDelete(id);
    return officeType ? (officeType.toJSON() as OfficeTypeEntity) : null;
  }
}

const officeTypeRepoImpl = new OfficeTypeRepoImpl();
export default officeTypeRepoImpl;
export { OfficeTypeRepoImpl };
