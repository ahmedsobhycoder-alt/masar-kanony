import OfficeEntity from "../entities/officeEntity";
import OfficeRepo from "../repositories/officeRepo";
import listType from "../../shared/constants/types";

class OfficeUseCases {
    private readonly officeRepo: OfficeRepo;

    constructor({ officeRepo }: { officeRepo: OfficeRepo }) {
        this.officeRepo = officeRepo;
    }

    createOffice(officeData: OfficeEntity): Promise<OfficeEntity> {
        return this.officeRepo.createOffice(officeData);
    }

    getOffices(query: Record<string, any> = {}): Promise<listType<OfficeEntity>> {
        return this.officeRepo.getOffices(query);
    }

    getOfficeById(id: string, userId?: string): Promise<OfficeEntity | null> {
        return this.officeRepo.getOfficeById(id, userId);
    }

    updateOfficeById(id: string, data: Partial<OfficeEntity>): Promise<OfficeEntity | null> {
        return this.officeRepo.updateOfficeById(id, data);
    }

    deleteOfficeById(id: string): Promise<OfficeEntity | null> {
        return this.officeRepo.deleteOfficeById(id);
    }

    addToSaved(office: OfficeEntity, userId: string): Promise<OfficeEntity | null> {
        return this.officeRepo.addToSaved(office, userId);
    }

    removeFromSaved(office: OfficeEntity, userId: string): Promise<OfficeEntity | null> {
        return this.officeRepo.removeFromSaved(office, userId);
    }

    getSavedOffices(queries: Record<string, any>): Promise<listType<OfficeEntity>> {
        return this.officeRepo.getSavedOffices(queries);
    }

}

export default OfficeUseCases
