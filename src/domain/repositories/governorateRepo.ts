import GovernorateEntity from "../entities/governorateEntity";
import { ParsedQs } from "qs";
import listType from "../../shared/constants/types";
interface GovernorateRepo {
  createGovernorate(governorateData: GovernorateEntity): Promise<GovernorateEntity>;
  getGovernorates(query:ParsedQs): Promise<listType<GovernorateEntity>>;
  getGovernorateById(id: string): Promise<GovernorateEntity | null>;
  deleteGovernorateById(id: string): Promise<GovernorateEntity | null>;
}

export default GovernorateRepo;
