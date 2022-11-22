const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

/* FUNCTIONS */
const CheckIfSensorExists = async (SensorName, LocationId) => {
    let sensorCount = await prisma.sensor.count(
        {
          where: {
            location_id: LocationId,
            sensor_name: SensorName,
          }
        })
    if (sensorCount === 0) {
        return false
    } else {
        return true
    }
}

const CheckLocalizationBelogsToCompany = async (locationId, companyId) => {
    let locationCount = await prisma.location.count(
        {
          where: {
            location_id: locationId,
            company_id: companyId,
          }
        })
    if (locationCount === 0) {
        return false
    } else {
        return true
    }
}

/* CRUD */ 
/* Obtiene todos los sensores */
const GetAllSensor = async (req, res, next) => {
    const { LocationId } = req.body;
    try {
        let allSensors = await prisma.sensor.findMany({
            where: {
                location_id: LocationId,
            }
        })
        res.status(200).json(allSensors);
    } catch (error) {
        throw error;
    }
}

const generateAPIKey = (Password) => {
    var api_key = bcrypt.hashSync(Password , 10);
    return api_key;
  }

/* Obtiene un sensor de una localización filtrando por Nombre */
const GetSensorByName = async (req, res, next) => {
    const { locationId, sensorName } = req.query;

    if (!locationId || !sensorName ) res.status(401).json({message: 'Provide all params required in query'});

    try {
        const sensor = await prisma.sensor.findFirst({
            where: {
                location_id: locationId,
                sensor_name: locationName,
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

const CreateSensor = async (req, res, next) => {
    try {
        const { locationId, sensorName, sensorCategory, sensorMeta } = req.body;
        if (!locationId || !sensorName || !sensorCategory || !sensorMeta) res.status(401).json({message: 'Provide all params required in body'});
        let sensorExists = await CheckIfSensorExists(sensorName, locationId);
        if (!sensorExists) {
            let ApiKey = generateAPIKey(sensorName+locationId+sensorCategory+sensorMeta);
            const newSensor = await prisma.sensor.create({
                data: {
                    location_id: locationId,
                    sensor_name: sensorName,
                    sensor_category: sensorCategory,
                    sensor_meta: sensorMeta,
                    sensor_api_key: ApiKey,
                },
            });
            res.status(201).json({message: 'Sensor created succesfully', newSensor});
        } else {
            res.status(403).json({message: 'Sensor already exists'});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

const insertSensorState = async (req, res, next) => {
    try {
        const { sensorId, category, json_data } = req.body;
        if (!sensorId || !category || !json_data) res.status(401).json({message: 'Provide all params required in body'});
        if (category === 'luz_t') {
           json_data.map(async (item) => {
                await prisma.sensor_data.create({
                    data: {
                        sensor_id: sensorId,                        
                        sensor_luz: item.luz,
                        sensor_temperatura: item.temperatura,
                        sensor_created_date: parseInt(new Date().getTime()),
                    },
                });
            });
            res.status(201).json({message: `${json_data.length} Sensor state submited succesfully`});
        } else if (category === 'hum_ph') {
            json_data.map(async (item) => {
                await prisma.sensor_data.create({
                    data: {
                        sensor_id: sensorId,                        
                        sensor_humedad: item.humedad,
                        sensor_ph: item.ph,
                        sensor_created_date: parseInt(new Date().getTime()),
                    },
                });
            });
            res.status(201).json({message: `${json_data.length} Sensor state submited succesfully`});
        } else {
            res.status(403).json({message: 'Category not found'});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

const getSensorData = async (req, res, next) => {
    try {
        const { from, to, sensor_id } = req.query;
        if (!from || !to || !sensor_id) res.status(401).json({message: 'Provide all params required in query'});
        const sensorIds = JSON.parse(sensor_id);
        console.log(sensorIds[0]);
        const sensorData = await prisma.sensor_data.findMany({
            select: {
                sensor_id: true,
                sensor_temperatura: true,
                sensor_luz: true,
                sensor_humedad: true,
                sensor_ph: true,                
            },
            where: {
                sensor_id: {
                    in: sensorIds,
                },
                sensor_created_date: {
                    gte: parseInt(from),
                    lte: parseInt(to),
                }
            },
            orderBy: { 
                sensor_created_date: 'asc',
            },
        });
        res.status(200).json(sensorData);
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};
        


module.exports = {
    GetAllSensor,
    GetSensorByName,
    CreateSensor,
    insertSensorState,
    getSensorData,
}