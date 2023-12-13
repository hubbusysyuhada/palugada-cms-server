import { FastifyReply, FastifyRequest } from "fastify";
import Category from "../database/entity/Category";
import Catalog from "../database/entity/Catalog";
import SubCategory from "../database/entity/SubCategory";

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { catalog_id?: string; name?: string; limit: number; offset: number; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const condition = []
    if (req.query.catalog_id) condition.push({ catalog: { id: { $in: JSON.parse(req.query.catalog_id) } } })
    if (req.query.name) condition.push({ name: { $like: `%${req.query.name}%` } })
    const q = entityManager.createQueryBuilder(Category, 'category')
      .select(['*', 'count(category.id) over() as total_row'])
      .orderBy({ created_at: "ASC" })
      .where({ $and: condition })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    await entityManager.populate(data, ['catalog.name'])
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Category, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> & { catalog_id: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const catalog = await entityManager.findOneOrFail(Catalog, { id: req.body.catalog_id })
    delete req.body.catalog_id
    const data = new Category()
    data.catalog = catalog
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "Category created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any> & { catalog_id: string; },
      Params: { id: string }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Category, { id })
    const { catalog_id } = req.body
    if (catalog_id) {
      const catalog = await entityManager.findOneOrFail(Catalog, { id: catalog_id })
      delete req.body.catalog_id
      data.catalog = catalog
    }
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Category (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Category, { id })
    const linkedSubCategories = await entityManager.find(SubCategory, { category: { id } })
    if (linkedSubCategories.length) rep.code(400).send({ message: `Category ${data.name} still in used in Sub Category` })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Category (id: ${id}) deleted` })
  }
}