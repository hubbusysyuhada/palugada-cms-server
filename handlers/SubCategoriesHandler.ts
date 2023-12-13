import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import SubCategory from "../database/entity/SubCategory";
import Category from "../database/entity/Category";
import Item from "../database/entity/Item";

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { category_id?: string; catalog_id?: string; name?: string; limit: number; offset: number; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    
    const condition = []
    if (req.query.category_id) condition.push({ category: { id: { $in: JSON.parse(req.query.category_id) } } })
    if (req.query.catalog_id) condition.push({ category: { catalog: { id: { $in: JSON.parse(req.query.catalog_id) } } } })
    if (req.query.name) condition.push({ name: { $like: `%${req.query.name}%` } })
    
    const q = entityManager.createQueryBuilder(SubCategory, 'subcategory')
      .select(['*', 'count(subcategory.id) over() as total_row'])
      .orderBy({ created_at: "ASC" })
      .where({ $and: condition })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    await entityManager.populate(data, ['category.name', 'category.catalog.name'])
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(SubCategory, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> & { category_id: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const category = await entityManager.findOneOrFail(Category, { id: req.body.category_id })
    delete req.body.category_id
    const data = new SubCategory()
    data.category = category
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "SubCategory created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any> & { category_id: string; },
      Params: { id: number }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(SubCategory, { id })
    const { category_id } = req.body
    if (category_id) {
      const category = await entityManager.findOneOrFail(Category, { id: category_id })
      delete req.body.category_id
      data.category = category
    }
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `SubCategory (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(SubCategory, { id })
    // check items linked with this sub category
    const linkedItems = await entityManager.find(Item, { sub_category: { id } })
    if (linkedItems.length) rep.code(400).send({ message: `Sub Category ${data.name} still in used in Items` })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `SubCategory (id: ${id}) deleted` })
  }
}