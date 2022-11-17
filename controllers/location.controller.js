const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

const locationGetAll = async (req, res) => {
    try {
        const allLocations = await prisma.location.findMany();
        res.status(200).json(allLocations);
    } catch (error) {
        throw error;
    }
}

const locationFiltered = async (req, res) => {
    try {
        const { idLocation } = req.params;
        const location = await prisma.location.findFirst({
            where: {
                location_id: idLocation,
            }
        });
        res.status(200).json(location);
    } catch (error) {
        throw error;
    }
}


module.exports = {

}