import { FastifyPluginCallback } from "fastify";
import Handler from "../handlers/SuppliersHandler";
import AllowAuthorized from "../middleware/AllowAuthorized";


const suppliersRoute: FastifyPluginCallback = (server, opts, next) => {

  server.get('/', { preHandler: [AllowAuthorized] }, Handler.findAll)
  server.post('/', { preHandler: [AllowAuthorized] }, Handler.create)
  server.get('/:id', { preHandler: [AllowAuthorized] }, Handler.findById)
  server.put('/:id', { preHandler: [AllowAuthorized] }, Handler.update)
  server.delete('/:id', { preHandler: [AllowAuthorized] }, Handler.delete)

  next()
}


export default suppliersRoute
