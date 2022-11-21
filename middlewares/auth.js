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
  if(companyId.lenght === 0) return undefined
  return companyId;
}

const checkApiKey = async (request, response, next) => {

    request.body.companyId = undefined;

    const companyApiKey = request.headers.authorization || undefined

    if (!companyApiKey) {
      response.status(401).json({message: 'Provide an API Key'});
    }

    let companyId = (await getCompanyFromApiKey(companyApiKey)).id;

    if (!companyId) {
      response.status(401).json({message: 'Provide a valid API Key'});
    }

    request.body.companyId = companyId;
    return next();
};

module.exports = {
  isAuth,
  checkApiKey
}
