import FloorNameEntity from "../entities/floorNameEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface FloorNameRepo {
  createFloorName(floorNameData: FloorNameEntity): Promise<FloorNameEntity>;
  getFloorNames(query?: Record<string, any>): Promise<{ data: FloorNameEntity[]; pagination?: QueryPagination }>;
  getFloorNameById(id: string): Promise<FloorNameEntity | null>;
  deleteFloorNameById(id: string): Promise<FloorNameEntity | null>;
  countDocuments(): Promise<number>;
}

export default FloorNameRepo;
