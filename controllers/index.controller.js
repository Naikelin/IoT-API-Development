const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const ValidateInput = (username, password) => {
  if (username && password) {
    if (typeof username !== "string") {
      return false
    } else if (typeof username !== "string") {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

const CheckIfUserExists = async (username) => {

  let usersCount = await prisma.admin.count(
        {
          where: {
            username: username
          }
        })

  if (usersCount !== 0) {

    return true
  } else {

    return false
  }
}

const CreateUser = async (username, password) => {

  let createData = {username: username, password: password}
  let adminCreate = await prisma.admin.create( {data: createData })
  
  return adminCreate

}

const CreateAdmin = async (request, response) => {
  
  var username = request.body.username || undefined
  var password = request.body.password || undefined

  var validationInput = ValidateInput(username, password)

  // Check if data is correctly
  if ( validationInput ) {
    
    // Check if user exists
    let validationUserExists = await CheckIfUserExists(username)
    if ( !validationUserExists ) {
      // Not exists another user
      let createUser = await CreateUser(username, password)
      response.status(200).json({response: "User created"})

    } else {
      // Exists another user
      response.status(404).json({response: "User already exists"})
    }

  } else {
    
    console.log("Validation False")
    response.status(400).json({response: "Bad request"})
  }

}

module.exports = {
  CreateAdmin,
}
