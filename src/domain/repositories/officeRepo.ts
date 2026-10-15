import OfficeEntity from "../../domain/entities/officeEntity";
import listType from "../../shared/constants/types";

interface OfficeRepo {
    createOffice(officeData: OfficeEntity): Promise<OfficeEntity>;
    getOffices(query?: Record<string, any>): Promise<listType<OfficeEntity>>;
    getOfficeById(id: string): Promise<OfficeEntity | null>;
    deleteOfficeById(id: string): Promise<OfficeEntity | null>;
}

export default OfficeRepo;