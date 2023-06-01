import { prisma } from "../../../prisma";

export default async function getAllSaunas(req, res) {
    

    const result = await prisma.sauna.findMany({
        
      })

    res.json(result);
}
