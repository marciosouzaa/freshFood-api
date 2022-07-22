const {Router} = require('express')
const multer = require('multer')
const uploadConfig = require('../configs/upload')
const DishesController = require('../controllers/DishesController')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const ensureIsAdmin = require('../middlewares/ensureIsAdmin')



const dishesRoutes = Router()
dishesRoutes.use(ensureAuthenticated)

const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()


dishesRoutes.post('/',ensureIsAdmin, upload.single('avatar'), dishesController.create);
dishesRoutes.get('/', dishesController.index);
dishesRoutes.get('/:id', dishesController.show);
dishesRoutes.delete('/:id',ensureIsAdmin, dishesController.delete);
dishesRoutes.put('/:id', ensureIsAdmin, upload.single('avatar'), dishesController.update)


module.exports = dishesRoutes