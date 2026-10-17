import FloorNameEntity from "../entities/floorNameEntity";
import listType from "../../shared/constants/types";

interface FloorNameRepo {
  createFloorName(floorNameData: FloorNameEntity): Promise<FloorNameEntity>;
  getFloorNames(query?: Record<string, any>): Promise<listType<FloorNameEntity>>;
  getFloorNameById(id: string): Promise<FloorNameEntity | null>;
  updateFloorNameById(id: string, data: Partial<FloorNameEntity>): Promise<FloorNameEntity | null>;
  deleteFloorNameById(id: string): Promise<FloorNameEntity | null>;
  countDocuments(): Promise<number>;
}

export default FloorNameRepo;
