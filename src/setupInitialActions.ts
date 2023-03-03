import { ActionHandler } from '@directus/shared/dist/esm/types/events';
import { addRecordHandlers, mainTreeConnectionTable } from '.';
import { TreeConnectionRecord } from './types';
import { Knex } from 'knex';
import { createTableIfNotExists } from './createTableIfNotExists';
export let database: Knex<any, any[]>;


const setupInitialActions: ActionHandler = async (_, context) => {
  database = context.database;

  await createTableIfNotExists(mainTreeConnectionTable);

  const mainTreeConnectionTableRecords = await database<TreeConnectionRecord>(
    mainTreeConnectionTable,
  )
    .select('id')
    .select('originTable')
    .select('fieldToConnect')
    .select('parentField')
    .select('treeKey')
    .select('titlePattern')
    .select('status')
    .where('status', 'published');

  mainTreeConnectionTableRecords.forEach((record) => {
    addRecordHandlers(record.id, record);
  });
};

export default setupInitialActions;
