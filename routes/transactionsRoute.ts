import { FastifyPluginCallback } from "fastify";
import Handler from "../handlers/TransactionsHandler";
import AllowAuthorized from "../middleware/AllowAuthorized";
import EmployeesHandler from "../handlers/EmployeesHandler";
import ItemsHandler from "../handlers/ItemsHandler";


const transactionsRoute: FastifyPluginCallback = (server, opts, next) => {

  server.get('/', { preHandler: [AllowAuthorized] }, Handler.findAll)
  server.post('/', { preHandler: [AllowAuthorized] }, Handler.create)
  // server.post('/seed', { preHandler: [AllowAuthorized] }, Handler.seed)
  server.get('/insight', { preHandler: [AllowAuthorized] }, Handler.insight)
  server.get('/all-employees', { preHandler: [AllowAuthorized] }, EmployeesHandler.findAll)
  server.get('/all-items', { preHandler: [AllowAuthorized] }, ItemsHandler.findAll)
  server.get('/:id', { preHandler: [AllowAuthorized] }, Handler.findById)
  server.put('/:id', { preHandler: [AllowAuthorized] }, Handler.update)
  server.delete('/:id', { preHandler: [AllowAuthorized] }, Handler.delete)

  next()
}


export default transactionsRoute
