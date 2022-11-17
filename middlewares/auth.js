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

module.exports = {
  isAuth
}
