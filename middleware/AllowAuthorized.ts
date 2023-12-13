import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"
import RoutePermission from "../database/entity/RoutePermission";

export default async (req: FastifyRequest, rep: FastifyReply, throwErr: HookHandlerDoneFunction) => {
  await req.jwtVerify()
  const path = req.routerPath.split('/')[2]
  const em = await req.orm.getEm()
  
  const permission = await em.findOne(RoutePermission, { name: path, roles: { id: req.user.role.id } })
  if (!permission) {
    const err = new Error("Unauthorized")
    // @ts-ignore
    err.statusCode = 400
    throwErr(err)
  }

}