import { FastifyReply, FastifyRequest } from "fastify";
import RoutePermission from "../database/entity/RoutePermission";
import Role from "../database/entity/Role";

export default class {
  static async findAll(req: FastifyRequest, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const data = await entityManager.find(RoutePermission, {}, { fields: ['id', 'name'] })
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: { name: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const data = new RoutePermission()
    data.name = req.body.name
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "RoutePermission created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: { name: string },
      Params: { id: string }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(RoutePermission, { id })
    data.name = req.body.name
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `RoutePermission (id: ${id}) updated` })
  }


  static async delete(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const isUsed = await entityManager.findOne(Role, { permissions: { id } })
    if (isUsed) rep.code(400).send({ message: "Route permission still in used in Role" })
    else {
      const data = await entityManager.findOneOrFail(RoutePermission, { id })
      await entityManager.remove(data).flush()
      rep.code(200).send({ message: `RoutePermission (id: ${id}) deleted` })
    }
  }
}