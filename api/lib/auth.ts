import { jwtVerify, SignJWT } from "jose";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): Promise<boolean> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No autorizado" });
    return false;
  }
  const token = header.slice(7);
  const valid = await verifyToken(token);
  if (!valid) {
    res.status(401).json({ error: "Token invalido o expirado" });
    return false;
  }
  return true;
}
