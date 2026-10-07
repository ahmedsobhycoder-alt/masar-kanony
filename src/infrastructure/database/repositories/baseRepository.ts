import { Model } from 'mongoose';
import { QueryBuilder } from '../../../shared/utils/queryBuilder';

 class BaseRepository<T> {
    // We pass the Mongoose Model when initializing the class
    constructor(protected readonly model: Model<T>) {}

    async getAllPaginated(query: Record<string, any>): Promise<{ data: T[]; pagination?: any }> {
        const queryBuilder = new QueryBuilder<T>(this.model, query);
        
        queryBuilder.filter();
        
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        queryBuilder.paginate(totalDocuments).sort().limitFields();
        
        const documents = await queryBuilder.mongooseQuery.lean<T[]>();

        return {
            data: documents || [],
            pagination: queryBuilder.pagination,
        };
    }
}
export default BaseRepository ;