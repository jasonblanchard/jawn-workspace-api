declare namespace Express {
  export interface Request {
    accessTokenPayload?: {
      uesrUuid?: string,
      csrfToken?: string,
    }
  }
}