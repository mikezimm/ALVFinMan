
import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutNPage, ILayoutGPage, ILayoutSPage, ILayoutAll, ILayoutAPage, ILayoutQPage, ILayoutHPage, IAnyContent, IFinManSearch, IAppFormat, ISearchBucket } from './IAlvFinManProps';
import { ILayout1Page, ILayout1PageProps, Layout1PageValues } from './Layout1Page/ILayout1PageProps';
import { escape } from '@microsoft/sp-lodash-subset';


export function createEmptyBuckets() {
  return  {
    Functions: [],
    Topics: [],
    ALGroup: [],
    // Sections: [],
    Reporting: [],
    Processes: [],
    DocumentType: [],
  };
}


export function updateBuckets ( buckets: IFMBuckets, docs: any[], sort: boolean ) {

  docs.map( doc => {

    Object.keys( buckets ).map ( key => {
      let docProp = key === 'Reporting' ? 'Sections' : key;
      if ( doc[ docProp ] ) {
        if ( Array.isArray( doc[ docProp ] ) ) {
          doc[ docProp ].map( item => {
            if ( item.Title && buckets[ key ].indexOf( item.Title ) < 0 ) { 
              
              buckets[key].push( item.Title) ;
             }
          });
        } else {
          if ( doc[docProp] && buckets[ key ].indexOf( doc[docProp].Title ) < 0 ) { buckets[key].push( doc[docProp].Title) ; }
        }
      }
    });

  });

  if ( sort === true ) {
    Object.keys( buckets ).map ( key => {
      buckets[key].sort();
    });  
  }

  console.log('buckets', buckets );
  return buckets;

}