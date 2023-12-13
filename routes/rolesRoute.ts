import { FastifyPluginCallback } from "fastify";
import Handler from "../handlers/RolesHandler";
import AllowAuthorized from "../middleware/AllowAuthorized";
import AllowOwner from "../middleware/AllowOwner";


const rolesRoute: FastifyPluginCallback = (server, opts, next) => {

  server.get('/', { preHandler: [AllowAuthorized] }, Handler.findAll)
  server.post('/', { preHandler: [AllowOwner] }, Handler.create)
  server.put('/:id', { preHandler: [AllowOwner] }, Handler.update)
  server.delete('/:id', { preHandler: [AllowOwner] }, Handler.delete)

  next()
}


export default rolesRoute
