import { FloorRepo } from "../../../domain/repositories/floorRepo";
import { FloorEntity } from "../../../domain/entities/floorEntity";
import FloorModel from "../models/floorModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class FloorRepoImpl implements FloorRepo {
    async countDocuments(): Promise<number> {
        return await FloorModel.find().clone().countDocuments();
    }

    async createFloor(floorData: FloorEntity): Promise<FloorEntity> {
        const floor = await FloorModel.create(floorData);
        return await floor.populate(["offices", {
            path: "court",
            populate: { path: "governorate" },
        }]);
    }

    async getFloors(query: Record<string, any> = {}): Promise<{ data: FloorEntity[]; pagination?: QueryPagination }> {
        
        const queryBuilder = new QueryBuilder<FloorEntity>(FloorModel.find(), query)
            .filter()
            const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
            queryBuilder.paginate(totalDocuments).limitFields();

        const floors = await queryBuilder.mongooseQuery.populate(
            ["offices", { path: "court" }]);

        return {
            data: floors.map((floor) => {
                if (floor && typeof (floor as any).toJSON === "function") {
                    return (floor as any).toJSON() as FloorEntity;
                }
                return floor as FloorEntity;
            }),
            pagination: queryBuilder.pagination,
        };
    }

    async getFloorById(id: string): Promise<FloorEntity | null> {
        const floor = await FloorModel.findById(id);
        return floor ? (floor.toJSON() as FloorEntity) : null;
    }

    async getFloorsByCourtId(court: string): Promise<FloorEntity[] | null> {
        const floors = await FloorModel.find({ where : { court } });
        return floors.length ? floors.map((floor) => floor.toJSON() as FloorEntity) : null;
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

