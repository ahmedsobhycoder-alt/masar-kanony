import RejectionRepo from "../repositories/rejectionRepo";
import RejectionEntity from "../entities/rejectionEntity";
import listType from "../../shared/constants/types";
class RejectionUseCases {
  readonly rejectionRepo: RejectionRepo;

  constructor({ rejectionRepo }: { rejectionRepo: RejectionRepo }) {
    this.rejectionRepo = rejectionRepo;
  }

  createRejection = (rejectionData: RejectionEntity): Promise<RejectionEntity> =>
    this.rejectionRepo.createRejection(rejectionData);

  getRejections = (
    query: Record<string, any>
  ): Promise<listType<RejectionEntity>> =>
    this.rejectionRepo.getRejections(query);

  getRejectionById = (id: string): Promise<RejectionEntity | null> =>
    this.rejectionRepo.getRejectionById(id);

  updateRejectionById = (
    id: string,
    updateData: Partial<RejectionEntity>
  ): Promise<RejectionEntity | null> =>
    this.rejectionRepo.updateRejectionById(id, updateData);

  deleteRejectionById = (id: string): Promise<RejectionEntity | null> =>
    this.rejectionRepo.deleteRejectionById(id);
}
export default RejectionUseCases;