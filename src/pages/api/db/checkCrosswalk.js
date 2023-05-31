import { prisma } from "../../../prisma";

export default async function checkCrosswalk(req, res) {
    const { userId, markerId } = req.body;

    try {
        const marker = await prisma.crosswalk.findUnique({
            where: {
                id: markerId
            },
            include: {
                _count: {
                    select: { userVotes: true }
                }
            }
        })
        const voted = await prisma.userVote.findFirst({
            where: {
                userId: {
                    equals: userId
                },
                crosswalkId: {
                    equals: markerId
                }
            }
        })

        console.log("Marker:")
        console.log(marker)
        if (!voted) {
            res.json({upvoted: false, marker: marker})
        } else {
                res.json({upvoted: true, marker: marker})
            }

    } catch (error) {
        res.status(400).send(error.message);
    }
}
