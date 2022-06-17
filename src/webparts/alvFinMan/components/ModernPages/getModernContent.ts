
import ReactJson from "react-json-view";

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import { ILayoutGPage, ILayoutSPage, ILayoutAPage, IFMBuckets, IPagesContent, ICanvasContentOptions,   } from '../IAlvFinManProps';



import { ISourceProps, LookupColumns, SourceInfo } from '../DataInterface';

  
  //Standards are really site pages, supporting docs are files
  export async function getDocWiki( item: IPagesContent, source: ISourceProps, canvasOptions: ICanvasContentOptions,  showCanvasContent1: boolean, callBack: any ) {

    let web = await Web( `${window.location.origin}${ source.webUrl}` );

    const columns = source.columns;

    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );

    const expandThese = expColumns.join(",");
    let selectThese = '*,WikiField,CanvasContent1,LayoutsWebpartsContent,BannerImageUrl' + selColumns.join(",");

    // Why an await does not work here is beyond me.  It should work :(
    // let fullItem = await web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID );
    web.lists.getByTitle( source.listTitle ).items.select(selectThese).expand(expandThese).getById( parseInt( item.ID ) ).fieldValuesAsHTML().then( ( result: IPagesContent ) => {
      console.log( 'ALVFinManDocs', result );

        //Added this to fit images into the current width or else the image is full size
        if ( result.CanvasContent1 ) { result.CanvasContent1Str = result.CanvasContent1.replace( /<img\s*/ig , `<img ${canvasOptions.imageOptions.style} ` ) ; }

        //Need to manually update the BannerImageUrl property from original item because it comes across as an attribute link as text
        result.BannerImageUrl = item.BannerImageUrl;
        result.fetchError = '';
        console.log('Fetched modern page');
        callBack( result, showCanvasContent1 ) ;

    }).catch( e => {
        item.fetchError = 'Error getting item wiki';
        console.log('Error getting item wiki');
        callBack( item, showCanvasContent1 ) ;

    });



  }
