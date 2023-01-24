import { prisma } from "../../../src/prisma";

export default async function checkCrosswalk(req, res) {
    const { userId, markerId } = req.body;

    try {
        const voted = await prisma.userVote.findUnique({
            where: {
                userId: userId
            },
            select: {
                upvoted: true            
            }
        })
        if (!voted) {
            res.json({upvoted: false})
        } else {
            if (voted.upvoted.includes(markerId)) {
                res.json({upvoted: true})
            } else {
                res.json({upvoted: false})
            }
        }

        // res.json({upvoted: voted.upvoted, downvoted: voted.downvoted})
    } catch (error) {
        res.status(400).send(error.message);
    }
}