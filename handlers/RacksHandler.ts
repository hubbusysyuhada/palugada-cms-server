import { FastifyReply, FastifyRequest } from "fastify";
import Rack from "../database/entity/Rack";
import Item from "../database/entity/Item";

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { keywords: string; limit: number; offset: number; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const { keywords, limit, offset } = req.query
    const condition = []
    if (keywords) condition.push({ name: { $like: `%${keywords}%` } }, { storage_number: keywords })
    const q = entityManager.createQueryBuilder(Rack, 'rack')
      .select(['*', 'count(rack.id) over() as total_row'])
      .orderBy({ created_at: "ASC" })
      .where({ $or: condition })
      .limit(limit)
      .offset(offset)
    const data = await q.getResult()
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Rack, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const data = new Rack()
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "Rack created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any>,
      Params: { id: string }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Rack, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Rack (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Rack, { id })
    const linkedItems = await entityManager.find(Item, { rack: { id } })
    if (linkedItems.length) rep.code(400).send({ message: `Rack ${data.name} still in used in Items` })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Rack (id: ${id}) deleted` })
  }
}