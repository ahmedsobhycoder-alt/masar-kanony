import { Model } from 'mongoose';
import { QueryBuilder } from '../../../shared/utils/queryBuilder';
import listType from '../../../shared/constants/types';

 class BaseRepository<T> {
    // We pass the Mongoose Model when initializing the class
    constructor(protected readonly model: Model<T>) {}

    async getAllPaginated(query: Record<string, any>): Promise<listType<T>> {
        return await new QueryBuilder<T>(this.model, query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .execute();
    }
}
export default BaseRepository ;