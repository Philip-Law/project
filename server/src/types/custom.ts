export interface Auth0User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

export enum AdType {
  ItemWanted = 'W',
  ItemSelling = 'S',
  AcademicService = 'A',
}
