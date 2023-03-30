import { defineHook } from "@directus/extensions-sdk";
import { ActionHandler } from "@directus/shared/dist/esm/types/events";
import purgeRelatedValues from "./purgeRelatedValues";
import recalculateTreeForTable from "./recalculateTreeForTable";
import setupInitialActions from "./setupInitialActions";
import { TreeConnectionRecord } from "./types";

export const mainTreeConnectionTable =
  process.env.TREE_CONNECTION_TABLE || "treeConnections";

export const configRecordsByID = new Map<string, TreeConnectionRecord>();

const watchedTables = new Array<string>();

let actionHandler: (event: string, handler: ActionHandler) => void;

const myHook = defineHook(({ action }) => {
  actionHandler = action;
  action("server.start", setupInitialActions);
  action(`${mainTreeConnectionTable}.items.delete`, (data) => {
    const keys = (data.keys as string[]) || [data.key as string];
    keys.forEach((key) => {
      configRecordsByID.delete(key);
    });
  });
  action(`${mainTreeConnectionTable}.items.create`, (data) => {
    const payload = data.payload as TreeConnectionRecord;
    if (!payload.status) {
      payload.status = "published";
    }
    const keys = (data.keys as string[]) || [data.key as string];
    keys.forEach((key) => {
      addRecordHandlers(key, payload);
    });
    recalculateTreeForTable(payload.originTable);
  });
  action(`${mainTreeConnectionTable}.items.update`, (data) => {
    const payload = data.payload as Partial<TreeConnectionRecord>;
    const keys = (data.keys as string[]) || [data.key as string];
    keys.forEach((key) => {
      const current = configRecordsByID.get(key);
      if (current) {
        Object.assign(current, payload);
        recalculateTreeForTable(current.originTable);
      }
    });
  });
});

let lastTimeout: NodeJS.Timeout;
const debounceSeconds = Number(process.env.DEBOUNCE_SECONDS) ?? 30;

const debouncedTreeGeneration = (execute: () => void) => {
  if (lastTimeout) {
    clearTimeout(lastTimeout);
  }
  lastTimeout = setTimeout(execute, debounceSeconds * 1000);
};

export const addRecordHandlers = (id: string, record: TreeConnectionRecord) => {
  configRecordsByID.set(id, record);
  if (!watchedTables.includes(record.originTable)) {
    watchedTables.push(record.originTable);
    actionHandler(`${record.originTable}.items.update`, () =>
      debouncedTreeGeneration(() => recalculateTreeForTable(record.originTable))
    );
    actionHandler(`${record.originTable}.items.create`, () =>
      debouncedTreeGeneration(() => recalculateTreeForTable(record.originTable))
    );
    actionHandler(`${record.originTable}.items.delete`, (data) => {
      debouncedTreeGeneration(() => {
        recalculateTreeForTable(record.originTable);
        const keys = (data.keys as string[]) || [data.key as string];
        purgeRelatedValues(record.originTable, keys);
      });
    });
  }
};

export default myHook;
