import FloorNameEntity from "../entities/floorNameEntity";
import FloorNameRepo from "../repositories/floorNameRepo";
import listType from "../../shared/constants/types";

export class FloorNameUseCases {
  private readonly floorNameRepo: FloorNameRepo;

  constructor({ floorNameRepo }: { floorNameRepo: FloorNameRepo }) {
    this.floorNameRepo = floorNameRepo;
  }

  createFloorName = async (floorNameData: FloorNameEntity): Promise<FloorNameEntity> =>
    this.floorNameRepo.createFloorName(floorNameData);

  getFloorNames = async (query: Record<string, any> = {}): Promise<listType<FloorNameEntity>> =>
    this.floorNameRepo.getFloorNames(query);

  getFloorNameById = async (id: string): Promise<FloorNameEntity | null> =>
    this.floorNameRepo.getFloorNameById(id);

  updateFloorNameById = async (id: string, data: Partial<FloorNameEntity>): Promise<FloorNameEntity | null> =>
    this.floorNameRepo.updateFloorNameById(id, data);

  deleteFloorNameById = async (id: string): Promise<FloorNameEntity | null> =>
    this.floorNameRepo.deleteFloorNameById(id);

  countDocuments = async (): Promise<number> => this.floorNameRepo.countDocuments();
}
