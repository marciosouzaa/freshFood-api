const knex = require('../database/knex');
const AppError = require('../utils/AppError');

async function ensureIsAdmin(req, res, next) {
  const { id } = req.user;

  const user = await knex('users').where({ id });

  const isAdmin = user[0].is_admin;

  if (isAdmin === 0) {
    throw new AppError('Você não é o Admin.', 401);
  }

  return next();
}

module.exports = ensureIsAdmin;
