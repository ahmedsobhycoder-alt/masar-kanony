import CourtTypeRepo from "../../../domain/repositories/courtTypeRepo";
import { CourtTypeEntity } from "../../../domain/entities/courtTypeEntity";
import CourtTypeModel from "../models/courtTypeModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class CourtTypeRepoImpl implements CourtTypeRepo {
  async countDocuments(): Promise<number> {
    return await CourtTypeModel.find().clone().countDocuments();
  }

  async createCourtType(courtTypeData: CourtTypeEntity): Promise<CourtTypeEntity> {
    return await CourtTypeModel.create(courtTypeData);
  }

  async getCourtTypes(query: Record<string, any> = {}): Promise<{ data: CourtTypeEntity[]; pagination?: QueryPagination }> {
    const totalDocuments = await this.countDocuments();
    const queryBuilder = new QueryBuilder<CourtTypeEntity>(CourtTypeModel.find(), query)
      .filter()
      .search(undefined, ["name"])
      .paginate(totalDocuments)
      .sort()
      .limitFields();

    const courtTypes = await queryBuilder.mongooseQuery;

    return {
      data: courtTypes.map((courtType) => {
        if (courtType && typeof (courtType as any).toJSON === "function") {
          return (courtType as any).toJSON() as CourtTypeEntity;
        }
        return courtType as CourtTypeEntity;
      }),
      pagination: queryBuilder.pagination,
    };
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
