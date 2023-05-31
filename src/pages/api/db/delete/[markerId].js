import { prisma } from "../../../../prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function deleteCrosswalk(req, res) {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).send('No permissions')
      return
    }
    
    const { markerId } = req.query;

    try {
        const deleteCrosswalk = await prisma.crosswalk.delete({
            where: {
                id: parseInt(markerId),
            },
          })
        res.json(deleteCrosswalk);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
