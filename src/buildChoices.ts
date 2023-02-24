import { DBTreeBranch, TreeChoice, TreeConnectionRecord } from './types';
// Directus ya tiene una librería para hacer lo que hacías en addVariableToText
import { render } from 'micromustache';

const buildChoices = (
  data: DBTreeBranch[],
  db: TreeConnectionRecord,
) => {
  const result: TreeChoice[] = [];
  data
    .forEach((item) => {
      result.push({
        text: render(db.titlePattern, item) || '',
        value: item[db.treeKey || 'id'] as string,
      });
    });
  return result;
};

export default buildChoices;
