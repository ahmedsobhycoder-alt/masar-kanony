import { FloorEntity } from "../entities/floorEntity";
import listType from "../../shared/constants/types";

export interface FloorRepo {
    createFloor(floorData: FloorEntity): Promise<FloorEntity>;
    getFloors(query?: Record<string, any>): Promise<listType<FloorEntity>>;
    getFloorById(id: string): Promise<FloorEntity | null>;
    updateFloorById(id: string, data: Partial<FloorEntity>): Promise<FloorEntity | null>;
    deleteFloorById(id: string): Promise<FloorEntity | null>;
    countDocuments(): Promise<number>;
}