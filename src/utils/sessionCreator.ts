import { type UserDetails } from "@/types";
import jwt from "jsonwebtoken";
import { db } from "@/server/db";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";

const sessionCreator = async ({ userData }: { userData: UserDetails }) => {
  try {
    const payload = {
      userId: userData.id,
      email: userData.email,
      name: userData.name,
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      algorithm: "HS256",
    });
    await db.session.create({
      data: {
        userId: userData.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        createdAt: new Date(),
      },
    });
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

export { sessionCreator };
