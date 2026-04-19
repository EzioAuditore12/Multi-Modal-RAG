import { drizzle } from 'drizzle-orm/node-postgres';

import {
  projectFileToEmbeddingOneToOne,
  projectToProjectSettingsOneToOne,
} from '@/db/relations/one-to-one';
import {
  chatToMessageOneToMany,
  projectToChatOneToMany,
  projectToProjectFileOneToMany,
  userToProjectOneToMany,
} from '@/db/relations/one-to-many';

const relations = {
  projectFileToEmbeddingOneToOne,
  projectToProjectSettingsOneToOne,
  chatToMessageOneToMany,
  projectToChatOneToMany,
  projectToProjectFileOneToMany,
  userToProjectOneToMany,
};

import { env } from '@/env';

export const db = drizzle(env.DATABASE_URL);
