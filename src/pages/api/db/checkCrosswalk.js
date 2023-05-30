import { prisma } from "../../../prisma";

export default async function checkCrosswalk(req, res) {
    const { userId, markerId } = req.body;

    try {
        console.log(markerId)
        const marker = await prisma.crosswalk.findUnique({
            where: {
                id: markerId
            }
        })
        const voted = await prisma.userVote.findFirst({
            where: {
                userId: {
                    equals: userId
                },
                saunaId: {
                    equals: markerId.toString()
                }
            }
        })
        if (!voted) {
            res.json({upvoted: false, marker: marker})
        } else {
                res.json({upvoted: true, marker: marker})
            }

    } catch (error) {
        res.status(400).send(error.message);
    }
}
