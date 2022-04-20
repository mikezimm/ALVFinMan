
import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutMPage, ILayoutSPage, ILayoutAll, ILayoutAPage } from './IAlvFinManProps';
import { ILayout1Page, ILayout1PageProps, Layout1PageValues } from './Layout1Page/ILayout1PageProps';
import { escape } from '@microsoft/sp-lodash-subset';


export function createEmptyBuckets() {
  return  {
    Functions: [],
    Topics: [],
    ALGroup: [],
    Sections: [],
    Processes: [],
    DocumentType: [],
  };
}


export function updateBuckets ( buckets: IFMBuckets, docs: any[], sort: boolean ) {

  docs.map( doc => {

    Object.keys( buckets ).map ( key => {
      if ( doc[ key ] ) {
        if ( Array.isArray( doc[ key ] ) ) {
          doc[ key ].map( item => {
            if ( item.Title && buckets[ key ].indexOf( item.Title ) < 0 ) { buckets[key].push( item.Title) ; }
          });
        } else {
          if ( doc[key] && buckets[ key ].indexOf( doc[key].Title ) < 0 ) { buckets[key].push( doc[key].Title) ; }
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