export interface TreeConnectionRecord {
  id: string;
  originTable: string;
  fieldToConnect: string[];
  parentField: string;
  treeKey: string;
  titlePattern: string;
  status: string;  
}

export interface EventInterface {
  event: string;
  payload: Record<string, string>;
  keys: string[];
  collection: string;
}

export interface TreeChoice {
  text: string;
  value: string;
}

export interface TreeBranch {
  text: string;
  value: string;
  children: TreeBranch[];
}

export interface DBTreeBranch {
  id: string;
  parent: string | null;
  [x: string]: string | null;
}
