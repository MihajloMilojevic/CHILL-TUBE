import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: "SID",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  ttl: 2 * 60 * 60,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
  },
};

export function APISession(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function SSRSession(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}