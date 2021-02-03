import { NextFunction, Request, Response } from "express";
import { Staff } from "~/entity";
import { AppRoleEnum } from "~/enums/RoleEnum";

export const hasAdminAccessMiddleware = () => {
  return function (req: Request, res: Response, next: NextFunction) {
    hasAdminAccess(req, res);
    next();
  };
};

export const hasAdminAccess = (req: Request, res: Response) => {
  const user = req.user as Staff;
  if (user.appRole !== AppRoleEnum.ADMIN) {
    res.status(401).json({
      admin: false,
      message: "user does not have admin privilege",
    });
  }
};
