import { CONFIG } from "../config";
import { createProxyMiddleware } from 'http-proxy-middleware';

export const productProxy = createProxyMiddleware({
  target: CONFIG.SERVICES.PRODUCT
});