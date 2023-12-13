import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Catalog from "../database/entity/Catalog";
import Category from "../database/entity/Category";

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { name?: string; limit: number; offset: number; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const condition = []
    if (req.query.name) condition.push({ name: { $like: `%${req.query.name}%` } })
    const q = entityManager.createQueryBuilder(Catalog, 'catalog')
      .select(['*', 'count(catalog.id) over() as total_row'])
      .orderBy({ created_at: "ASC" })
      .where({ $and: condition })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Catalog, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const data = new Catalog()
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "Catalog created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any>,
      Params: { id: string }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Catalog, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Catalog (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Catalog, { id })
    const linkedCategories = await entityManager.find(Category, { catalog: { id } })
    if (linkedCategories.length) rep.code(400).send({ message: `Catalog ${data.name} still in used in Category` })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Catalog (id: ${id}) deleted` })
  }
}