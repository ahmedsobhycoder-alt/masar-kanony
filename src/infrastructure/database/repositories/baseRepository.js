"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class BaseRepository {
    model;
    // We pass the Mongoose Model when initializing the class
    constructor(model) {
        this.model = model;
    }
    async getAllPaginated(query) {
        const queryBuilder = new queryBuilder_1.QueryBuilder(this.model, query);
        queryBuilder.filter();
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        queryBuilder.paginate(totalDocuments).sort().limitFields();
        const documents = await queryBuilder.mongooseQuery.lean();
        return {
            data: documents || [],
            pagination: queryBuilder.pagination,
        };
    }
}
exports.default = BaseRepository;
