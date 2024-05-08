import bcrypt from "bcryptjs";
export const hashPassword = async (password: string) => {
  const passwordHash = await bcrypt.hash(password, 12);
  return passwordHash;
};

export const comparePasswordHash = async (
  password: string,
  userPassword: string,
) => {
  const isMatch = await bcrypt.compare(password, userPassword);
  return isMatch;
};
