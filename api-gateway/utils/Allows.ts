import { Matrix } from "../models/matrix";

export const isAllowed = async (roleId: number, route: string, method: string) => {
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
