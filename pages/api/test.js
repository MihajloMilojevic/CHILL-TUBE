// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const same = await bcrypt.compare(req.query.pass, req.query.hash)
  res.status(200).json({ same })
}
