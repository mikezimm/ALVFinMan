
import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutMPage, ILayoutSPage, ILayoutAll, ILayoutAPage, IAnyContent, IFinManSearch, IAppFormat, ISearchBucket } from './IAlvFinManProps';
import { ILayout1Page, ILayout1PageProps, Layout1PageValues } from './Layout1Page/ILayout1PageProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import * as strings from 'AlvFinManWebPartStrings';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';


export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //


export const AccountSearch = [ 'Title', 'Description', 'ALGroup', 'Name1','RCM','SubCategory' ];
export const accountColumns: string[] = [ 'ID','ALGroup','Description','Name1','RCM','SubCategory'];

export const thisSelect = ['*','ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

export const sitePagesColumns: string[] = [ "ID", "Title0", "Author/Title", "File/ServerRelativeUrl", "FileRef", ]; //Do not exist on old SitePages library:   "Descritpion","BannerImageUrl.Url", "ServerRelativeUrl"
export const libraryColumns: string[] = [ 'ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','File_x0020_Type','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

export const appLinkColumns: string[] = [ 'ID','Title','Tab', 'SortOrder', 'LinkColumn', 'Active', 'SearchWords','RichTextPanel','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','HasUniqueRoleAssignments','OData__UIVersion','OData__UIVersionString'];
export const AppLinkSearch = [ 'Title', 'LinkColumn','RichTextPanel', 'SearchWords' ];

export const FinManSite: string ="/sites/ALVFMTest/";
export const StandardsLib: string = "StandardDocuments";
export const SupportingLib: string = "SupportDocuments";
export const AppLinksList: string = "ALVFMAppLinks";
export const LookupColumns: string[] = ['Functions/Title', 'Topics/Title', 'ALGroup/Title', 'Sections/Title','Processes/Title' ];
export const AccountsList: string = "HFMAccounts";

export interface IFMSearchType {
  key: string;
  title: string;
  icon: string;
  style: string;
  count: number;
  adjust?: number; //Use to adjust the index to get a common one like all Excel files;
}

export interface IFMSearchTypes {
  keys: string[];
  objs: IFMSearchType[];
}

export const SearchTypes:IFMSearchTypes  = {
  keys: [ "account", "doc", "docx",
    "link",    "msg",
    "page",
    "pdf",    "ppt",    "pptx",
    "rtf",
    "xls", "xlsm",  "xlsx",
    "unknown" ],
  objs:
    [
      //NOTE:  key must be exact match to strings in keys array above.
      { key: "account", title: "account", icon: "Bank", style: "", count: 0 }, 
      { key: "doc", title: "doc", icon: "WordDocument", style: "", count: 0 }, 
      { key: "docx", title: "doc", icon: "WordDocument", style: "", count: 0, adjust: -1 }, 

      { key: "link", title: "Link", icon: "Link12", style: "", count: 0 }, 
      { key: "msg", title: "msg", icon: "Read", style: "", count: 0 }, 

      { key: "page", title: "page", icon: "KnowledgeArticle", style: "", count: 0 }, 

      { key: "pdf", title: "pdf", icon: "PDF", style: "", count: 0 }, 
      { key: "ppt", title: "ppt", icon: "PowerPointDocument", style: "", count: 0 }, 
      { key: "pptx", title: "ppt", icon: "PowerPointDocument", style: "", count: 0, adjust: -1 }, 

      { key: "rtf", title: "rtf", icon: "AlignLeft", style: "", count: 0 }, 

      { key: "xls", title: "xls", icon: "ExcelDocument", style: "", count: 0 }, 
      { key: "xlsm", title: "xls", icon: "ExcelDocument", style: "", count: 0, adjust: -1 }, 
      { key: "xlsx", title: "xls", icon: "ExcelDocument", style: "", count: 0, adjust: -2 }, 

      { key: "unknown", title: "unkown", icon: "Help", style: "", count: 0 }, 
  ]
};

export function createEmptySearchBucket () {

  let result: ISearchBucket = {
    SearchFixed: true,
    SearchStr: 'tbd',
    Search: [],
    SearchLC: [],
    SearchCount:  SearchTypes.keys.map( value => { return 0 ; } ),
    Objects: [],

    items: [],
    appLinks: [],
    accounts: [],
    stds: [],
    sups: [],
    docs: [],
  };

  return result;

}

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

    // debugger;
    items = addSearchMeta( items, searchProps, search, 'link' );

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

            
    docs = addSearchMeta( docs, searchProps, search, library );

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
  
    accounts = addSearchMeta( accounts, searchProps, search, 'account' );
  
    let fetchTime = postFetchTime.getTime() - preFetchTime.getTime();
  
    console.log( 'getAccounts', search, accounts );
  
    return { fetchTime: fetchTime, accounts: accounts, filtered: accounts };
  
  }

  export function updateSearchCounts( format: IAppFormat, items: IAnyContent[], search: IFinManSearch ) {

    items.map( item => {
      //Update search count and add items to search buckets

      search.left.SearchLC.map( ( searchLC, idx ) => {
        if ( item.leftSearchLC.indexOf( searchLC ) > -1 ) { 
          search.left.SearchCount[ idx ] ++ ; 
          search.left[format].push( item );
          search.left.items.push( item );

        }
      });

      //Update search count and add items to search buckets

      search.top.SearchLC.map( ( searchLC, idx ) => {
        if ( item.topSearchLC.indexOf( searchLC ) > -1 ) { 
          search.top.SearchCount[ idx ] ++ ;
          search.top[format].push( item );
          search.top.items.push( item );

         }
      });

    });

    search.left.Objects = search.left.SearchLC.map( ( searchLC, idx ) => {
      return {
        Search: search.left.Search[ idx ],
        SearchLC: searchLC,
        SearchCount: search.left.SearchCount[ idx ],
      };
    });
    search.top.Objects = search.top.Search.map( ( searchLC, idx ) => {
      return {
        Search: search.top.Search[ idx ],
        SearchLC: searchLC,
        SearchCount: search.top.SearchCount[ idx ],
      };
    });

    return search;
  }

  export function updateSearchTypes( items: IAnyContent[], search: IFinManSearch ) {

    let types: string[] = [];

    let typeBucket = createEmptySearchBucket();

    items.map( item => {
      //Update search count and add items to search buckets
      if ( types.indexOf( item.type ) < 0 ) {  
        types.push( item.type );
      }


      typeBucket.SearchCount[ item.typeIdx ] ++;
      // typeBucket.SearchCount[ item.typeIdx ] ++;
      // typeBucket.SearchCount[ item.typeIdx ] ++;
      // typeBucket.SearchCount[ item.typeIdx ] ++;

    });

    console.log( 'Types', types );

    // items.map( item => {
    //   //Update search count and add items to search buckets

    //   search.type.SearchLC.map( ( searchLC, idx ) => {
    //     if ( item.typeSearchLC.indexOf( searchLC ) > -1 ) { 
    //       search.type.SearchCount[ idx ] ++ ; 
    //       search.type[format].push( item );
    //       search.type.items.push( item );

    //     }
    //   });

    // });

    // search.type.Objects = search.left.SearchLC.map( ( searchLC, idx ) => {
    //   return {
    //     Search: search.left.Search[ idx ],
    //     SearchLC: searchLC,
    //     SearchCount: search.left.SearchCount[ idx ],
    //   };
    // });

    search.type = typeBucket;
    return search;
  }

  export function addSearchMeta ( items: IAnyContent[], searchProps: string[], search: IFinManSearch, defType: string ) {
    
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
      let searchTitle = '';
      let searchDesc = '';
      let searchHref = '';
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
          let hasError: boolean = false;
          try {
            item[ searchProps[ idx ] ] = item[ propArray[0] ][ propArray[1] ]; //Add flattened value - item["Author/Title"]= item.Author.Title
          } catch (e) {
            // alert('Error doing search props');
            let lastPart = item[propArray[0] ] ? item[propArray[0] ][ propArray[1] ] : 'UNK';
            item[ searchProps[ idx ] ] = lastPart;
            console.log( 'Search Error: ~ `77', item, searchProps, idx, item[propArray[0] ] , lastPart  );
            hasError = true;
          }

          if ( hasError === true ) {
            return `${searchProps[ idx ]}=UNK`;
          } else {
            if ( Array.isArray( item[ propArray[0] ][ propArray[1] ]  )) {
              return `${searchProps[ idx ]}=${item[ propArray[0] ][ propArray[1] ] .join(';')}`;
    
            } else {
              return `${searchProps[ idx ]}=${item[ propArray[0] ][ propArray[1] ] }`;
            }
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
      search.left.Search.map( ( keyWord, idx ) => {
        let keyWordLC = search.left.SearchLC[ idx ];
        if ( item.searchTextLC.indexOf( keyWordLC ) > - 1 ) {
          item.leftSearch.push( keyWord );
          item.leftSearchLC.push( keyWordLC );
        }
      });

      //update item's top search string arrays
      search.top.Search.map( ( keyWord, idx ) => {
        let keyWordLC = search.top.SearchLC[ idx ];
        if ( item.searchTextLC.indexOf( keyWordLC ) > - 1 ) {
          item.topSearch.push( keyWord );
          item.topSearchLC.push( keyWordLC );
        }
      });

      item.meta = [...meta, ...item.leftSearch, ...item.topSearch ];

      let extIdx = item.FileRef ? item.FileRef.lastIndexOf('.') : -1;
      if ( item['File_x0020_Type'] ) {
        item.type = item['File_x0020_Type'] ;
        searchTitle = item['File_x0020_Type'];
        searchDesc = 'File Type Search Desc';

      } else if ( extIdx > -1 ) {
        item.type = item.FileRef.substring( extIdx + 1 );
        if ( item.type === 'aspx' ) { 
          item.type = 'page';
          searchTitle = item.Title;
          searchDesc = item.Description;
        }

      } else if ( extIdx > -1 ) {
        item.type = item.FileRef.substring( extIdx + 1 );
        if ( item.type === 'aspx' ) { 
          item.type = 'page';
          searchTitle = item.Title;
          searchDesc = item.Description;
        }

      } else {
        item.type = defType;
        searchTitle = item.Title;
        searchDesc = 'Other Type Search Desc';

      }

      if ( item.Tab && item.LinkColumn ) {

      }

      if ( !searchDesc && item.SearchWords ) { searchDesc = item.SearchWords; }
      if ( !searchHref && item.LinkColumn ) { 
        searchHref = item.LinkColumn.Url;
        if ( !searchDesc && item.SearchWords ) { searchDesc = item.LinkColumn.Description; }
      }

      if ( item.type === 'account' ) {
        searchTitle = '';
        searchDesc = [ item.type, item.ALGroup, item.SubCategory, item.Name1, item.Description ] .join ('<>');
        searchHref = '';
      }

      let searchTypeIdx = SearchTypes.keys.indexOf( item.type ) ;
      let adjustIdx = SearchTypes.objs[ searchTypeIdx ].adjust ? SearchTypes.objs[ searchTypeIdx ].adjust : 0;
      searchTypeIdx = searchTypeIdx + adjustIdx;

      item.typeIdx = searchTypeIdx > -1 ? searchTypeIdx : SearchTypes.keys.length -1 ;

      item.searchTitle = `${searchTitle}`;
      item.searchDesc = `${searchDesc}`;
      item.searchHref = `${searchHref}`;

  
    });

    return items;

  }