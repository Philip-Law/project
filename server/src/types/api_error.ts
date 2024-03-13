export class APIError extends Error {
  constructor(public status: Status, message: string, public stack?: string) {
    super(message);
  }
}

export enum Status {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
