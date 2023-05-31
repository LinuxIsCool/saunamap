import { prisma } from "../../../prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function upvoteCrosswalk(req, res) {
  const { userId, markerId } = req.body;

  //const { userId_ } = getAuth(req);
  //if (!userId_) {
      //res.status(401).send('No permissions')
      //return
  //}

    try {
        const vote = await prisma.userVote.findFirst({
            where: {
                userId: {
                    equals: userId
                },
                crosswalkId: {
                    equals: markerId
                }
            }
        });
      if (vote) {
        res.status(400).send('Crosswalk alread upvoted.')
      }
      else {
        const created = await prisma.userVote.create({
          data : {
            userId: userId,
            crosswalkId: markerId,
          }
        })
        res.json(created)
      }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
