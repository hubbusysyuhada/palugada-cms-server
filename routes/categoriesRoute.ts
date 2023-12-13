import { FastifyPluginCallback } from "fastify";
import Handler from "../handlers/CategoriesHandler";
import CatalogHandler from "../handlers/CatalogsHandler";
import AllowAuthorized from "../middleware/AllowAuthorized";


const categoriesRoute: FastifyPluginCallback = (server, opts, next) => {

  server.get('/', { preHandler: [AllowAuthorized] }, Handler.findAll)
  server.get('/all-catalogs', { preHandler: [AllowAuthorized] }, CatalogHandler.findAll)
  server.post('/', { preHandler: [AllowAuthorized] }, Handler.create)
  server.get('/:id', { preHandler: [AllowAuthorized] }, Handler.findById)
  server.put('/:id', { preHandler: [AllowAuthorized] }, Handler.update)
  server.delete('/:id', { preHandler: [AllowAuthorized] }, Handler.delete)

  next()
}


export default categoriesRoute
