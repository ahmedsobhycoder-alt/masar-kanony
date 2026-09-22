import FloorNameEntity from "../entities/floorNameEntity";
import FloorNameRepo from "../repositories/floorNameRepo";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export class FloorNameUseCases {
  private readonly floorNameRepo: FloorNameRepo;

  constructor({ floorNameRepo }: { floorNameRepo: FloorNameRepo }) {
    this.floorNameRepo = floorNameRepo;
  }

  createFloorName = async (floorNameData: FloorNameEntity): Promise<FloorNameEntity> =>
    this.floorNameRepo.createFloorName(floorNameData);

  getFloorNames = async (query: Record<string, any> = {}): Promise<{ data: FloorNameEntity[]; pagination?: QueryPagination }> =>
    this.floorNameRepo.getFloorNames(query);

  getFloorNameById = async (id: string): Promise<FloorNameEntity | null> =>
    this.floorNameRepo.getFloorNameById(id);

  deleteFloorNameById = async (id: string): Promise<FloorNameEntity | null> =>
    this.floorNameRepo.deleteFloorNameById(id);

  countDocuments = async (): Promise<number> => this.floorNameRepo.countDocuments();
}
