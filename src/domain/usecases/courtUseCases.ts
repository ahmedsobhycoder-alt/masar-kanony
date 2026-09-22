import { CourtRepo } from "../repositories/courtRepo";
import CourtEntity from "../entities/courtEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export class CourtUseCases {
    private readonly courtRepo: CourtRepo;

    constructor({ courtRepo }: { courtRepo: CourtRepo }) {
        this.courtRepo = courtRepo;
    }

    async createCourt(courtData: CourtEntity): Promise<CourtEntity> {
        return await this.courtRepo.createCourt(courtData);
    }

    async getAllCourts(query: Record<string, any> = {}): Promise<{ data: CourtEntity[]; pagination?: QueryPagination }> {
        return await this.courtRepo.getCourts(query);
    }

    async getCourtById(id: string): Promise<CourtEntity | null> {
        return await this.courtRepo.getCourtById(id);
    }

    countDocuments = async (): Promise<number> => this.courtRepo.countDocuments();
}