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

  async getFloorNames(query: Record<string, any> = {}): Promise<{ data: FloorNameEntity[]; pagination?: QueryPagination }> {
    const totalDocuments = await this.countDocuments();
    const queryBuilder = new QueryBuilder<FloorNameEntity>(FloorNameModel.find(), query)
      .filter()
      .search(undefined, ["name"])
      .paginate(totalDocuments)
      .sort()
      .limitFields();

    const floorNames = await queryBuilder.mongooseQuery;

    return {
      data: floorNames.map((floorName) => {
        if (floorName && typeof (floorName as any).toJSON === "function") {
          return (floorName as any).toJSON() as FloorNameEntity;
        }
        return floorName as FloorNameEntity;
      }),
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
