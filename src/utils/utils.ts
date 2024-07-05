import bcrypt from "bcrypt";

const roundsSalt = process.env.SALT_ROUNDS || 10;

export async function generateHashPassword(password: string) {
  const salt = await bcrypt.genSalt(Number(roundsSalt));
  return await bcrypt.hash(password, salt);
}