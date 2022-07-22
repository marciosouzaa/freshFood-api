const {hash} = require("bcryptjs")
const AppError = require('../utils/AppError')
const knex = require("../database/knex")


class UsersController {
  async create(req, res){
    const {name, email, password} = req.body

    
    const checkUserExists = await knex('users').where({ email }).first();

    if (checkUserExists) {
      throw new AppError("Este e-mail já esta em uso.")
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({ name, email, password: hashedPassword });

    return res.status(201).json()
  }

  
}

module.exports = UsersController