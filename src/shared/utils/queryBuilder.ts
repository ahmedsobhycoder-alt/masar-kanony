import { Query } from "mongoose";

export type QueryPagination = {
    page: number;
    limit: number;
    numberOfPages: number;
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
};

 export class QueryBuilder<T = any> {
    mongooseQuery: any;
    query: Record<string, any>;
    pagination?: QueryPagination;

    constructor(mongooseQuery: any, query: Record<string, any> = {}) {
        this.mongooseQuery = mongooseQuery;
        this.query = query;
    }

    filter(excludedFields: string[] = ["page", "sort", "limit", "fields", "search"]) {
        const queryObj = { ...this.query };

        excludedFields.forEach((field) => delete queryObj[field]);

        Object.keys(queryObj).forEach((key) => {
            if (Array.isArray(queryObj[key])) {
                queryObj[key] = { $in: queryObj[key] };
            }
        });

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        const parsedQuery = JSON.parse(queryStr || "{}") as Record<string, any>;
        this.mongooseQuery = this.mongooseQuery.find(parsedQuery);
        return this;
    }

    sort(defaultField = "-createdAt") {
        const sortValue = this.query.sort
            ? (this.query.sort as string).split(",").join(" ")
            : defaultField;

        this.mongooseQuery = this.mongooseQuery.sort(sortValue);
        return this;
    }

    limitFields(defaultFields = "-__v") {
        const fields = this.query.fields
            ? (this.query.fields as string).split(",").join(" ")
            : defaultFields;

        this.mongooseQuery = this.mongooseQuery.select(fields);
        return this;
    }

    search(searchTerm?: string, searchableFields: string[] = ["name"]) {
        const searchValue = searchTerm ?? this.query.search;

        if (!searchValue) {
            return this;
        }

        const regex = { $regex: String(searchValue), $options: "i" };
        const searchQuery = {
            $or: searchableFields.map((field) => ({ [field]: regex })),
        };

        this.mongooseQuery = this.mongooseQuery.find(searchQuery);
        return this;
    }

    paginate(totalDocuments: number) {
        const page = this.query.page ? Number(this.query.page) : 1;
        const limit = this.query.limit ? Number(this.query.limit) : 10;
        const skip = (page - 1) * limit;

        const pagination: QueryPagination = {
            page,
            limit,
            numberOfPages: Math.ceil(totalDocuments / limit || 1),
        };

        const endIndex = page * limit;

        if (endIndex < totalDocuments) {
            pagination.next = { page: page + 1, limit };
        }

        if (skip > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.pagination = pagination;
        return this;
    }

    populate(options: any) {
        this.mongooseQuery = this.mongooseQuery.populate(options);
        return this;
    }
}

 export default QueryBuilder;