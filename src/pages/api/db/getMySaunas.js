import { prisma } from "../../../prisma";

export default async function getMySaunas(req, res) {
    const { userId } = req.body;
   

    const result = await prisma.sauna.findMany({
        where: {
            userId: userId
        }
    })

    res.json(result);
}
