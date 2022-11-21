const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()


 /* FUNCTIONS */
const generateAPIKey = (Password) => {
  var api_key = bcrypt.hashSync(Password , 10);
  return api_key;
}

const checkIfCompanyExists = async (Name) => {
    const company = await prisma.company.count({
        where: {
            company_name: Name,
        }
    })
    if (company > 0) return true;
    else return false;
}

const getCompanyFromApiKey = async (ApiKey) => {
  const companyId = await prisma.company.findFirst({
  where: {
    company_api_key: ApiKey,
  },
})
  return companyId;
}

/* CONTROLLERS */

/* Crea una compañia y genera una API Key para el mismo */
const CreateCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) res.status(404).json({message: 'Provide a company name'});
        let company_api = generateAPIKey(companyName)
        const companyExists = await checkIfCompanyExists(companyName);
        if (companyExists) res.status(404).json({message: 'Company already exists'});
        else {
            const newCompany = await prisma.company.create({
            data: {
                company_name: companyName,
                company_api_key: company_api,
            }
            })
            res.status(200).json({message: 'Company created succesfully', newCompany});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

const GetCompanies = async (req, res) => {
    try {
        const companies = await prisma.company.findMany()
        res.status(200).json({companies})
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

const DeleteCompany = async (req, res) => {
    try {
        const { companyId } = req.body;
        if (!companyId) res.status(404).json({message: 'Provide a company id'});
        const company = await prisma.company.delete({
            where: {
                id: companyId,
            }
        })
        res.status(200).json({message: 'Company deleted succesfully', company});
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

module.exports = {
    CreateCompany,
    GetCompanies,
    DeleteCompany
}
