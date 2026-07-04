import { AuthorizationError } from "../errors/index.js";
import { ROLE_HIERARCHY } from "../constants/index.js";

export default function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AuthorizationError("Authentication required.");
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = Math.min(
      ...allowedRoles.map((role) => ROLE_HIERARCHY[role])
    );

    if (userRoleLevel === undefined || userRoleLevel > requiredLevel) {
      throw new AuthorizationError(
        `Requires one of: ${allowedRoles.join(", ")}`
      );
    }

    next();
  };
}
