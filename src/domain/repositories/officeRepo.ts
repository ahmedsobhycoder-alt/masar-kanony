import OfficeEntity from "../../domain/entities/officeEntity";
import listType from "../../shared/constants/types";

interface OfficeRepo {
    createOffice(officeData: OfficeEntity): Promise<OfficeEntity>;
    getOffices(query?: Record<string, any>): Promise<listType<OfficeEntity>>;
    getOfficeById(id: string, userId?: string): Promise<OfficeEntity | null>;
    updateOfficeById(id: string, data: Partial<OfficeEntity>): Promise<OfficeEntity | null>;
    deleteOfficeById(id: string): Promise<OfficeEntity | null>;
    addToSaved(office: OfficeEntity, userId: string): Promise<OfficeEntity | null>;
    removeFromSaved(office: OfficeEntity, userId: string): Promise<OfficeEntity | null>;
    getSavedOffices(queries: Record<string, any>): Promise<listType<OfficeEntity>>;
}

export default OfficeRepo;
