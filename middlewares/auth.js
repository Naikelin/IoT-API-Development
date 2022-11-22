const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const CheckIfAdmin = async (username, password) => {

  let usersCount = await prisma.admin.count(
        {
          where: {
            username: username,
            password: password
          }
        })

  if (usersCount !== 0) {

    return true
  } else {

    return false
  }
}

const isAuth = async (request, response, next) => {

    const auth = request.headers.authorization || ""
    
    let credentials = auth.split(':')
    let username = credentials[0] || undefined
    let password = credentials[1] || undefined

    var isAdmin = false

    if (username && password) {
      isAdmin = await CheckIfAdmin(username, password)
    }
    
    if (isAdmin) {
      
      return next();
    } else {

      response.sendStatus(401);
    }
};

const getCompanyFromApiKey = async (ApiKey) => {
  const companyId = await prisma.company.findFirst({
  where: {
    company_api_key: ApiKey,
  },
})
  if(!companyId) return undefined
  return companyId;
}

const getSensorFromApiKey = async (ApiKey) => {
  const sensorId = await prisma.sensor.findFirst({
    select: {
      sensor_id: true,
      sensor_category: true,
    },
    where: {
      sensor_api_key: ApiKey,
    },
  })
  if(!sensorId) return undefined
  return sensorId;
}

const checkApiKey = async (request, response, next) => {

    request.body.companyId = undefined;

    const companyApiKey = request.headers.authorization || undefined

    if (!companyApiKey) {
      response.status(401).json({message: 'Provide an API Key'});
    }
    const apiKey = await getCompanyFromApiKey(companyApiKey)
    console.log(apiKey)
    if (!apiKey) response.status(401).json({message: 'The company id provided is not valid'});
    let companyId = apiKey.id

    if (!companyId) {
      response.status(401).json({message: 'Provide a valid API Key'});
    }

    request.body.companyId = companyId;
    return next();
};

const checkSensorApiKey = async (request, response, next) => {

  request.body.sensor_api_key = undefined;

  const sensorApiKey = request.headers.authorization || undefined

  if (!sensorApiKey) {
    response.status(401).json({message: 'Provide a Sensor API Key'});
  }
  let sensorId = (await getSensorFromApiKey(sensorApiKey));

  if (!sensorId) {
    response.status(401).json({message: 'Provide a valid Sensor API Key'});
  }

  request.body.sensorId = sensorId.sensor_id;
  request.body.category = sensorId.sensor_category;
  return next();
};

module.exports = {
  isAuth,
  checkApiKey,
  checkSensorApiKey,
}
