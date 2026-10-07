"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    mongooseQuery;
    query;
    pagination;
    constructor(target, query = {}) {
        // Accepts either CourtModel directly or CourtModel.find()
        if (typeof target.find === "function") {
            this.mongooseQuery = target.find();
        }
        else {
            this.mongooseQuery = target;
        }
        this.query = query;
    }
    filter() {
        const queryObj = { ...this.query };
        // 1. Exclude operational parameters handled by other methods
        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((field) => delete queryObj[field]);
        // 2. Convert comparison operators (gte, gt, lte, lt, in) to MongoDB format ($gte, etc.)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);
        const parsedQuery = JSON.parse(queryStr);
        // 3. Apply bilingual fuzzy regex only to pure text strings (skip ObjectId hexes and boolean strings)
        const isObjectId = /^[0-9a-fA-F]{24}$/;
        const isBooleanOrNumber = /^(true|false|\d+)$/i;
        Object.keys(parsedQuery).forEach((key) => {
            const val = parsedQuery[key];
            if (typeof val === "string" &&
                !isObjectId.test(val) &&
                !isBooleanOrNumber.test(val)) {
                const regexPattern = this.buildBilingualFuzzyRegex(val);
                parsedQuery[key] = { $regex: regexPattern, $options: "i" };
            }
        });
        this.mongooseQuery = this.mongooseQuery.find(parsedQuery);
        return this;
    }
    sort(defaultSort = { createdAt: -1 }) {
        if (this.query.sort) {
            const sortBy = this.query.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }
        else {
            this.mongooseQuery = this.mongooseQuery.sort(defaultSort);
        }
        return this;
    }
    limitFields(defaultFields = "-__v") {
        const fields = this.query.fields
            ? this.query.fields.split(",").join(" ")
            : defaultFields;
        this.mongooseQuery = this.mongooseQuery.select(fields);
        return this;
    }
    search(searchableFields = ["name"]) {
        const searchValue = this.query.search;
        if (!searchValue) {
            return this;
        }
        const regexPattern = this.buildBilingualFuzzyRegex(String(searchValue));
        const regex = { $regex: regexPattern, $options: "i" };
        const searchQuery = {
            $or: searchableFields.map((field) => ({ [field]: regex })),
        };
        this.mongooseQuery = this.mongooseQuery.find(searchQuery);
        return this;
    }
    paginate(totalDocuments) {
        const page = this.query.page ? Math.max(1, Number(this.query.page)) : 1;
        const limit = this.query.limit ? Math.max(1, Number(this.query.limit)) : 10;
        const skip = (page - 1) * limit;
        const pagination = {
            page,
            limit,
            numberOfPages: Math.ceil(totalDocuments / limit) || 1,
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
    populate(options) {
        this.mongooseQuery = this.mongooseQuery.populate(options);
        return this;
    }
    buildBilingualFuzzyRegex(searchTerm) {
        if (!searchTerm)
            return "";
        // 1. Remove Tashkeel / diacritics
        const cleanTerm = searchTerm.replace(/[\u064B-\u065F\u0670]/g, "").trim();
        // 2. Tokenize by character, mapping Arabic variations to classes and escaping regex chars
        const tokens = [];
        for (const char of cleanTerm) {
            if (/[أإآا]/.test(char)) {
                tokens.push("[أإآا]");
            }
            else if (/[يى]/.test(char)) {
                tokens.push("[يى]");
            }
            else if (/[ةه]/.test(char)) {
                tokens.push("[ةه]");
            }
            else if (/\s+/.test(char)) {
                tokens.push("\\s*");
            }
            else {
                tokens.push(char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            }
        }
        // 3. Join tokens with '.*?' to allow zero or more characters in between
        return tokens.join(".*?");
    }
}
exports.QueryBuilder = QueryBuilder;
