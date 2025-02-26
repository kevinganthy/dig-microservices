import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';



const SERVICES = {
  PRODUCT: 'http://product:3000',
  CART: 'http://cart:3000'
};

interface UserPayload {
  userId: number;
  role: 'admin' | 'user';
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const app = express();
const PORT = 3000;



// TODO : AUTH SIMULATION
app.post('/auth', (req: Request, res: Response) => {
  const user = { userId: '2', role: 'admin' };
  const token = jwt.sign(user, 'SECRET_KEY');
  res.send({ token });
});


const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]!;
    const payload = jwt.verify(token, 'SECRET_KEY') as UserPayload;
    req.currentUser = payload;
    next();
  } catch (err) {
    res.status(401).send('Accès non autorisé');
  }
};

app.use(validateJWT);



const productProxy = createProxyMiddleware({
  target: SERVICES.PRODUCT
});

app.use('/products', (req: Request, res: Response, next: NextFunction) => {
  // Vérification RBAC
  // if (req.method === 'POST' && req.currentUser?.role !== 'admin') {
  //   return res.status(403).send('Permissions insuffisantes');
  // }
  next();
}, productProxy);



const cartsProxy = createProxyMiddleware({
  target: SERVICES.CART
});

app.use('/carts', (req: Request, res: Response, next: NextFunction) => {
  // Vérification propriétaire
  // if (req.currentUser?.role === 'user' && req.currentUser.userId !== userId) {
  //   return res.status(403).send('Accès aux données non autorisé');
  // }
  next();
}, cartsProxy);



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
