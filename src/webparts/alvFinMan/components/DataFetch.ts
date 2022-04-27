
import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutNPage, ILayoutGPage, ILayoutSPage, ILayoutAll, ILayoutAPage, ILayoutHPage, IAnyContent, IFinManSearch, IAppFormat, ISearchBucket, IPagesContent, IAllContentType } from './IAlvFinManProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import * as strings from 'AlvFinManWebPartStrings';


//Interfaces
import { ISourceProps, ISourceInfo, IFMSearchType, IFMSearchTypes } from './DataInterface';

//Constants
import { SourceInfo, thisSelect, SearchTypes } from './DataInterface';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';
import { warnMutuallyExclusive } from 'office-ui-fabric-react';

import { getHelpfullErrorV2 } from '@mikezimm/npmfunctions/dist/Services/Logging/ErrorHandler';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //



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

    news: [],
    help: [],
  };

  return result;

}


  //Standards are really site pages, supporting docs are files
  export async function getALVFinManContent( sourceProps: ISourceProps, search: IFinManSearch ) {

    // debugger;
    let web = await Web( `${window.location.origin}${sourceProps.webUrl}` );

    let expColumns = getExpandColumns( sourceProps.columns );
    let selColumns = getSelectColumns( sourceProps.columns );

    const expandThese = expColumns.join(",");
    //Do not get * columns when using standards so you don't pull WikiFields
    let baseSelectColumns = sourceProps.selectThese ? sourceProps.selectThese : sourceProps.columns;
    let selectThese = [ baseSelectColumns, ...selColumns].join(",");
    let restFilter = sourceProps.restFilter ? sourceProps.restFilter : '';
    let orderBy = sourceProps.orderBy ? sourceProps.orderBy : null;
    let items = [];
    console.log('sourceProps', sourceProps );
    try {
      if ( orderBy ) {
        //This does NOT DO ANYTHING at this moment.  Not sure why.
        items = await web.lists.getByTitle( sourceProps.listTitle ).items
        .select(selectThese).expand(expandThese).filter(restFilter).orderBy(orderBy.prop, orderBy.asc ).getAll();
      } else {
        items = await web.lists.getByTitle( sourceProps.listTitle ).items
        .select(selectThese).expand(expandThese).filter(restFilter).getAll();
      }


    } catch (e) {
      getHelpfullErrorV2( e, true, true, 'getALVFinManContent ~ 73');
      console.log('sourceProps', sourceProps );
    }


    // debugger;
    items = addSearchMeta( items, sourceProps, search );

    console.log( sourceProps.defType, sourceProps.listTitle , search, items );

    return items;


  }
  //Standards are really site pages, supporting docs are files
  // export async function getAppLinks( sourceProps: ISourceProps, search: IFinManSearch ) {

  //   let web = await Web( `${window.location.origin}${sourceProps.webUrl}` );

  //   let expColumns = getExpandColumns( sourceProps.columns );
  //   let selColumns = getSelectColumns( sourceProps.columns );

  //   const expandThese = expColumns.join(",");
  //   //Do not get * columns when using standards so you don't pull WikiFields
  //   let selectThese = [ ...sourceProps.columns, ...selColumns].join(",");
  //   let restFilter = "";

  //   let items = await web.lists.getByTitle( sourceProps.listTitle ).items
  //         .select(selectThese).expand(expandThese).filter(restFilter).getAll();

  //   // debugger;
  //   items = addSearchMeta( items, sourceProps.searchProps, search, 'link' );

  //   console.log( 'AppLinksList', search, items );

  //   return items;

  // }


  //Standards are really site pages, supporting docs are files
  // export async function getStandardDocs( sourceProps: ISourceProps, search: IFinManSearch ) {

  //   let web = await Web( `${window.location.origin}${sourceProps.webUrl}` );
    
  //   let expColumns = getExpandColumns( sourceProps.columns );
  //   let selColumns = getSelectColumns( sourceProps.columns );
    
  //   const expandThese = expColumns.join(",");
  //   //Do not get * columns when using standards so you don't pull WikiFields
  //   let selectThese = sourceProps.listTitle === 'StandardDocuments' ? [ ...sourceProps.columns, ...selColumns].join(",") : '*,' + [ ...sourceProps.columns, ...selColumns].join(",");
  //   // let selectThese = library === StandardsLib ? [ ...selColumns].join(",") : '*,' + [ ...selColumns].join(",");
  //   // let selectThese = '*,' + [ ...selColumns].join(",");
  //   let restFilter = "";

  //   let docs: IAnyContent[] = await web.lists.getByTitle( sourceProps.listTitle ).items
  //         .select(selectThese).expand(expandThese).filter(restFilter).getAll();

            
  //   docs = addSearchMeta( docs, sourceProps.searchProps, search, sourceProps.listTitle );

  //   console.log( sourceProps.listTitle, search, docs );

  //   return docs;

  // }


  // export async function getAccounts( sourceProps: ISourceProps, search: IFinManSearch ) {

  //   let preFetchTime = new Date();
  
  //   let web = await Web( `${window.location.origin}${sourceProps.webUrl}` );
    
  //   let expColumns = getExpandColumns( sourceProps.columns );
  //   let selColumns = getSelectColumns( sourceProps.columns );
    
  //   const expandThese = expColumns.join(",");
  //   let selectThese = '*,' + sourceProps.columns.join(",");
  //   let restFilter = "";
  
  //   let accounts: IAnyContent[] = await web.lists.getByTitle( sourceProps.listTitle ).items
  //         .select(selectThese).expand(expandThese).filter(restFilter).getAll();
  
  //   let postFetchTime = new Date();
  
  //   accounts = addSearchMeta( accounts, sourceProps.searchProps, search, 'account' );
  
  //   let fetchTime = postFetchTime.getTime() - preFetchTime.getTime();
  
  //   console.log( 'getAccounts', search, accounts );
  
  //   return { fetchTime: fetchTime, accounts: accounts, filtered: accounts };
  
  // }

  export function updateSearchCounts( format: IAppFormat, items: IAllContentType[], search: IFinManSearch ) {

    items.map( item  => {
      //Update search count and add items to search buckets

      search.left.SearchLC.map( ( searchLC, idx ) => {
        if ( item.leftSearchLC.indexOf( searchLC ) > -1 ) { 
          search.left.SearchCount[ idx ] ++ ; 
          search.left[format].push( item as any );  //2022-04-24:  Added as any to remove typescript warning after adding IPageContent
          search.left.items.push( item );

        }
      });

      //Update search count and add items to search buckets

      search.top.SearchLC.map( ( searchLC, idx ) => {
        if ( item.topSearchLC.indexOf( searchLC ) > -1 ) { 
          search.top.SearchCount[ idx ] ++ ;
          search.top[format].push( item as any );  //2022-04-24:  Added as any to remove typescript warning after adding IPageContent
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

  export function addSearchMeta ( items: IAnyContent[], sourceProps: ISourceProps, search: IFinManSearch ) {
    
    //searchNest will be an array of prop key arrays... so [ 'Author/Title' ] => [ ["Author","Title"] ]
    let searchNest: string[][] = [];  
    sourceProps.searchProps.map( prop => {
      if ( prop.indexOf('.') > -1 || prop.indexOf('/') > -1) {
        searchNest.push( prop.trim().replace(' ','' ).split(/[.\/]/gm) ) ;
      } else {
        searchNest.push( [prop.trim().replace(' ','' )] ) ;
      }
    });

    // debugger;

    items.map ( item => {
      let searchTitle = '';
      let searchDesc = '';
      let searchHref = '';

      //https://stackoverflow.com/a/15191245
      if ( item.Created ) {
        item.createdMS = Date.parse(item.Created);
        item.createdLoc = item.Created.toLocaleString();
      }

      if ( item.Modified ) {
        item.modifiedMS = Date.parse(item.Modified);
        item.modifiedLoc = item.Modified.toLocaleString();
      }

      if ( item.FirstPublishedDate ) { 
        item.publishedMS = Date.parse(item.FirstPublishedDate); 
        item.publishedLoc = item.publishedMS.toLocaleString();
      }

      if ( item.ReportingSections ) { item.Reporting = item.ReportingSections ; }

      let meta: string[] = [];
      //This is for display purposes so user can see what property the search criteria is found in
      let searchText : string = searchNest.map( ( propArray, idx)  => {

        if ( propArray.length === 1 ) {
          item[ sourceProps.searchProps[ idx ] ] = item[ propArray[0] ]; //Add flattened value - item["Author/Title"]= item.Author.Title
          if ( Array.isArray( item[ propArray[0] ] )) {
            return `${sourceProps.searchProps[ idx ]}=${item[ propArray[0] ].join(';')}`;
  
          } else {
            return `${sourceProps.searchProps[ idx ]}=${item[ propArray[0] ]}`;
          }

        } else if ( propArray.length === 2 ) {
          let hasError: boolean = false;
          try {
            item[ sourceProps.searchProps[ idx ] ] = item[ propArray[0] ][ propArray[1] ]; //Add flattened value - item["Author/Title"]= item.Author.Title
            //Manually copy ReportingSections/Title over to Reporting/Title
            if ( sourceProps.searchProps[ idx ] === 'ReportingSections/Title' ) { item[ 'Reporting/Title'] = item[ sourceProps.searchProps[ idx ] ]; }
          } catch (e) {
            // alert('Error doing search props');
            let lastPart = item[propArray[0] ] ? item[propArray[0] ][ propArray[1] ] : 'UNK';
            item[ sourceProps.searchProps[ idx ] ] = lastPart;
            console.log( 'Search Error: ~ `77', item, sourceProps.searchProps, idx, item[propArray[0] ] , lastPart  );
            hasError = true;
          }

          if ( hasError === true ) {
            return `${sourceProps.searchProps[ idx ]}=UNK`;
          } else {

            //This first loop never gets triggered with multi-select lookups because the array is really item [ propArray[0] ]
            if ( Array.isArray( item[ propArray[0] ][ propArray[1] ]  )) {
              let result = `${sourceProps.searchProps[ idx ]}=${item[ propArray[0] ][ propArray[1] ] .join(';')}`;
              if ( sourceProps.searchProps[ idx ] === 'ReportingSections/Title' ) { 
                result += ` || Reporting/Title=${item[ propArray[0] ][ propArray[1] ] .join(';')}`; }
              return result;

            } else if ( Array.isArray( item[ propArray[0] ] )  ) {
              /**
               * NEED TO ADD LOOP HERE TO CHECK FOR MULTI-SELECT Lookups like ReportingSections/Titles.
               * They don't get caught in the above one because the logic does not work that way
               */


            } else {



              let result = `${sourceProps.searchProps[ idx ]}=${item[ propArray[0] ][ propArray[1] ] }`;
              if ( sourceProps.searchProps[ idx ] === 'ReportingSections/Title' ) { 
                result += ` || Reporting/Title=${item[ propArray[0] ][ propArray[1] ] }`; }

              return result;
            }
          }

        }

        
      }).join(' || ');
      
      //Get rid of any empty strings
      searchText.split(' || ' ).map( text => {
        if ( text ) { meta.push( text ); }
      });

      //searchTextLC is used for actual search function - removes Column Titles from searchable text
      let searchTextLC : string = sourceProps.searchProps.map( prop => {
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
        searchTitle = item['FileLeafRef'] ? item['FileLeafRef'] : 'No Filename to show';
        searchDesc = '';

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
        item.type = sourceProps.defType;
        searchTitle = item.Title;
        searchDesc = 'Other Type Search Desc';

      }

      item.format = sourceProps.key;

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
        if ( item.Description && ( item.Description.indexOf('&quot;') > -1 || item.Description.indexOf('\<\/') > -1 ) ) { item.descIsHTML = true ; }
        searchHref = '';
      }

      //This if was added for the Standards Wiki Library where the title column is actually Title0
      if ( !searchTitle && item.Title0 ) { searchTitle = item.Title0 ; } 
      if ( !searchTitle && item.FileLeafRef ) { searchTitle = item.FileLeafRef.substr(0, item.FileLeafRef.lastIndexOf('.') ) ; } //Added for Std #139 which does not have a Title value.
      if ( !searchDesc ) { searchDesc = '' ; } 

      if ( !searchHref ) { 
        if ( item.ServerRedirectedEmbedUri ) { searchHref = item.ServerRedirectedEmbedUri ;  }
        else if ( item.FileRef ) { searchHref = item.FileRef ;  }
        else if ( item[ 'File/ServerRelativeUrl' ] ) { searchHref = item[ 'File/ServerRelativeUrl' ] ;  }

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