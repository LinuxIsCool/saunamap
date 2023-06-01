import { prisma } from "../../../prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function updateSauna(req, res) {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).send('No permissions')
      return
    }
    
    const { 
        // userId, 
        markerId,
        address,
        description,
        shareInfo, // nameImage, nameOnly, anon
    } = req.body;
    
    let currDate = new Date();
    const isoDate = currDate.toISOString()

    try {
        const updateSauna = await prisma.sauna.update({
            where: {
                // userId: userId,
                id: markerId
            },
            data: {
                address: address,
                description: description,
                updatedAt: isoDate
            }
          })
        res.json(updateSauna);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
