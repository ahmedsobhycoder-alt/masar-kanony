import { FloorRepo } from "../repositories/floorRepo";
import { FloorEntity } from "../entities/floorEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export class FloorUseCases {
    private readonly floorRepo: FloorRepo;

    constructor({ floorRepo }: { floorRepo: FloorRepo }) {
        this.floorRepo = floorRepo;
    }

    createFloor = async (floorData: FloorEntity): Promise<FloorEntity> => this.floorRepo.createFloor(floorData);
    getFloors = async (query: Record<string, any> = {}): Promise<{ data: FloorEntity[]; pagination?: QueryPagination }> => this.floorRepo.getFloors(query);
    getFloorById = async (id: string): Promise<FloorEntity | null> => this.floorRepo.getFloorById(id);

    deleteFloorById = async (id: string): Promise<FloorEntity | null> => this.floorRepo.deleteFloorById(id);
    countDocuments = async (): Promise<number> => this.floorRepo.countDocuments();
}