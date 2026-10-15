import FloorNameRepo from "../../../domain/repositories/floorNameRepo";
import FloorNameEntity from "../../../domain/entities/floorNameEntity";
import FloorNameModel from "../models/floorNameModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class FloorNameRepoImpl implements FloorNameRepo {
  async countDocuments(): Promise<number> {
    return await FloorNameModel.find().clone().countDocuments();
  }

  async createFloorName(floorNameData: FloorNameEntity): Promise<FloorNameEntity> {
    return await FloorNameModel.create(floorNameData);
  }

async getFloorNames(
  query: Record<string, any> = {}
): Promise<listType<FloorNameEntity>> {
  return await new QueryBuilder<FloorNameEntity>(FloorNameModel, query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .execute();
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
