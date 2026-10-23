import OfficeRepo from "../../../domain/repositories/officeRepo";
import OfficesModel from "../models/officeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import OfficeEntity from "../../../domain/entities/officeEntity";
import OfficeTypeModel from "../models/officeTypeModel";
import ApiError from "../../../shared/errors/apiError";

class OfficeRepoImpl implements OfficeRepo {
    async countDocuments(): Promise<number> {
        return await OfficesModel.find().clone().countDocuments();
    }

    async createOffice(officeData: any): Promise<any> {
     
        const office = await OfficesModel.create(officeData);
        return office;
    }

async getOffices(
    queries: Record<string, any> = {}
): Promise<listType<OfficeEntity>> {
    const { userId, ...otherQueries } = queries;

    if (typeof otherQueries.name === "string" && otherQueries.name.trim()) {
        const term = otherQueries.name.trim();
        delete otherQueries.name;
        otherQueries.$or = ["name", "governorate", "courtName", "courtType"].map(field => ({ [field]: term }));
    }

    // Pass the query object to QueryBuilder exactly like getCourts
    const queryBuilder = new QueryBuilder<OfficeEntity>(OfficesModel, otherQueries);

    const offices = await queryBuilder
        .filter(otherQueries)
        .sort()
        .limitFields()
        .paginate()
        .execute();


    return offices;
}
    async getOfficeById(id: string): Promise<any> {
        const office = await OfficesModel.findById(id);
        return office;
    }

    async updateOfficeById(id: string, data: Partial<OfficeEntity>): Promise<OfficeEntity | null> {
        const office = await OfficesModel.findById(id);
        if (!office) return null;
        if (data.officeType) {
            const type = await OfficeTypeModel.findById(data.officeType);
            if (!type) throw new ApiError(400, "Office type does not exist");
            data.name = type.name;
        }
        if (data.roomNumber !== undefined) {
            data.roomNumber = String(data.roomNumber).trim();
            if (!data.roomNumber) throw new ApiError(400, "Room number is required");
            const duplicate = await OfficesModel.exists({ floor: office.floor, roomNumber: data.roomNumber, _id: { $ne: id } });
            if (duplicate) throw new ApiError(400, "An office with this room number already exists on this floor");
        }
        return OfficesModel.findByIdAndUpdate(id, { $set: data }, {
            new: true,
            runValidators: true,
        }).lean<OfficeEntity | null>();
    }

    async deleteOfficeById(id: string): Promise<any> {
        const office = await OfficesModel.findByIdAndDelete(id);
        return office;
    }
}

const officeRepoImpl = new OfficeRepoImpl();
export default officeRepoImpl;