import GovernorateEntity from "../entities/governorateEntity";
import { ParsedQs } from "qs";
import { QueryPagination } from "../../shared/utils/queryBuilder";
interface GovernorateRepo {
  createGovernorate(governorateData: GovernorateEntity): Promise<GovernorateEntity>;
  getGovernorates(query:ParsedQs): Promise<{data:GovernorateEntity[], pagination?: QueryPagination}>;
  getGovernorateById(id: string): Promise<GovernorateEntity | null>;
  deleteGovernorateById(id: string): Promise<GovernorateEntity | null>;
}

export default GovernorateRepo;
