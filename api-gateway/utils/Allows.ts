import { Matrix } from "../models/matrix";
import redisClient from "../redis";

export const isAllowed = async (
  roleId: number,
  route: string,
  method: string
) => {
  const cacheKey = "matrix_rules";

  try {
    const cachedRules = await redisClient.get(cacheKey);

    let rules: Matrix[];

    if (cachedRules) {
      rules = JSON.parse(cachedRules);
    } else {
      rules = await Matrix.findAll();
      await redisClient.set(cacheKey, JSON.stringify(rules));
    }

    const rule = rules.find((r) => {
      const routeRegex = new RegExp(r.route);
      return r.role_id === roleId && routeRegex.test(route);
    });

    if (!rule) {
      return "no";
    }

    switch (method) {
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
  } catch (error) {
    console.error("Redis error:", error);
    return "no";
  }
};
