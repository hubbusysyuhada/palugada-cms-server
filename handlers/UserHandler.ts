import { FastifyReply, FastifyRequest } from "fastify";
import User from "../database/entity/User";
import { UserJWT } from "../@types/fastify";
import RoutePermission from "../database/entity/RoutePermission";
import Role from "../database/entity/Role";

export default class {
  static async getAll(req: FastifyRequest<{ Querystring: { username?: string; role_id?: string; limit: number; offset: number; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const ownerRole = await entityManager.findOneOrFail(Role, { name: "owner" })
    const condition: {}[] = [{ role: { $ne: ownerRole.id  } }]
    if (req.query.username) condition.push({ external_id: { $like: `%${req.query.username}%` } })
    if (req.query.role_id) condition.push({ role: { id: { $in: JSON.parse(req.query.role_id) } } })
    const q = entityManager.createQueryBuilder(User, 'user')
      .select(['user.id', 'user.external_id', 'user.role', 'count(user.id) over() as total_row'])
      .orderBy({ created_at: "ASC" })
      .where({ $and: condition })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    await entityManager.populate(data, ['role'])
    return rep.code(200).send(data)
  }
  static async register(req: FastifyRequest<{ Body: { external_id: string; password: string, role_id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const existingUser = await entityManager.findOne(User, { external_id: req.body.external_id })
    const role = await entityManager.findOneOrFail(Role, { id: req.body.role_id })
    if (existingUser) return rep.code(400).send({ message: "User already existed!" })
    const user = new User()
    user.external_id = req.body.external_id
    user.password = await req.bcryptHash(req.body.password)
    user.role = role
    try {
      await entityManager.persistAndFlush(user)
      return rep.code(201).send({ message: "User created" })
    } catch (error) {
      return rep.code(400).send({ error })
    }
  }

  static async logIn(req: FastifyRequest<{ Body: { external_id: string; password: string } }>, rep: FastifyReply) {
    console.log("login");
    const entityManager = await req.orm.getEm()
    const external_id = req.body.external_id
    console.log("searching user");
    const user = await entityManager.findOne(User, { external_id }, { populate: ['role'] })
    if (user) {
      console.log("user found");
      const isPasswordCorrect = await req.bcryptCompare(req.body.password, user.password)
      if (isPasswordCorrect) {
        const token = req.server.jwt.sign(user as UserJWT, { expiresIn: '1w' })
        return rep.code(200).send({ token, user: { external_id, role: user.role.name } })
      }
    }
    console.log("user check failed");
    return rep.code(400).send({ message: "invalid External Id / Password" })
  }

  static async profile(req: FastifyRequest, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const { external_id, role } = await entityManager.findOneOrFail(User, { id: req.user.id }, { populate: ['role'] })
    return rep.code(200).send({ external_id, role: role.name })
  }

  static async features(req: FastifyRequest, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const user = req.user
    const features = (await entityManager.find(RoutePermission, { roles: { id: user.role.id } }, { fields: ['name'] })).map(v => v.name)
    return rep.code(200).send({ features })
  }

  static async changePassword(req: FastifyRequest<{ Body: { external_id: string; password: string; newPassword: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const external_id = req.body.external_id
    if (!req.body.newPassword) return rep.code(400).send({ message: "new password must not empty" })
    const user = await entityManager.findOne(User, { external_id })
    if (user) {
      const isPasswordCorrect = await req.bcryptCompare(req.body.password, user.password)
      if (isPasswordCorrect) {
        user.password = await req.bcryptHash(req.body.newPassword)
        await entityManager.persistAndFlush(user)
        return rep.code(200).send({ message: "Password changed" })
      }
    }
    return rep.code(400).send({ message: "invalid External Id / Password" })
  }

  static async changeRole(req: FastifyRequest<{ Body: { role: string; }; Params: { id: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const user = await entityManager.findOneOrFail(User, { id: req.params.id })
    user.role = await entityManager.findOneOrFail(Role, { id: req.body.role })
    await entityManager.persistAndFlush(user)
    return rep.code(200).send({ message: "Role changed" })
  }

}