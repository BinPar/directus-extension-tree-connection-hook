import { configRecordsByID } from '.';
import buildTree from './buildTree';
import buildChoices from './buildChoices';
import { database } from './setupInitialActions';
import { DBTreeBranch, TreeBranch, TreeChoice } from './types';

const recalculateTreeForTable = async (originTable: string): Promise<void> => {
  configRecordsByID.forEach(async (value) => {
    try {
      let choices: TreeBranch[] | undefined = undefined;
      let display: TreeChoice[] | undefined = undefined;
      if (value.originTable === originTable && value.status === 'published') {
        if (!choices) {
          const dbTablesToGetStructure = await database<DBTreeBranch>(originTable).select('*'); // This crashes when originTable does not exist
          choices = buildTree(dbTablesToGetStructure, null, value);
          display = buildChoices(dbTablesToGetStructure, value);
        }
        const dataToUpdate = { choices };
        const { fieldToConnect } = value;
        for (let j = 0; j < fieldToConnect.length; j++) {
          const item = fieldToConnect[j];
          if (item) {
            const [collection, field] = item.split('.');
            if (collection && field) {
              await database('directus_fields')
                .where({
                  collection,
                  field,
                })
                .update({
                  options: dataToUpdate,
                  display_options: { choices: display },
                });
            }
          }
        }
      }
    }catch(e) {
      console.log(`${originTable} does not exist.`)
    }
  });
};

export default recalculateTreeForTable;
