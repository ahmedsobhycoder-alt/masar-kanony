import CourtTypeRepo from "../../../domain/repositories/courtTypeRepo";
import { CourtTypeEntity } from "../../../domain/entities/courtTypeEntity";
import CourtTypeModel from "../models/courtTypeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

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

  async deleteCourtTypeById(id: string): Promise<CourtTypeEntity | null> {
    const courtType = await CourtTypeModel.findByIdAndDelete(id);
    return courtType ? (courtType.toJSON() as CourtTypeEntity) : null;
  }
}

const courtTypeRepoImpl = new CourtTypeRepoImpl();
export default courtTypeRepoImpl;
export { CourtTypeRepoImpl };
