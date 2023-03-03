import { database } from './setupInitialActions';

export const updateNotesForConnection = async () => {
  try {
    const directusFieldsExists = database.schema.hasTable('directus_fields');
    const directusSettingsExists = database.schema.hasTable('directus_settings');
    const directusSettings = database('directus_settings');

    if (!directusFieldsExists || !directusSettingsExists) return;
    let res = await directusSettings.select('translation_strings').where({
      id: 1,
    });

    let translationStrings = res[0].translation_strings as {key:string, translations: Record<any,any>}[] | undefined ;

    const newNotes = [
      {
        key: 'originTableNote',
        translations: {
          'en-US':
            'Table containing the tree of nodes from which the information will be generated.',
          'es-ES': 'Tabla que contiene el árbol de nodos desde la que se generará la información',
        },
      },
      {
        key: 'treeKeyNote',
        translations: {
          'en-US':
            'Name of the field in the source table that will be used as the primary key to store the nodes, usually **id**.',
          'es-ES':
            'Nombre del campo de la tabla origen que será empleado como clave principal para almacenar los nodos, por lo general será **id**.',
        },
      },
      {
        key: 'fieldToConnectNote',
        translations: {
          'en-US':
            'Formatted tag list (table.field) of all fields to which we want to propagate the node tree, e.g. "products.categories".',
          'es-ES':
            'Lista de tags con formato (table.field) de todos los campos a los que queramos propagar el árbol de nodos, por ejemplo "products.categories"',
        },
      },
      {
        key: 'titlePatternNote',
        translations: {
          'en-US':
            'Pattern used to determine the title of the node using &#123;&#123;field&#125;&#125; as a replacement for any of the fields in the source table.',
          'es-ES':
            'Patrón empleado para determinar el titulo del nodo empleando &#123;&#123;campo&#125;&#125; como reemplazo con cualquiera de los campos de la tabla origen.',
        },
      },
      {
        key: 'parentFieldNote',
        translations: {
          'en-US': 'Field in the source table determining the identifier of the parent node.',
          'es-ES': 'Campo en la tabla origen que determina el identificador del nodo superior.',
        },
      },
    ];

    if(!translationStrings) {
      translationStrings = newNotes;
    }else if(Array.isArray(translationStrings)) {
      translationStrings.push(...newNotes)
    }


    // await directusSettings.update({translation_strings: translationStrings}).where({
    //   id: 1
    // })

  } catch (e) {
    console.log(e);
  }
};
