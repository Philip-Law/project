export interface Auth0User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  isAdmin?: boolean;
}

export enum AdType {
  ItemWanted = 'W',
  ItemSelling = 'S',
  AcademicService = 'A',
}
