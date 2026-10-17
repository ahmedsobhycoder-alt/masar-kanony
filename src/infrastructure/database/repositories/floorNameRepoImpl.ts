import FloorNameRepo from "../../../domain/repositories/floorNameRepo";
import FloorNameEntity from "../../../domain/entities/floorNameEntity";
import FloorNameModel from "../models/floorNameModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import FloorModel from "../models/floorModel";
import ApiError from "../../../shared/errors/apiError";

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

  async updateFloorNameById(id: string, data: Partial<FloorNameEntity>): Promise<FloorNameEntity | null> {
    const existing = await FloorNameModel.findById(id).lean<FloorNameEntity | null>();
    if (!existing) return null;
    const updated = await FloorNameModel.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
    }).lean<FloorNameEntity | null>();
    if (updated && data.name && data.name !== existing.name) {
      await FloorModel.updateMany({ floorName: existing.name }, { $set: { floorName: data.name } });
    }
    return updated;
  }

  async deleteFloorNameById(id: string): Promise<FloorNameEntity | null> {
    const existing = await FloorNameModel.findById(id);
    if (existing && await FloorModel.exists({ floorName: existing.name })) {
      throw new ApiError(400, "Floor name is in use by a floor");
    }
    const floorName = await FloorNameModel.findByIdAndDelete(id);
    return floorName ? (floorName.toJSON() as FloorNameEntity) : null;
  }
}

const floorNameRepoImpl = new FloorNameRepoImpl();
export default floorNameRepoImpl;
export { FloorNameRepoImpl };
