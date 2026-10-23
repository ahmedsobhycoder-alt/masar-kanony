import { CourtRepo } from "../repositories/courtRepo";
import CourtEntity from "../entities/courtEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";
import listType from "../../shared/constants/types";

export class CourtUseCases {
    private readonly courtRepo: CourtRepo;

    constructor({ courtRepo }: { courtRepo: CourtRepo }) {
        this.courtRepo = courtRepo;
    }

    async createCourt(courtData: CourtEntity): Promise<CourtEntity> {
        return await this.courtRepo.createCourt(courtData);
    }

    async getAllCourts(queries:Record<string, any> = {}): Promise<listType<CourtEntity>> {
        return await this.courtRepo.getCourts(queries);
    }

    async getCourtById(id: string, userId?: string): Promise<CourtEntity | null> {
        return await this.courtRepo.getCourtById(id, userId);
    }
    async updateCourtById(id: string, courtData: Partial<CourtEntity>): Promise<CourtEntity | null> {
        return await this.courtRepo.updateCourtById(id, courtData);
    }
    async deleteCourtById(id: string): Promise<CourtEntity | null> {
        return await this.courtRepo.deleteCourtById(id);
    }
    async getMostSeenCourts(
        queries: Record<string, any> = {}
    ): Promise<listType<CourtEntity>> {
        return await this.courtRepo.getMostSeenCourts(queries);
    }
    addToSaved=(court: CourtEntity,
        userId:string) : Promise<CourtEntity|null> => this.courtRepo.addToSaved(court,userId)
    removeFromSaved=(court: CourtEntity,userId:string):Promise<CourtEntity|null>=> this.courtRepo.removeFromSaved(court,userId)
    getSavedCourts = (
        queryies: Record<string, any>,
      
    ): Promise<listType<CourtEntity>> => this.courtRepo.getSavedCourts(queryies);


}