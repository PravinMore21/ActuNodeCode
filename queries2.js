require('dotenv').config({path: __dirname + '/.env'})
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER, //'postgres',
  host: process.env.DB_HOST, //'localhost',
  database: process.env.DB_DATABASE, //'SAMPLE',
  password: process.env.DB_PASS,//'postgres',
  port: process.env.DB_PORT   //5432,
})


const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)
   
  pool.query('SELECT * FROM users WHERE "ID" = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body
  

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.id}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE "ID"= $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE "ID" = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}


const getAllProducts = (request, response) => {
    pool.query('SELECT  *  FROM  "ProductDetail" '
    , (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getAllPlan = (request, response) => {
    pool.query('SELECT  *  FROM  "PlanDetail" '
    , (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getAllMedical = (request, response) => {
    pool.query('SELECT  *  FROM  "MedicalTest" '
    , (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getAllSTPRule = (request, response) => {
    pool.query('SELECT  *  FROM  "STPRule" '
    , (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const   getProductsByCode  = (request, response) => {
    const code = request.params.code//parseInt(request.params.id)
    
    pool.query('Select  *  from "ProductDetail" as Pd , "PlanDetail" as Pl , "MedicalTest" as MT, "STPRule" as RL '+
               ' where Pd."productCode" = $1 and Pd."stpRules" = RL."ruleID" and Pd."medicalTests" = MT."testID" and Pl.code = Pd."planDetails" '
    , [code], (error, results) => {
      if (error) {
        throw error
      }
    // response.status(200).json(results.rows)
      if (results.rowCount > 0 ){
        response.status(200).json(results.rows)
      }else{
        response.status(200).json("No details found For Agent ID ")
      }
    })
  }

  const   getProductsByName  = (request, response) => {
    const id = request.params.name
     
    pool.query('Select  Pd.name , Pd."productCode" , Pd."ProductStatus" from "ProductDetail" as Pd , "PlanDetail" as Pl , "MedicalTest" as MT, "STPRule" as RL '+
    ' where Pd."ProductStatus" = $1 and (Pd."stpRules" = RL."ruleID" or Pd."medicalTests" = MT."testID" or Pl.code = Pd."planDetails") '    
    , [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const   getProductNameStatus  = (request, response) => {
    //const id = request.params.name
     
    pool.query('select   Pd.productname , Pd."productCode" , Pd."ProductStatus"  '+
    ' from "ProductDetail" as Pd , "PlanDetail" as Pl , "MedicalTest" as MT, "STPRule" as RL ' +
    ' where Pd."stpRules" = RL."ruleID" or Pd."medicalTests" = MT."testID" or Pl.code = Pd."planDetails" ', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const   getProductByStatus  = (request, response) => {
    const pStatus = request.params.status
     
    pool.query('Select  Pd."productname" , Pd."productCode" , Pd."ProductStatus" from "ProductDetail" as Pd , "PlanDetail" as Pl , "MedicalTest" as MT, "STPRule" as RL '+
    ' where Pd."ProductStatus" = $1 and Pd."stpRules" = RL."ruleID" and Pd."medicalTests" = MT."testID" and Pl.code = Pd."planDetails" ',
    
    [pStatus], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }



  const updateStatusComment = (request, response) => {
    const code = request.params.code
    console.log(code)
    console.log(request.body)
    console.log("P Status"+request.body)
    const { pdStatus, pdComment } = request.body
    console.log(pdStatus)
    pool.query(
      //'UPDATE users SET name = $1, email = $2 WHERE "ID"= $3',

      ' UPDATE "ProductDetail"  SET  "ProductStatus" = $1, "ProductComment"= $2  WHERE "productCode" = $3 ' ,

      [pdStatus, pdComment, code],
      (error, results) => {
        if (error) {
          response.status(200).send(error)
          //response.status(200).send(`Error while modifing status for : ${code}`)
          //throw error
        }else{
        response.status(200).send(`Successfully updated with code: ${code}`)
        }
      }
    )
  }


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProductNameStatus,
  getAllProducts,
  getAllPlan,
  getAllMedical,
  getAllSTPRule,
  getProductsByCode,
  getProductsByName,
  getProductByStatus,
  updateStatusComment
}