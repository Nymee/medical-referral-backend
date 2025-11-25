// Extend Express Request type to include user from JWT. This is called declaration merging
declare namespace Express {
  export interface Request {
    user?: {
      sub: string;
      email: string;
      role: string;
    };
  }
}
