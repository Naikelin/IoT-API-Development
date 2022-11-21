const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

/* FUNCTIONS */
const CheckIfLocationExists = async (Name, CompanyId) => {
    let locationsCount = await prisma.location.count(
        {
          where: {
            location_name: Name,
            company_id: CompanyId,
          }
        })
    if (locationsCount === 0) {
        return false
    } else {
        return true
    }
}

/* CRUD */ 
/* Obtiene todas las localizaciones */
const GetAllLocation = async (req, res, next) => {
    const { companyId } = req.body;
    try {
        let allLocations = await prisma.location.findMany({
            where: {
                company_id: companyId,
            }
        })
        res.status(200).json(allLocations);
    } catch (error) {
        throw error;
    }
}

/* Obtiene una localización filtrando por ID */
const GetLocationByName = async (req, res, next) => {
    const { companyId } = req.body;
    const { locationName } = req.query;

    if (!locationName) res.status(401).json({message: 'Provide all params required in query'});

    try {
        const location = await prisma.location.findFirst({
            where: {
                company_id: companyId,
                location_name: locationName,
            },
            select: {
                location_name: true,
                location_city: true,
                location_country: true,
                company_id: true,
            }
        });

        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).json({message: 'Location not found'});
        }
    } catch (error) {
        throw error;
    }
}

/* Crea una localización y la asocia a una compañía partir de una API Key. */
const CreateLocation = async (req, res, next) => {
    try {
        const { companyId, locationName, locationCountry, locationCity } = req.body;
        if (! locationCity || !locationCountry || !locationName) res.status(401).json({message: 'Provide all params required in body'});
        let locationExists = await CheckIfLocationExists(locationName, companyId.company_id);
        if (!locationExists) {
            const newLocation = await prisma.location.create({
                data: {
                    location_city: locationCity,
                    location_country: locationCountry,
                    location_name: locationName,
                    company_id: parseInt(companyId),
                },
            });
            res.status(201).json({message: 'Location created succesfully', newLocation});
        } else {
            res.status(403).json({message: 'Location already exists'});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

module.exports = {
    GetAllLocation,
    GetLocationByName,
    CreateLocation,
}