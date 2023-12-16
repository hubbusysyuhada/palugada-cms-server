import { FastifyPluginCallback } from "fastify";
import UserHandler from "../handlers/UserHandler";
import AuthHandler from "../middleware/AuthHandler";
import AllowOwnerOnly from "../middleware/AllowOwner";


const userRoute: FastifyPluginCallback = (server, opts, next) => {
  console.log("into user route");
  server.get('/users', {preHandler: [AllowOwnerOnly]}, UserHandler.getAll)
  server.post('/register', {preHandler: [AllowOwnerOnly]}, UserHandler.register)
  server.post('/change-role/:id', {preHandler: [AllowOwnerOnly]}, UserHandler.changeRole)
  server.post('/login', UserHandler.logIn)
  server.get('/profile', { preHandler: [AuthHandler] }, UserHandler.profile)
  server.get('/features', { preHandler: [AuthHandler] }, UserHandler.features)
  server.post('/change-password', { preHandler: [AuthHandler] }, UserHandler.changePassword)

  next()
}


export default userRoute