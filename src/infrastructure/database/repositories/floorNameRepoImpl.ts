import FloorNameRepo from "../../../domain/repositories/floorNameRepo";
import FloorNameEntity from "../../../domain/entities/floorNameEntity";
import FloorNameModel from "../models/floorNameModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class FloorNameRepoImpl implements FloorNameRepo {
  async countDocuments(): Promise<number> {
    return await FloorNameModel.find().clone().countDocuments();
  }

  async createFloorName(floorNameData: FloorNameEntity): Promise<FloorNameEntity> {
    return await FloorNameModel.create(floorNameData);
  }

async getFloorNames(
  query: Record<string, any> = {}
): Promise<{ data: FloorNameEntity[]; pagination?: QueryPagination }> {
  // 1. Build base query with filter, sort, and field limits
  const queryBuilder = new QueryBuilder<FloorNameEntity>(FloorNameModel, query)
    .filter()
    .sort()
    .limitFields();

  // 2. Clone and count documents matching the applied filters
  const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

  // 3. Apply pagination using the filtered count
  queryBuilder.paginate(totalDocuments);

  // 4. Execute query with .lean() for plain objects
  const floorNames = await queryBuilder.mongooseQuery.lean<FloorNameEntity[]>();

  return {
    data: floorNames || [],
    pagination: queryBuilder.pagination,
  };
}
  async getFloorNameById(id: string): Promise<FloorNameEntity | null> {
    const floorName = await FloorNameModel.findById(id);
    return floorName ? (floorName.toJSON() as FloorNameEntity) : null;
  }

  async deleteFloorNameById(id: string): Promise<FloorNameEntity | null> {
    const floorName = await FloorNameModel.findByIdAndDelete(id);
    return floorName ? (floorName.toJSON() as FloorNameEntity) : null;
  }
}

const floorNameRepoImpl = new FloorNameRepoImpl();
export default floorNameRepoImpl;
export { FloorNameRepoImpl };
