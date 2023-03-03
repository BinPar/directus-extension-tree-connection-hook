import { database } from './setupInitialActions';

export type Width = 'half' | 'half-left' | 'half-right' | 'full' | 'fill';

export interface DirectusFieldsUpdateProps {
  field: string;
  hidden?: boolean;
  interface?: string | null;
  display?: string | null;
  options?: string | null;
  display_options?: string | null;
  readonly?: boolean;
  required?: boolean;
  sort: number | null;
  special?: string | null;
  translations?: string | null;
  width: Width | null;
  note?: string | null;
}

export const createConnectionTableProps = async (tableName: string) => {
  const directusFields = database('directus_fields');
  const updates: DirectusFieldsUpdateProps[] = [
    {
      field: 'parentField',
      interface: 'input',
      sort: 8,
      width: 'half',
      translations:
        '[{"language":"en-US","translation":"Parent Field"},{"language":"es-ES","translation":"Campo padre"}]',
      note: '$t:parentFieldNote',
    },
    {
      field: 'titlePattern',
      interface: 'input',
      options: '{"placeholder":"{{placeholder}}"}',
      sort: 10,
      width: 'full',
      translations:
        '[{"language":"en-US","translation":"Tittle pattern"},{"language":"es-ES","translation":"Patrón del título"}]',
      note: '$t:titlePatternNote',
      required: true,
    },
    {
      field: 'status',
      interface: 'select-dropdown',
      options:
        '{"choices":[{"text":"Publicado","value":"published"},{"text":"Borrador","value":"draft"},{"text":"Archivado","value":"archived"}]}',
      display: 'labels',
      display_options:
        '{"choices":[{"text":"Publicado","value":"published","foreground":"#FFFFFF","background":"var(--primary)"},{"text":"Borrador","value":"draft","foreground":"#18222F","background":"#D3DAE4"},{"text":"Archivado","value":"archived","foreground":"#FFFFFF","background":"var(--warning)"}],"showAsDot":true}',
      sort: 12,
      width: 'full',
      translations:
        '[{"language":"en-US","translation":"Status"},{"language":"es-ES","translation":"Estado"}]',
    },
    {
      field: 'fieldToConnect',
      special: 'cast-json',
      interface: 'tags',
      options: '{"whitespace":""}',
      sort: 11,
      width: 'full',
      translations:
        '[{"language":"en-US","translation":"Fields to connect"},{"language":"es-ES","translation":"Campos relacionados "}]',
      note: '$t:fieldToConnectNote',
      required: true,
    },
    {
      field: 'date_updated',
      special: 'date-updated',
      interface: 'datetime',
      display: 'datetime',
      display_options: '{"relative":true}',
      readonly: true,
      hidden: true,
      sort: 6,
      width: 'half',
    },
    {
      field: 'date_created',
      special: 'date-created',
      interface: 'datetime',
      display: 'datetime',
      display_options: '{"relative":true}',
      readonly: true,
      hidden: true,
      sort: 4,
      width: 'half',
    },
    {
      field: 'treeKey',
      interface: 'input',
      sort: 9,
      width: 'full',
      translations:
        '[{"language":"en-US","translation":"Tree key"},{"language":"es-ES","translation":"Clave de árbol"}]',
      note: '$t:treeKeyNote',
    },
    {
      field: 'sort',
      interface: 'input',
      hidden: true,
      sort: 2,
      width: 'full',
    },
    {
      field: 'user_created',
      special: 'user-created',
      interface: 'select-dropdown-m2o',
      options: '{"template":"{{avatar.$thumbnail}} {{first_name}} {{last_name}}"}',
      display: 'user',
      readonly: true,
      hidden: true,
      sort: 3,
      width: 'half',
    },
    {
      field: 'user_updated',
      special: 'user-updated',
      interface: 'select-dropdown-m2o',
      options: '{"template":"{{avatar.$thumbnail}} {{first_name}} {{last_name}}"}',
      display: 'user',
      readonly: true,
      hidden: true,
      sort: 5,
      width: 'half',
    },
    {
      field: 'originTable',
      interface: 'input',
      sort: 7,
      width: 'half',
      translations:
        '[{"language":"en-US","translation":"Origin Table"},{"language":"es-ES","translation":"Tabla de origen"}]',
      note: '$t:originTableNote',
      required: true,
    },
    {
      field: 'id',
      special: 'uuid',
      interface: 'input',
      readonly: true,
      hidden: true,
      sort: 1,
      width: 'full',
    },
  ];

  for (const update of updates) {
    try {
      await directusFields.insert({ collection: tableName, ...update });
    } catch (e) {
      console.log(e);
    }
  }
};
