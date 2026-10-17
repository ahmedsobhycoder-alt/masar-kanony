import CourtTypeRepo from "../../../domain/repositories/courtTypeRepo";
import { CourtTypeEntity } from "../../../domain/entities/courtTypeEntity";
import CourtTypeModel from "../models/courtTypeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import CourtModel from "../models/courtModel";
import ApiError from "../../../shared/errors/apiError";

class CourtTypeRepoImpl implements CourtTypeRepo {
  async countDocuments(): Promise<number> {
    return await CourtTypeModel.find().clone().countDocuments();
  }

  async createCourtType(courtTypeData: CourtTypeEntity): Promise<CourtTypeEntity> {
    return await CourtTypeModel.create(courtTypeData);
  }

async getCourtTypes(
  query: Record<string, any> = {}
): Promise<listType<CourtTypeEntity>> {
  return await new QueryBuilder<CourtTypeEntity>(CourtTypeModel, query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .execute();
}
  async getCourtTypeById(id: string): Promise<CourtTypeEntity | null> {
    const courtType = await CourtTypeModel.findById(id);
    return courtType ? (courtType.toJSON() as CourtTypeEntity) : null;
  }

  async updateCourtTypeById(id: string, data: Partial<CourtTypeEntity>): Promise<CourtTypeEntity | null> {
    const existing = await CourtTypeModel.findById(id).lean<CourtTypeEntity | null>();
    if (!existing) return null;
    const updated = await CourtTypeModel.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
    }).lean<CourtTypeEntity | null>();
    if (updated && data.name && data.name !== existing.name) {
      await CourtModel.updateMany({ courtType: existing.name }, { $set: { courtType: data.name } });
    }
    return updated;
  }

  async deleteCourtTypeById(id: string): Promise<CourtTypeEntity | null> {
    const existing = await CourtTypeModel.findById(id);
    if (existing && await CourtModel.exists({ courtType: existing.name })) {
      throw new ApiError(400, "Court type is in use by a court");
    }
    const courtType = await CourtTypeModel.findByIdAndDelete(id);
    return courtType ? (courtType.toJSON() as CourtTypeEntity) : null;
  }
}

const courtTypeRepoImpl = new CourtTypeRepoImpl();
export default courtTypeRepoImpl;
export { CourtTypeRepoImpl };
