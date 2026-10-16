import { Model, PopulateOptions, Query } from "mongoose";
import listType from "../constants/types";
import ApiError from "../errors/apiError";
import { printBlue, printGreen, printYellow } from "./printColors";
import { json } from "node_modules/@types/body-parser";
import { stringify } from "node:querystring";

export interface PaginationDetails {
    page: number;
    limit: number;
}

export interface QueryPagination {
    page: number;
    limit: number;
    numberOfPages: number;
    totalDocuments: number;
    next?: PaginationDetails;
    prev?: PaginationDetails;
}

export interface QueryResult<T> {
    data: T[];
    pagination?: QueryPagination;
}

export class QueryBuilder<T = any> {
    mongooseQuery: Query<any, any>;
    query: Record<string, any>;
    private isPaginationEnabled = false;
    private page = 1;
    private limit = 10;

    constructor(

        target: Model<any> | Query<any, any>,

        query: Record<string, any> = {}

    ) {

        // Accepts either CourtModel directly or CourtModel.find()

        if (typeof (target as Model<any>).find === "function") {

            this.mongooseQuery = (target as Model<any>).find();

        } else {

            this.mongooseQuery = target as Query<any, any>;

        }



        this.query = query;

    }



    filter(customQuery:  Record<string, any> = {}) {
        const queryObj = { ...this.query, ...customQuery };

        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((field) => delete queryObj[field]);

        // Convert comparison operators (gte, gt, lte, lt) to MongoDB syntax ($gte, etc.)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const parsedQuery = JSON.parse(queryStr) as Record<string, any>;

        const isObjectId = /^[0-9a-fA-F]{24}$/;
        const isBooleanOrNumber = /^(true|false|\d+)$/i;

        Object.keys(parsedQuery).forEach((key) => {
            const val = parsedQuery[key];

            // 1. Array handling: Governorates come directly as string[] from validator
            if (Array.isArray(val)) {
                printGreen("parsedQuery=", val);
                const regexArray = val
                    .filter(Boolean)
                    .map((item) => {
                        const cleaned = String(item).trim();
                        const pattern = this.buildBilingualFuzzyRegex(cleaned);
                        return new RegExp(pattern, "i");
                    });
                printBlue("regexArray", regexArray);
                // Match ANY of the provided governorates/values
                parsedQuery[key] = { $in: regexArray };

            }

            // 2. Single text field handling
            if (
                typeof val === "string" &&
                !isObjectId.test(val) &&
                !isBooleanOrNumber.test(val)
            ) {
                const regexPattern = this.buildBilingualFuzzyRegex(val.trim());
                parsedQuery[key] = { $regex: regexPattern, $options: "i" };
            }
        });

        this.mongooseQuery = this.mongooseQuery.find(parsedQuery as any);
        return this;
    }
sort(defaultSort: Record<string, any> | string = { createdAt: -1, _id: 1 }) {
    if (this.query.sort) {
        // Appends _id to custom user sorts as well to prevent tie collisions
        const sortBy = (this.query.sort as string).split(",").join(" ") + " _id";
        this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
        // Ensures default sort always includes _id
        if (typeof defaultSort === "object" && !defaultSort._id) {
            defaultSort = { ...defaultSort, _id: 1 };
        } else if (typeof defaultSort === "string" && !defaultSort.includes("_id")) {
            defaultSort = `${defaultSort} _id`;
        }
        this.mongooseQuery = this.mongooseQuery.sort(defaultSort);
    }
    return this;
}
    limitFields(defaultFields = "-__v") {
        const fields = this.query.fields
            ? (this.query.fields as string).split(",").join(" ")
            : defaultFields;

        this.mongooseQuery = this.mongooseQuery.select(fields);
        return this;
    }

    search(searchableFields: string[] = ["name"]) {
        const searchValue = this.query.search;
        if (!searchValue) return this;

        const regexPattern = this.buildBilingualFuzzyRegex(String(searchValue));
        const regex = { $regex: regexPattern, $options: "i" };

        const searchQuery = {
            $or: searchableFields.map((field) => ({ [field]: regex })),
        };

        this.mongooseQuery = this.mongooseQuery.find(searchQuery as any);
        return this;
    }

    // Synchronous: Just sets the parameters, executes in execute()
    paginate() {
   
        this.isPaginationEnabled = true;
        this.page = this.query.page ? Math.max(1, Number(this.query.page)) : 1;

        this.limit = this.query.limit ? Math.max(1, Number(this.query.limit)) : 10;
        return this;
    }

    populate(options: PopulateOptions | (string | PopulateOptions)[] | string) {
        this.mongooseQuery = this.mongooseQuery.populate(options as any);
        return this;
    }

    buildBilingualFuzzyRegex(searchTerm: string): string {
        if (!searchTerm) return "";

        const cleanTerm = searchTerm.replace(/[\u064B-\u065F\u0670]/g, "").trim();
        const tokens: string[] = [];

        for (const char of cleanTerm) {
            if (/[أإآا]/.test(char)) {
                tokens.push("[أإآا]");
            } else if (/[يى]/.test(char)) {
                tokens.push("[يى]");
            } else if (/[ةه]/.test(char)) {
                tokens.push("[ةه]");
            } else if (/\s+/.test(char)) {
                tokens.push("\\s*");
            } else {
                tokens.push(char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            }
        }

        return tokens.join(".*?");
    }
async execute(): Promise<listType<T>> {
    if (!this.isPaginationEnabled) {
        const data = (await this.mongooseQuery.lean().exec()) as unknown as T[];
        return { data };
    }

    // Force strict integers to prevent any string coercion bugs
    const page = Math.max(1, parseInt(String(this.page), 10) || 1);
    const limit = Math.max(1, parseInt(String(this.limit), 10) || 10);
    const skip = (page - 1) * limit;

    // Ensure deterministic sort if not already provided on the query
    if (!this.mongooseQuery.getOptions().sort) {
        this.mongooseQuery.sort({ _id: 1 });
    }

    const [totalDocuments, data] = await Promise.all([
        this.mongooseQuery.clone().countDocuments().exec(),
        this.mongooseQuery
            .clone()
            .skip(skip)
            .limit(limit)
            .lean() // Recommended for read performance
            .exec() as unknown as Promise<T[]>,
    ]);

    const numberOfPages = Math.ceil(totalDocuments / limit) || 1;

    const pagination: QueryPagination = {
        page,
        limit,
        totalDocuments,
        numberOfPages,
    };

    if (page < numberOfPages) {
        pagination.next = { page: page + 1, limit };
    }

    if (page > 1) {
        pagination.prev = { page: page - 1, limit };
    }

    return { data, pagination };
}
}
