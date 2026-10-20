import listType from "../../shared/constants/types";
import RejectionEntity from "../entities/rejectionEntity";

interface RejectionRepo {
    createRejection(rejectionData: RejectionEntity): Promise<RejectionEntity>;
    getRejections(query: Record<string, any>): Promise<listType<RejectionEntity>>;
    getRejectionById(id: string): Promise<RejectionEntity | null>;
    deleteRejectionById(id: string): Promise<RejectionEntity | null>;
     updateRejectionById(
        id: string,
        updateData: Partial<RejectionEntity>
      ):Promise<RejectionEntity | null>  ;
}
export default RejectionRepo