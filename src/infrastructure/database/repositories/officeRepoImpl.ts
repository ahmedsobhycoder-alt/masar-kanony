import { Types } from "mongoose";
import OfficeRepo from "../../../domain/repositories/officeRepo";
import OfficesModel from "../models/officeModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import OfficeEntity from "../../../domain/entities/officeEntity";
import OfficeTypeModel from "../models/officeTypeModel";
import FloorModel from "../models/floorModel";
import CourtModel from "../models/courtModel";
import ApiError from "../../../shared/errors/apiError";

class OfficeRepoImpl implements OfficeRepo {
    async countDocuments(): Promise<number> {
        return await OfficesModel.find().clone().countDocuments();
    }

    async createOffice(officeData: any): Promise<any> {
        try {
            return await OfficesModel.create(officeData);
        } catch (error: any) {
            // A deployment that has not restarted yet can still have the old
            // unique compound index. Return an actionable response instead of
            // hiding it behind a generic 500 error.
            if (error?.code === 11000 && error?.keyPattern?.floor && error?.keyPattern?.roomNumber) {
                throw new ApiError(409, "Office room-number index is still active. Restart the backend to apply the database migration.");
            }
            throw error;
        }
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

    if (userId) {
        offices.data = this.checkUserSavedOffices(offices.data, userId);
    }

    return offices;
}
    async getSavedOffices(queries: Record<string, any> = {}): Promise<listType<OfficeEntity>> {
        const { userId, ...otherQueries } = queries;
        const queryBuilder = new QueryBuilder<OfficeEntity>(OfficesModel, {
            ...otherQueries,
            savedBy: userId,
        });
        const offices = await queryBuilder
            .filter(otherQueries)
            .sort()
            .limitFields("-__v -savedBy")
            .paginate()
            .execute();

        offices.data.forEach((office) => {
            office.isSaved = true;
            delete (office as Partial<OfficeEntity>).savedBy;
        });
        return offices;
    }

    async getOfficeById(id: string, userId?: string): Promise<OfficeEntity | null> {
        const office = await OfficesModel.findById(id).lean<OfficeEntity | null>();
        if (!office) return null;

        const isSaved = userId
            ? Boolean((office.savedBy ?? []).some((savedUserId: any) => savedUserId?.toString() === userId.toString()))
            : false;
        delete (office as Partial<OfficeEntity>).savedBy;

        return { ...office, isSaved } as OfficeEntity;
    }

    async updateOfficeById(id: string, data: Partial<OfficeEntity>): Promise<OfficeEntity | null> {
        const office = await OfficesModel.findById(id);
        if (!office) return null;
        if (data.officeType) {
            const type = await OfficeTypeModel.findById(data.officeType);
            if (!type) throw new ApiError(400, "Office type does not exist");
            data.name = type.name;
        }
        if (data.floor !== undefined || data.court !== undefined) {
            const floor = await FloorModel.findById(data.floor ?? office.floor);
            if (!floor) throw new ApiError(400, "Floor does not exist");
            if (data.court && String(floor.court) !== String(data.court)) {
                throw new ApiError(400, "Floor does not belong to the selected court");
            }
            const court = await CourtModel.findById(floor.court);
            if (!court) throw new ApiError(400, "Court does not exist");
            Object.assign(data, {
                floor: floor._id, floorName: floor.floorName, court: court._id,
                courtName: court.name, governorate: court.governorate, courtType: court.courtType,
            });
        }
        if (data.roomNumber !== undefined) {
            data.roomNumber = String(data.roomNumber).trim();
        }
        const moved = data.floor !== undefined && String(data.floor) !== String(office.floor);
        const updated = await OfficesModel.findByIdAndUpdate(id, { $set: data }, {
            new: true,
            runValidators: true,
        }).lean<OfficeEntity | null>();
        if (updated && moved) {
            await FloorModel.updateOne({ _id: office.floor }, { $pull: { offices: id } });
            await FloorModel.updateOne({ _id: updated.floor }, { $addToSet: { offices: id } });
            for (const floor of [office.floor, updated.floor]) {
                await OfficesModel.calculateNumberOfFOfficesPerFloor(floor, "move office");
            }
            for (const court of new Set([String(office.court), String(updated.court)])) {
                await OfficesModel.calculateNumberOfFOfficesPerCourt(new Types.ObjectId(court), "move office");
            }
        }
        return updated;
    }

    async deleteOfficeById(id: string): Promise<any> {
        const office = await OfficesModel.findByIdAndDelete(id);
        return office;
    }

    async addToSaved(office: OfficeEntity, userId: string): Promise<OfficeEntity | null> {
        const updatedOffice = await OfficesModel.findOneAndUpdate(
            { _id: office._id },
            { $addToSet: { savedBy: userId } },
            { returnDocument: "after" },
        );
        if (!updatedOffice) return null;

        const result = updatedOffice.toObject();
        result.isSaved = true;
        const { savedBy, ...savedOffice } = result;
        return savedOffice as OfficeEntity;
    }

    async removeFromSaved(office: OfficeEntity, userId: string): Promise<OfficeEntity | null> {
        const updatedOffice = await OfficesModel.findOneAndUpdate(
            { _id: office._id },
            { $pull: { savedBy: userId } },
            { returnDocument: "after" },
        );
        if (!updatedOffice) return null;

        const result = updatedOffice.toObject();
        result.isSaved = false;
        const { savedBy, ...removedOffice } = result;
        return removedOffice as OfficeEntity;
    }

    private checkUserSavedOffices = (offices: OfficeEntity[], userId: string): OfficeEntity[] =>
        (offices || []).map((office) => {
            office.isSaved = Boolean(office.savedBy?.some((id: any) => id.toString() === userId.toString()));
            delete (office as Partial<OfficeEntity>).savedBy;
            return office;
        });
}

const officeRepoImpl = new OfficeRepoImpl();
export default officeRepoImpl;
