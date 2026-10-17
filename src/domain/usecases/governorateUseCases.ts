import GovernorateEntity from "../entities/governorateEntity";
import GovernorateRepo from "../repositories/governorateRepo";
import listType from "../../shared/constants/types";
export class GovernorateUseCases {
  private readonly governorateRepo: GovernorateRepo;

  constructor({ governorateRepo }: { governorateRepo: GovernorateRepo }) {
    this.governorateRepo = governorateRepo;
  }

  createGovernorate = async (governorateData: GovernorateEntity): Promise<GovernorateEntity> =>
    this.governorateRepo.createGovernorate(governorateData);

  getGovernorates = async (query: {}): Promise<listType<GovernorateEntity>> =>
    this.governorateRepo.getGovernorates(query);

  getGovernorateById = async (id: string): Promise<GovernorateEntity | null> =>
    this.governorateRepo.getGovernorateById(id);

  updateGovernorateById = async (id: string, data: Partial<GovernorateEntity>): Promise<GovernorateEntity | null> =>
    this.governorateRepo.updateGovernorateById(id, data);

  deleteGovernorateById = async (id: string): Promise<GovernorateEntity | null> =>
    this.governorateRepo.deleteGovernorateById(id);

}
