const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

const createCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) res.status(401).json({message: 'Provide a company name'});
        const company_apy = bcrypt.hash(companyName);
        const newCompany = await prisma.company.create({
        data: {
            company_name: companyName,
            company_api_key: company_apy,
        }
        })
        res.status(201).json({message: 'Company created succesfully', newCompany});
    } catch (error) {
        throw error;
    }
};

const createLocation = async (req, res) => {
    try {
        const { companyId, locationName, locationCountry, locationCity } = req.body;
        if (!companyId || !locationCity || !locationCountry || !locationName) res.status(401).json({message: 'Provide all params required in body'});
        
        const newLocation = await prisma.location.create({
            data: {
                location_city: locationCity,
                location_country: locationCountry,
                location_name: locationName,
                company_id: parseInt(companyId),
            },
        });
        res.status(201).json({message: 'Location created succesfully', newLocation});
    } catch (error) {
        throw error;
    }
};

const createSensor = async (req, res) => {
    try {
        const { locationId, sensorName, sensorCategory } = req.body;
        if (!locationId || !sensorName || !sensorCategory) res.status(401).json({message: 'Provide all params required in body'});
        const sernsorApi = bcrypt.hash(`${sensorName}${sensorCategory}`);
        const newSensor = await prisma.sensor.create({
            data: {
                sensor_category: sensorCategory,
                sensor_api_key: sernsorApi,
                sensor_name: sensorName,
                location_id: locationId,
            },
        });
        res.status(201).json({message: 'Sensor created succesfully', newSensor});
    } catch (error) {
        throw error;
    }
};


module.exports = {
    createCompany,
    createLocation,
    createSensor,
}