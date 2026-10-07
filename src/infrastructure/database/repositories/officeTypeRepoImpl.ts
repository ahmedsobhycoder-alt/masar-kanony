import OfficeTypeRepo from "../../../domain/repositories/officeTypeRepo";
import { OfficeTypeEntity } from "../../../domain/entities/officeTypeEntity";
import OfficeTypeModel from "../models/officeTypeModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class OfficeTypeRepoImpl implements OfficeTypeRepo {

  async createOfficeType(officeTypeData: OfficeTypeEntity): Promise<OfficeTypeEntity> {
    return await OfficeTypeModel.create(officeTypeData);
  }

async getOfficeTypes(
  query: Record<string, any> = {}
): Promise<{ data: OfficeTypeEntity[]; pagination?: QueryPagination }> {
  // 1. Build base query with filter, search, sort, and field limits
  const queryBuilder = new QueryBuilder<OfficeTypeEntity>(OfficeTypeModel, query)
    .filter()
    .sort()
    .limitFields();

  // 2. Clone and count documents matching the filtered/searched criteria
  const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

  // 3. Apply pagination using the filtered count
  queryBuilder.paginate(totalDocuments);

  // 4. Execute query with .lean() for performance and plain objects
  const officeTypes = await queryBuilder.mongooseQuery.lean<OfficeTypeEntity[]>();

  return {
    data: officeTypes||[],
    pagination: queryBuilder.pagination,
  };
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
