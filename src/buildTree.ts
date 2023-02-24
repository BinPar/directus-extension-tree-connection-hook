import { DBTreeBranch, TreeBranch, TreeConnectionRecord } from './types';
// Directus ya tiene una librería para hacer lo que hacías en addVariableToText
import { render } from 'micromustache';

const buildTree = (
  data: DBTreeBranch[],
  parentId: string | null | undefined,
  db: TreeConnectionRecord,
) => {
  const result: TreeBranch[] = [];
  data
    .filter((item) => item[db.parentField || 'parent'] === parentId)
    .forEach((item) => {
      const children = buildTree(data, item.id, db);
      result.push({
        text: render(db.titlePattern, item) || '',
        value: item[db.treeKey || 'id'] as string,
        children,
      });
    });
  return result;
};

export default buildTree;
