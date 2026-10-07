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

async getCourtTypes(
  query: Record<string, any> = {}
): Promise<{ data: CourtTypeEntity[]; pagination?: QueryPagination }> {
  // 1. Build the base query with filters, search, sorting, and field limiting
  const queryBuilder = new QueryBuilder<CourtTypeEntity>(CourtTypeModel, query)
    .filter()
    .sort()
    .limitFields();

  // 2. Clone and count documents matching the filtered/searched criteria
  const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

  // 3. Apply pagination using the actual matched count
  queryBuilder.paginate(totalDocuments);

  // 4. Execute the query with lean for performance
  const courtTypes = await queryBuilder.mongooseQuery.lean<CourtTypeEntity[]>();

  return {
    data: courtTypes || [],
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
