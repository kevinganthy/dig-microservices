import { CONFIG } from "../config";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Response, Request } from 'express';


export const cartsProxy = createProxyMiddleware({
  target: CONFIG.SERVICES.CART,
  on: {
    proxyReq: (proxyReq: any, req: Request, res: Response) => {
      // Si le status est en "self", la requête sur le panier doit etre restreinte à l'utilisateur connecté
      if ( res.locals.status === "self" ) {
        proxyReq.setHeader("x-user-id", req.currentUser!.userId.toString());
      }
    }
  }
});