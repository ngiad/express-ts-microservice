import { ErrBranchDeleted } from "../../../branch/model/error";
import { UserType } from "../../domain/entities/user.entity";
import { UserStatus } from "../dto";
import { ErrUserBanner, ErrUserNotfound } from "../dto/error";

export function userErrCheck(user: UserType | null) {
  if (!user) throw ErrUserNotfound;
  if (user.status === UserStatus.Deleted) throw ErrBranchDeleted;
  if (user.status === UserStatus.Banner) throw ErrUserBanner;
}
