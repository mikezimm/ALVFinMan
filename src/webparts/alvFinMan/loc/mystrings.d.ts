declare interface IAlvFinManWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;

  // 1 - Analytics options
  analyticsWeb: string;
  analyticsViewsList: string;
  analyticsDeepLinksList: string;

}

declare module 'AlvFinManWebPartStrings' {
  const strings: IAlvFinManWebPartStrings;
  export = strings;
}
