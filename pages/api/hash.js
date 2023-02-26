// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.query.pass, salt)
  res.status(200).json({ hashedPassword})
}
