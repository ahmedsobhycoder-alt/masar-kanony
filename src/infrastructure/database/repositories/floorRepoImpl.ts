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
        return await floor.populate(["offices"]);
    }

    async getFloors(
        query: Record<string, any> = {}
    ): Promise<{ data: FloorEntity[]; pagination?: QueryPagination }> {
        // 1. Build the base query with filters, sorting, and field limiting
        const queryBuilder = new QueryBuilder<FloorEntity>(FloorModel, query)
            .filter()
            .sort()
            .limitFields();

        // 2. Clone and count documents matching the applied filters
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);

        // 4. Execute query with population and .lean() for performance
        const floors = await queryBuilder.mongooseQuery
            .populate(["offices", { path: "court" }])
            .lean<FloorEntity[]>();

        return {
            data: floors || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getFloorById(id: string): Promise<FloorEntity | null> {
        const floor = await FloorModel.findById(id);
        return floor ? (floor.toJSON() as FloorEntity) : null;
    }

    async getFloorsByCourtId(court: string): Promise<FloorEntity[] | null> {
        const floors = await FloorModel.find({ where: { court } });
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

