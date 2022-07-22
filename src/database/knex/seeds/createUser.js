const { hash } = require('bcryptjs');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      name: 'adm',
      email: 'adm@email.com',
      password: await hash('123', 8),
      is_admin: true,
    },
  ]);
};