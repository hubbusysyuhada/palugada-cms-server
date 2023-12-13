import { FastifyReply, FastifyRequest } from "fastify";
import Role from "../database/entity/Role";
import RoutePermission from "../database/entity/RoutePermission";
import User from "../database/entity/User";

export default class {
  static async findAll(req: FastifyRequest, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const data = await entityManager.find(Role, {}, {
      populate: ["permissions"], fields: ['id', 'name', 'permissions.id', 'permissions.name'], orderBy: {
        created_at: "ASC"
      }
    })
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: { name: string; permissionsId: string[] } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const data = new Role()
    data.name = req.body.name
    for (const id of req.body.permissionsId || []) {
      const permission = await entityManager.findOneOrFail(RoutePermission, { id })
      data.permissions.add(permission)
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "Role created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: { name: string; permissionsId: string[] },
      Params: { id: string }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const permissions = await entityManager.find(RoutePermission, { roles: { id } }, { populate: ["roles"] })
    const data = await entityManager.findOneOrFail(Role, { id }, { populate: ["permissions"] })
    data.name = req.body.name
    permissions.forEach(p => p.roles.remove(data))
    for (const id of req.body.permissionsId) {
      const permission = await entityManager.findOneOrFail(RoutePermission, { id })
      data.permissions.add(permission)
    }
    entityManager.persist(data)
    entityManager.persist(permissions)
    await entityManager.flush()
    rep.code(200).send({ message: `Role (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const isUsed = await entityManager.findOne(User, { role: { id } })
    if (isUsed) rep.code(400).send({ message: "Role still in used in user" })
    else {
      const data = await entityManager.findOneOrFail(Role, { id })
      await entityManager.remove(data).flush()
      rep.code(200).send({ message: `Role (id: ${id}) deleted` })
    }
  }
}