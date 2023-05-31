import { prisma } from "../../../prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function downvoteCrosswalk(req, res) {
  //const { userId_ } = getAuth(req);
  //if (!userId_) {
      //res.status(401).send('No permissions')
      //return
  //}

    const { userId, markerId } = req.body;
    
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
      if (!vote) {
        res.status(400).send('Nothing to Downvote.')
      }
      const deleted = await prisma.userVote.delete({
        where: {
          id: vote.id
        }
      })

      res.status(200).send(deleted);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
