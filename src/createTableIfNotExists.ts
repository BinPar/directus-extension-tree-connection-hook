import { createConnectionTableProps } from './createConnectionTableProps';
import { database } from './setupInitialActions';
import { updateNotesForConnection } from './updateNotesForConnection';

const dataToInsert = {
  icon: "library_add_check",
  translations: 
    '[{"language":"en-US","translation":"Tree connections","singular":"Tree connection","plural":"Tree connections"},{"language":"es-ES","translation":"Conexiones de árbol","singular":"Conexión de árbol","plural":"Conexiones de árbol"}]',
  archive_app_filter: true,
  archive_value: 'archived',
  unarchive_value: 'draft',
  sort_field: 'sort',
  accountability: 'all',
  color: '#8100EB',
  sort: 1,
  group: 'admin',
  collapse: 'open',
  archive_field: 'status',
}

export const createTableIfNotExists = async (tableName: string) => {
  const exists = await database.schema.hasTable(tableName);
  if (exists) return;

  await database.schema.createTable(tableName, (col) => {
    col.uuid('id').primary();
    col.integer('sort').nullable();
    col.uuid('user_created').nullable();
    col.uuid('user_updated').nullable();
    col.timestamp('date_created');
    col.timestamp('date_updated').nullable();
    col.string('originTable');
    col.string('parentField').nullable();
    col.string('treeKey').nullable();
    col.string('titlePattern');
    col.json('fieldToConnect');
    col.string('status');
  });

  await createConnectionTableProps(tableName);
  await updateNotesForConnection();
  


};
 