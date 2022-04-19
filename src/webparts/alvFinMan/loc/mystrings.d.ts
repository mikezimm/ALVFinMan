declare interface IAlvFinManWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;

  FinManSite: string;
  StandardsLib: string;
  SupportingLib: string;
  
}

declare module 'AlvFinManWebPartStrings' {
  const strings: IAlvFinManWebPartStrings;
  export = strings;
}
