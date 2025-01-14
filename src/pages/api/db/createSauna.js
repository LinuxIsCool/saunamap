import { prisma } from "../../../prisma";

export default async function createSauna(req, res) {

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
                createdAt: isoDate,
                updatedAt: isoDate
            };
    console.log(data)

    try {
        const result = await prisma.sauna.create({
            data: data
          })
        res.json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
