import { FloorRepo } from "../../../domain/repositories/floorRepo";
import { FloorEntity } from "../../../domain/entities/floorEntity";
import FloorModel from "../models/floorModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class FloorRepoImpl implements FloorRepo {
    async countDocuments(): Promise<number> {
        return await FloorModel.find().clone().countDocuments();
    }

    async createFloor(floorData: FloorEntity): Promise<FloorEntity> {
        const floor = await FloorModel.create(floorData);
        return await floor.populate(["offices"]);
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

        return floor.toJSON() as FloorEntity;
    }
}

export const floorRepoImpl = new FloorRepoImpl();

