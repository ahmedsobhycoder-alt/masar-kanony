import { FloorRepo } from "../repositories/floorRepo";
import { FloorEntity } from "../entities/floorEntity";
import listType from "../../shared/constants/types";

export class FloorUseCases {
    private readonly floorRepo: FloorRepo;

    constructor({ floorRepo }: { floorRepo: FloorRepo }) {
        this.floorRepo = floorRepo;
    }

    createFloor = async (floorData: FloorEntity): Promise<FloorEntity> => this.floorRepo.createFloor(floorData);
    getFloors = async (query: Record<string, any> = {}): Promise<listType<FloorEntity>> => this.floorRepo.getFloors(query);
    getFloorById = async (id: string): Promise<FloorEntity | null> => this.floorRepo.getFloorById(id);

    deleteFloorById = async (id: string): Promise<FloorEntity | null> => this.floorRepo.deleteFloorById(id);
    countDocuments = async (): Promise<number> => this.floorRepo.countDocuments();
}