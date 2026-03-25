import { DrizzleAppSchema } from '@powersync/drizzle-driver';

import { articleTable } from './models/article.model';

export const drizzleSchema = {
  articleTable,
};

export const AppSchema = new DrizzleAppSchema(drizzleSchema);
