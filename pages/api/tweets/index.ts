import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../lib/withHandler";
import db from "../../../lib/db";
import { withApiSession } from "../../../lib/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { text },
      session: { user },
    } = req;
    const tweet = await db.tweet.create({
      data: {
        text,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      tweet,
    });
  }

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const tweets = await db.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { Like: true } },

        user: true,
        Like: { where: { userId: user?.id }, select: { userId: true } },
      },
    });

    res.json({
      ok: true,
      tweets,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
