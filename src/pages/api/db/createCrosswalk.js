import { prisma } from "../../../src/prisma";

export default async function createCrosswalk(req, res) {

    const { 
        userId, 
        userName,
        address,
        description,
        // image
        lat, 
        lng,
    } = req.body;
    
    let currDate = new Date();
    const isoDate = currDate.toISOString()
    const data = {
                userId: userId,
                userName: userName,
                latitude: lat,
                longitude: lng,
                address: address,
                description: description,
                votes: 0,
                createdAt: isoDate,
                updatedAt: isoDate
            };
    console.log(data)

    try {
        const result = await prisma.crosswalk.create({
            data: data
          })
        res.json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
