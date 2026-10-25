import { Model, PipelineStage } from "mongoose";
import { QueryPagination } from "../constants/types";


export interface AggregateListResult<T> {
    data: T[];
    pagination?: QueryPagination;
}
export class AggregateBuilder<T = any> {
    private model: Model<any>;
    private query: Record<string, any>;
    private stages: PipelineStage[] = [];
    private isPaginationEnabled = false;
    private page = 1;
    private limit = 10;
    private sortStage: Record<string, 1 | -1> = { createdAt: -1, _id: 1 };

    constructor(model: Model<any>, query: Record<string, any> = {}) {
        this.model = model;
        this.query = query;
    }

    addStage(stage: PipelineStage | PipelineStage[]): this {
        if (Array.isArray(stage)) {
            this.stages.push(...stage);
        } else {
            this.stages.push(stage);
        }
        return this;
    }

    sort(defaultSort: Record<string, 1 | -1> | string = { createdAt: -1, _id: 1 }): this {
        if (this.query.sort && typeof this.query.sort === "string") {
            const sortObj: Record<string, 1 | -1> = {};
            this.query.sort.split(",").forEach((field: string) => {
                const trimmed = field.trim();
                if (trimmed.startsWith("-")) {
                    sortObj[trimmed.substring(1)] = -1;
                } else {
                    sortObj[trimmed] = 1;
                }
            });
            if (!sortObj._id) sortObj._id = 1;
            this.sortStage = sortObj;
        } else if (typeof defaultSort === "object") {
            this.sortStage = { ...defaultSort, _id: defaultSort._id ?? 1 };
        }
        return this;
    }

    paginate(): this {
        this.isPaginationEnabled = true;
        this.page = Math.max(1, parseInt(String(this.query.page), 10) || 1);
        this.limit = Math.max(1, parseInt(String(this.query.limit), 10) || 10);
        return this;
    }

    async execute(): Promise<AggregateListResult<T>> {
        if (!this.isPaginationEnabled) {
            const data = await this.model.aggregate<T>([
                ...this.stages,
                { $sort: this.sortStage },
            ]).exec();

            return { data };
        }

        const page = this.page;
        const limit = this.limit;
        const skip = (page - 1) * limit;

        const pipeline: PipelineStage[] = [
            ...this.stages,
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: this.sortStage },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                },
            },
        ];

        const [result] = await this.model.aggregate<{
            metadata: { total: number }[];
            data: T[];
        }>(pipeline).exec();

        const totalDocuments = result?.metadata?.[0]?.total ?? 0;
        const numberOfPages = Math.ceil(totalDocuments / limit) || 1;

        const pagination: QueryPagination = {
            page,
            limit,
            numberOfPages,
            totalDocuments,
        };

        if (page < numberOfPages) {
            pagination.next = { page: page + 1, limit };
        }

        if (page > 1) {
            pagination.prev = { page: page - 1, limit };
        }

        return {
            data: result?.data ?? [],
            pagination,
        };
    }
}