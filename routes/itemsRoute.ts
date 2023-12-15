import { FastifyPluginCallback } from "fastify";
import Handler from "../handlers/ItemsHandler";
import AllowAuthorized from "../middleware/AllowAuthorized";
import SubCategoriesHandler from "../handlers/SubCategoriesHandler";
import SuppliersHandler from "../handlers/SuppliersHandler";


const itemsRoute: FastifyPluginCallback = (server, opts, next) => {

  server.get('/', { preHandler: [AllowAuthorized] }, Handler.findAll)
  server.get('/all-suppliers', { preHandler: [AllowAuthorized] }, SuppliersHandler.findAll)
  server.get('/all-sub-categories', { preHandler: [AllowAuthorized] }, SubCategoriesHandler.findAll)
  server.post('/', { preHandler: [AllowAuthorized] }, Handler.create)
  server.get('/:id', { preHandler: [AllowAuthorized] }, Handler.findById)
  server.put('/:id', { preHandler: [AllowAuthorized] }, Handler.update)

  next()
}


export default itemsRoute
