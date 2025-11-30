declare module 'cors' {
  import { RequestHandler } from 'express';
  const cors: RequestHandler & {
    /**
     * Create a CORS middleware with given options.
     * The signature is permissive to cover common usages.
     */
    (options?: any): RequestHandler;
  };
  export default cors;
}
