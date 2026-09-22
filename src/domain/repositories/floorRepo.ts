import { FloorEntity } from "../entities/floorEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export interface FloorRepo {
    createFloor(floorData: FloorEntity): Promise<FloorEntity>;
    getFloors(query?: Record<string, any>): Promise<{ data: FloorEntity[]; pagination?: QueryPagination }>;
    getFloorById(id: string): Promise<FloorEntity | null>;
    deleteFloorById(id: string): Promise<FloorEntity | null>;
    countDocuments(): Promise<number>;
}