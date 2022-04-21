
import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutMPage, ILayoutSPage, ILayoutAll, ILayoutAPage, IAnyContent, IFinManSearch } from './IAlvFinManProps';
import { ILayout1Page, ILayout1PageProps, Layout1PageValues } from './Layout1Page/ILayout1PageProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import * as strings from 'AlvFinManWebPartStrings';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';


export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //


export const AccountSearch = [ 'Title', 'Description', 'ALGroup', 'Name1' ];
export const accountColumns: string[] = [ 'ID','ALGroup','Description','Name1','RCM','SubCategory'];

export const thisSelect = ['*','ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

export const sitePagesColumns: string[] = [ "ID", "Title0", "Author/Title", "File/ServerRelativeUrl", "FileRef", ]; //Do not exist on old SitePages library:   "Descritpion","BannerImageUrl.Url", "ServerRelativeUrl"
export const libraryColumns: string[] = [ 'ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

export const appLinkColumns: string[] = [ 'ID','Title','Tab', 'SortOrder', 'LinkColumn', 'Active', 'SearchWords','RichTextPanel','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','HasUniqueRoleAssignments','OData__UIVersion','OData__UIVersionString'];
export const AppLinkSearch = [ 'Title', 'LinkColumn','RichTextPanel', 'SearchWords' ];

export const FinManSite: string ="/sites/ALVFMTest/";
export const StandardsLib: string = "StandardDocuments";
export const SupportingLib: string = "SupportDocuments";
export const AppLinksList: string = "ALVFMAppLinks";
export const LookupColumns: string[] = ['Functions/Title', 'Topics/Title', 'ALGroup/Title', 'Sections/Title','Processes/Title' ];
export const AccountsList: string = "HFMAccounts";


  //Standards are really site pages, supporting docs are files
  export async function getAppLinks( webUrl: string, listTitle: string, columns: string[], searchProps: string[], search: IFinManSearch ) {

    let web = await Web( `${window.location.origin}${webUrl}` );

    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );

    const expandThese = expColumns.join(",");
    //Do not get * columns when using standards so you don't pull WikiFields
    let selectThese = [ ...columns, ...selColumns].join(",");
    let restFilter = "";

    let items = await web.lists.getByTitle( listTitle ).items
          .select(selectThese).expand(expandThese).filter(restFilter).getAll();

    debugger;
    items = addSearchMeta( items, searchProps, search );

    console.log( 'AppLinksList', search, items );

    return items;

  }


  //Standards are really site pages, supporting docs are files
  export async function getStandardDocs( webUrl: string, library: string, columns: string[], searchProps: string[], search: IFinManSearch ) {

    let web = await Web( `${window.location.origin}${webUrl}` );
    
    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );
    
    const expandThese = expColumns.join(",");
    //Do not get * columns when using standards so you don't pull WikiFields
    let selectThese = library === StandardsLib ? [ ...columns, ...selColumns].join(",") : '*,' + [ ...columns, ...selColumns].join(",");
    // let selectThese = library === StandardsLib ? [ ...selColumns].join(",") : '*,' + [ ...selColumns].join(",");
    // let selectThese = '*,' + [ ...selColumns].join(",");
    let restFilter = "";

    let docs: IAnyContent[] = await web.lists.getByTitle( library ).items
          .select(selectThese).expand(expandThese).filter(restFilter).getAll();

            
    docs = addSearchMeta( docs, searchProps, search );

    console.log( library, search, docs );

    return docs;

  }

  export async function getAccounts( webUrl: string, library: string, columns: string[], searchProps: string[], search: IFinManSearch ) {

    let preFetchTime = new Date();
  
    let web = await Web( `${window.location.origin}${webUrl}` );
    
    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );
    
    const expandThese = expColumns.join(",");
    let selectThese = '*,' + columns.join(",");
    let restFilter = "";
  
    let accounts: IAnyContent[] = await web.lists.getByTitle( library ).items
          .select(selectThese).expand(expandThese).filter(restFilter).getAll();
  
    let postFetchTime = new Date();
  
    accounts = addSearchMeta( accounts, searchProps, search );
  
    let fetchTime = postFetchTime.getTime() - preFetchTime.getTime();
  
    console.log( 'getAccounts', search, accounts );
  
    return { fetchTime: fetchTime, accounts: accounts, filtered: accounts };
  
  }

  export function updateSearchCounts( items: IAnyContent[], search: IFinManSearch ) {
    items.map( item => {
      search.leftSearchLC.map( ( searchLC, idx ) => {
        if ( item.leftSearchLC.indexOf( searchLC ) > -1 ) { search.leftSearchCount[ idx ] ++ ; }
      });

      search.topSearchLC.map( ( searchLC, idx ) => {
        if ( item.topSearchLC.indexOf( searchLC ) > -1 ) { search.topSearchCount[ idx ] ++ ; }
      });

    });

    return search;
  }

  export function addSearchMeta ( items: IAnyContent[], searchProps: string[], search: IFinManSearch ) {
    
    //searchNest will be an array of prop key arrays... so [ 'Author/Title' ] => [ ["Author","Title"] ]
    let searchNest: string[][] = [];  
    searchProps.map( prop => {
      if ( prop.indexOf('.') > -1 || prop.indexOf('/') > -1) {
        searchNest.push( prop.trim().replace(' ','' ).split(/[.\/]/gm) ) ;
      } else {
        searchNest.push( [prop.trim().replace(' ','' )] ) ;
      }
    });

    items.map ( item => {
      let meta: string[] = [];
      //This is for display purposes so user can see what property the search criteria is found in
      let searchText : string = searchNest.map( ( propArray, idx)  => {

        if ( propArray.length === 1 ) {
          item[ searchProps[ idx ] ] = item[ propArray[0] ]; //Add flattened value - item["Author/Title"]= item.Author.Title
          if ( Array.isArray( item[ propArray[0] ] )) {
            return `${searchProps[ idx ]}=${item[ propArray[0] ].join(';')}`;
  
          } else {
            return `${searchProps[ idx ]}=${item[ propArray[0] ]}`;
          }

        } else if ( propArray.length === 2 ) {
          item[ searchProps[ idx ] ] = item[ propArray[0] ][ propArray[1] ]; //Add flattened value - item["Author/Title"]= item.Author.Title

          if ( Array.isArray( item[ propArray[0] ][ propArray[1] ]  )) {
            return `${searchProps[ idx ]}=${item[ propArray[0] ][ propArray[1] ] .join(';')}`;
  
          } else {
            return `${searchProps[ idx ]}=${item[ propArray[0] ][ propArray[1] ] }`;
          }
        }

        
      }).join(' || ');
  
      meta = searchText.split(' || ' );
      //searchTextLC is used for actual search function - removes Column Titles from searchable text
      let searchTextLC : string = searchProps.map( prop => {
        if ( Array.isArray( item[ prop ] )) {
          return `${item[ prop ].join(';')}`;

        } else {
          return `${item[ prop ]}`;
        }
      }).join(' || ');

      item.searchText = searchText;
      item.searchTextLC = searchTextLC.toLocaleLowerCase();

      // Create empty search arrays
      item.leftSearch = [];
      item.leftSearchLC = [];
      item.topSearch = [];
      item.topSearchLC = [];

      //update item's left search string arrays
      search.leftSearch.map( ( keyWord, idx ) => {
        let keyWordLC = search.leftSearchLC[ idx ];
        if ( item.searchTextLC.indexOf( keyWordLC ) > - 1 ) {
          item.leftSearch.push( keyWord );
          item.leftSearchLC.push( keyWordLC );
        }
      });

      //update item's top search string arrays
      search.topSearch.map( ( keyWord, idx ) => {
        let keyWordLC = search.topSearchLC[ idx ];
        if ( item.searchTextLC.indexOf( keyWordLC ) > - 1 ) {
          item.topSearch.push( keyWord );
          item.topSearchLC.push( keyWordLC );
        }
      });

      item.meta = [...meta, ...item.leftSearch, ...item.topSearch ];
  
    });

    return items;

  }