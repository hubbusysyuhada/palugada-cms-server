import { FastifyPluginCallback } from "fastify";
import Handler from "../handlers/SubCategoriesHandler";
import AllowAuthorized from "../middleware/AllowAuthorized";
import CatalogsHandler from "../handlers/CatalogsHandler";
import CategoriesHandler from "../handlers/CategoriesHandler";


const subCategoriesRoute: FastifyPluginCallback = (server, opts, next) => {

  server.get('/', { preHandler: [AllowAuthorized] }, Handler.findAll)
  server.get('/all-catalogs', { preHandler: [AllowAuthorized] }, CatalogsHandler.findAll)
  server.get('/all-categories', { preHandler: [AllowAuthorized] }, CategoriesHandler.findAll)
  server.post('/', { preHandler: [AllowAuthorized] }, Handler.create)
  server.get('/:id', { preHandler: [AllowAuthorized] }, Handler.findById)
  server.put('/:id', { preHandler: [AllowAuthorized] }, Handler.update)
  server.delete('/:id', { preHandler: [AllowAuthorized] }, Handler.delete)

  next()
}


export default subCategoriesRoute
