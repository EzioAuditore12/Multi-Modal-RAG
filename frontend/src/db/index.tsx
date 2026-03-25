'use client';

import { PowerSyncDatabase } from '@powersync/web';
import { PowerSyncContext, usePowerSync } from '@powersync/react';
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import type { PropsWithChildren } from 'react';

import { AppSchema, drizzleSchema } from './schema';

const dbName = 'ai.db';
const factory = { dbFilename: dbName };

export const powerSyncDb = new PowerSyncDatabase({
  database: factory,
  schema: AppSchema,
});

export const db = wrapPowerSyncWithDrizzle(powerSyncDb, {
  schema: drizzleSchema,
});

export function PowerSyncDatabaseProvider({ children }: PropsWithChildren) {
  return <PowerSyncContext.Provider value={powerSyncDb}>{children}</PowerSyncContext.Provider>;
}

export { usePowerSync };
