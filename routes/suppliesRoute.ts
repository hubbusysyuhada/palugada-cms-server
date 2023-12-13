import { FastifyPluginCallback } from "fastify";
import Handler from "../handlers/SuppliesHandler";
import AllowAuthorized from "../middleware/AllowAuthorized";
import SuppliersHandler from "../handlers/SuppliersHandler";
import RacksHandler from "../handlers/RacksHandler";
import SubCategoriesHandler from "../handlers/SubCategoriesHandler";


const suppliesRoute: FastifyPluginCallback = (server, opts, next) => {

  server.get('/', { preHandler: [AllowAuthorized] }, Handler.findAll)
  server.get('/all-suppliers', { preHandler: [AllowAuthorized] }, SuppliersHandler.findAll)
  server.get('/all-racks', { preHandler: [AllowAuthorized] }, RacksHandler.findAll)
  server.get('/all-sub-categories', { preHandler: [AllowAuthorized] }, SubCategoriesHandler.findAll)
  server.post('/', { preHandler: [AllowAuthorized] }, Handler.create)
  server.get('/:id', { preHandler: [AllowAuthorized] }, Handler.findById)
  server.put('/:id', { preHandler: [AllowAuthorized] }, Handler.update)
  server.delete('/:id', { preHandler: [AllowAuthorized] }, Handler.delete)

  next()
}


export default suppliesRoute
