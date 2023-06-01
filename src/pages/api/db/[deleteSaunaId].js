import { prisma } from "../../../prisma";

export default async function deleteSauna(req, res) {
    const { markerId } = req.query;

    try {
        const deleteSauna = await prisma.sauna.delete({
            where: {
                id: markerId
            }
          })
        res.json(deleteSauna);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
