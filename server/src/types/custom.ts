export interface Auth0User {
  id: string;
  email: string;
  isAdmin: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

export enum AdType {
  ItemWanted = 'W',
  ItemSelling = 'S',
  AcademicService = 'A',
}
