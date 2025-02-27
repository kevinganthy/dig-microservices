import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import { Sequelize, DataTypes, Model, Optional, HasManyHasAssociationMixin, Op } from "sequelize";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { Scrypt } from "./Scrypt";

dotenv.config();

const SERVICES = {
  PRODUCT: process.env.HOST_PRODUCT,
  CART: process.env.HOST_CART
};

interface UserPayload {
  userId: number;
  role: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const app = express();

app.use(bodyParser.json());

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || "",
  process.env.POSTGRES_USER || "",
  process.env.POSTGRES_PASSWORD || "",
  {
    host: process.env.HOST_DB,
    dialect: "postgres",
  }
);

interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role_id: number;
  created_at?: Date;
}
interface RoleAttributes {
  id: number;
  name: string;
  created_at?: Date;
}

interface MatrixAttributes {
  id: number;
  role_id: number;
  route: string;
  r: string;
  w: string;
  u: string;
  d: string;
  created_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at'> {}
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'created_at'> {}
interface MatrixCreationAttributes extends Optional<MatrixAttributes, 'id' | 'created_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public password!: string;
  public role_id!: number;
  public readonly created_at!: Date;

  declare Role: HasManyHasAssociationMixin<Role, number>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public readonly created_at!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

class Matrix extends Model<MatrixAttributes, MatrixCreationAttributes> implements MatrixAttributes {
  public id!: number;
  public role_id!: number;
  public route!: string;
  public r!: string;
  public w!: string;
  public u!: string;
  public d!: string;
  public readonly created_at!: Date;
}

Matrix.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false
    },
    r: {
      type: DataTypes.STRING,
      allowNull: false
    },
    w: {
      type: DataTypes.STRING,
      allowNull: false
    },
    u: {
      type: DataTypes.STRING,
      allowNull: false
    },
    d: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize,
    tableName: "matrix",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

User.belongsTo(Role, { foreignKey: "role_id" });
Role.hasMany(User, { foreignKey: "role_id" });
Matrix.belongsTo(Role, { foreignKey: "role_id" });
Role.hasMany(Matrix, { foreignKey: "role_id" });


app.post('/auth', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ 
    where: { email }
  });

  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  if (!Scrypt.compare(password, user.password)) {
    res.status(401).send('Invalid password');
    return;
  }

  const payload: UserPayload = { userId: user.id, role: user.role_id };
  const token = jwt.sign(payload, process.env.TOKEN_SECRET as string);
  res.send({ token });
});


const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]!;
    const payload = jwt.verify(token, process.env.TOKEN_SECRET as string) as UserPayload;
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


const isAllowed = async (roleId: number, route: string, method: string) => {
  const rules = await Matrix.findAll();

  const rule = rules.find((r) => {
    const routeRegex = new RegExp(r.route);
    return r.role_id === roleId && routeRegex.test(route)
  });

  if (!rule) {
    return "no";
  }

  switch(method) {
    case "GET": 
      return rule.r;
    case "POST":
      return rule.w;
    case "PUT":
      return rule.u;
    case "DELETE":
      return rule.d;
    default:
      return "no";
  }
}


app.use('/products', async (req: Request, res: Response, next: NextFunction) => {
  const status = await isAllowed(req.currentUser!.role, req.originalUrl, req.method);
  if (status === "no") {
    res.status(403).send('Accès non autorisé');
    return;
  } 

  next();
}, productProxy);

const cartsProxy = createProxyMiddleware({
  target: SERVICES.CART,
  on: {
    proxyReq: (proxyReq: any, req: Request, res: Response) => {
      // Si le status est en "self", la requête sur le panier doit etre restreinte à l'utilisateur connecté
      if ( res.locals.status === "self" ) {
        proxyReq.setHeader("x-user-id", req.currentUser!.userId.toString());
      }
    }
  }
});

app.use('/carts', async (req: Request, res: Response, next: NextFunction) => {
  const status = await isAllowed(req.currentUser!.role, req.originalUrl, req.method);
  if (status === "no") {
    res.status(403).send('Accès non autorisé');
    return;
  } 
  
  res.locals.status = status;
  next();
}, cartsProxy);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});