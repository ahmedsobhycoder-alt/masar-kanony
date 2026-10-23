import { FloorRepo } from "../../../domain/repositories/floorRepo";
import { FloorEntity } from "../../../domain/entities/floorEntity";
import FloorModel from "../models/floorModel";
import OfficeModel from "../models/officeModel";
import CourtModel from "../models/courtModel";
import ApiError from "../../../shared/errors/apiError";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class FloorRepoImpl implements FloorRepo {
    async countDocuments(): Promise<number> {
        return await FloorModel.find().clone().countDocuments();
    }

    async createFloor(floorData: FloorEntity): Promise<FloorEntity> {
        try {
            const floor = await FloorModel.create(floorData);
            return await floor.populate(["offices"]);
        } catch (error: any) {
            console.error("[Floor create] Database save failed:", error);
            if (error?.code === 11000 && error?.keyPattern?.floorName) {
                if (!error.keyPattern.court) {
                    throw new ApiError(409, "Floor setup requires a database index migration. Contact the administrator.");
                }
                throw new ApiError(409, "This floor already exists in the specified court");
            }
            throw error;
        }
    }

    async getFloors(
        query: Record<string, any> = {}
    ): Promise<listType<FloorEntity>> {
        return await new QueryBuilder<FloorEntity>(FloorModel, query)
            .filter()
            .sort()
            .limitFields()
            .populate([{ path: "offices" }, { path: "court" }])
            .paginate()
            .execute();
    }
    async getFloorById(id: string): Promise<FloorEntity | null> {
        const floor = await FloorModel.findById(id);
        return floor ? (floor.toJSON() as FloorEntity) : null;
    }

    async updateFloorById(id: string, data: Partial<FloorEntity>): Promise<FloorEntity | null> {
        const floor = await FloorModel.findByIdAndUpdate(id, { $set: data }, {
            new: true,
            runValidators: true,
        }).lean<FloorEntity | null>();
        if (floor && data.floorName !== undefined) {
            await OfficeModel.updateMany({ floor: id }, { $set: { floorName: floor.floorName } });
        }
        return floor;
    }

    async getFloorsByCourtId(court: string): Promise<listType<FloorEntity>> {
        return await new QueryBuilder<FloorEntity>(FloorModel, { court })
            .filter()
            .execute();
    }

    async deleteFloorById(id: string): Promise<FloorEntity | null> {
        const floor = await FloorModel.findById(id);

        if (!floor) {
            return null;
        }

        if (await OfficeModel.exists({ floor: id })) {
            throw new ApiError(400, "Delete the floor's offices before deleting the floor");
        }

        await CourtModel.updateOne({ _id: floor.court } as any, { $pull: { floors: floor._id } });
        await floor.deleteOne();
        return floor.toJSON() as FloorEntity;
    }
}

export const floorRepoImpl = new FloorRepoImpl();

