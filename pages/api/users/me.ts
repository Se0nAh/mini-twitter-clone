import {NextApiRequest, NextApiResponse} from "next";
import {withApiSession} from "../../../lib/withSession";
import db from "../../../lib/db";
import withHandler from "../../../lib/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (!req.session.user?.id) {
    return res.status(401).end();
  }
  const profile = await db.user.findUnique({
    where: { id: req.session.user?.id },
  });
  if (!profile) {
    return res.status(404).end();
  }
  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(
  withHandler({methods: ["GET"], handler, isPrivate: false})
);