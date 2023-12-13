import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"

export default async (req: FastifyRequest,rep: FastifyReply, throwErr: HookHandlerDoneFunction) => {
  await req.jwtVerify()
  const role = req.user.role.name

  if (role !== 'owner') {
    const err = new Error("Unauthorized")
    // @ts-ignore
    err.statusCode = 400
    throwErr(err)
  }
    
}