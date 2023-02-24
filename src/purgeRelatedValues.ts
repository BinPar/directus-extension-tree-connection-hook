import { configRecordsByID } from '.';
import { database } from './setupInitialActions';

const purgeRelatedValues = (tableName: string, keys: string[]) => {
  configRecordsByID.forEach(async (value) => {
    if (value.originTable === tableName && value.status === 'published' && value.treeKey === 'id') {
      // Note that the purge will only work if we are storing IDs, becouse if we are storings slugs
      // there are no way to know the value of the slug field of a deleted record
      const { fieldToConnect } = value;
      for (let j = 0; j < fieldToConnect.length; j++) {
        const item = fieldToConnect[j];
        if (item) {
          const [collection, field] = item.split('.');
          if (collection && field) {
            keys.forEach(async (key) => {
              const databaseCollection = database.table(collection);
              const recordsToPurge = await databaseCollection
                .select('id')
                .select(field)
                .whereNotNull(field)
                .whereRaw(`text("${field}") like '%${key}%'`);
              if (recordsToPurge) {
                recordsToPurge.forEach(async (record) => {
                  let lastValue = record[field] as string[];
                  lastValue = lastValue.filter((item) => item !== key);
                  await databaseCollection.where('id', '=', record.id).update({
                    [field]: JSON.stringify(lastValue),
                  });
                });
              }
            });
          }
        }
      }
    }
  });
};

export default purgeRelatedValues;
