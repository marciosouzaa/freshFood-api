const knex = require("../database/knex")
const DiskStorage = require('../providers/DiskStorage')

class DishesController{
  async create(req, res){
    const {avatar, title, description, price, ingredients} = req.body
    const {filename: avatarFilename} = req.file

    const diskStorage = new DiskStorage();
    const filename = await diskStorage.saveFile(avatarFilename);

    const dish_id = await knex("dishes").insert({
      avatar: filename,
      title,
      description,
      price,
    })

    const ingredientsInsert = ingredients.map(avatar2 => {
      return {
        dish_id,
        avatar2,
      }
    })
    await knex("ingredients").insert(ingredientsInsert)

    return res.json()
  }

  async index(req, res){
    const {title, ingredients} = req.query

    let dishes

    if(ingredients){
      const filterIngredients = ingredients.split(', ').map(ingredient => ingredient.trim())

      dishes = await knex('ingredients').select(['dishes.id', 'dishes.title', 'dishes.description','dishes.price', 'dishes.avatar']).whereLike('dishes.title', `%${title}%`).whereIn('avatar2', filterIngredients).innerJoin('dishes', 'dishes.id', 'ingredients.dish_id').groupBy('dishes.id').orderBy('dishes.title')

    } else{
      dishes = await knex('dishes').whereLike('title', `%${title}%`).orderBy('title')
    }

    const listIngredients = await knex('ingredients')

    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients = listIngredients.filter(ingredient => ingredient.dish_id === dish.id)

      return{
        ...dish,
        ingredients: dishIngredients
      }
    })

    return res.json(dishesWithIngredients)
  }

  async show(req, res){
    const {id} = req.params

    const dish = await knex('dishes').where({id}).first()
    const ingredient = await knex('ingredients').where({dish_id: id}).orderBy('avatar2')


    return res.json({
      ...dish,
      ingredient
    })
  }

  async delete(req, res){
    const {id} = req.params

    await knex('dishes').where({id}).delete()
    
    return res.json()
  }

  async update(req, res) {
    const { title, description, ingredients, price } = req.body;
    const { id } = req.params;
    const { filename: avatarFilename } = req.file;

    const diskStorage = new DiskStorage();

    const dish = await knex('dishes').where({ id }).first();

    if (dish.avatar) {
      await diskStorage.deleteFile(dish.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);

    dish.avatar = filename;
    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;

    const ingredientsInsert = ingredients.map(avatar2 => ({
      avatar2,
      dish_id: dish.id,
    }));

    await knex('dishes').where({ id }).update(dish);
    await knex('ingredients').where({ dish_id: id }).delete();
    await knex('ingredients').insert(ingredientsInsert);

    return res.json();
  }
}

module.exports = DishesController