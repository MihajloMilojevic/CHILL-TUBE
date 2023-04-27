import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: "SID",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  //ttl: 1 * 60 * 60, // session last 1 hour
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
  },
};

// this wrapper is for API router that need access to req.session
export function APISession(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// this wrapper is used for getServerSideProps
export function SSRSession(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}