import { Request, Response } from "express";
import { NextFunction } from "express";
import { Staff } from "~/entity";
import { RoleEnum } from "~/enums/RoleEnum";

export const roleControlAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as Staff;
  let role = await user.getRoles();

  role = role.filter((r) => r.title === RoleEnum.ADMIN);
  if (role.length > 0) {
    next();
  } else {
    // TODO: Remove if not relevant
    if (req.method === "GET") {
      next();
    } else {
      res.status(401).json({
        admin: false,
        message: "user does not have admin privilege",
      });
    }
  }
};
