import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Item from "../database/entity/Item";
import { OrderType } from "./SuppliesHandler";

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { supplier_id?: string; sub_category_id?: string; keywords?: string; stock?: string; limit: number; offset: number; order_by?: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const condition = []
    const sort: OrderType[] = []

    if (req.query.supplier_id) condition.push({ supply: { supplier: { id: { $in: JSON.parse(req.query.supplier_id) } } } })
    if (req.query.keywords) condition.push({ $or: [{ unique_id: { $like: `%${req.query.keywords}%` } }, { description: { $like: `%${req.query.keywords}%` } }, { name: { $like: `%${req.query.keywords}%` } }] })
    if (req.query.sub_category_id) condition.push({ sub_category: { id: { $in: JSON.parse(req.query.sub_category_id) } } })
    if (req.query.stock) {
      const [operation, value] = req.query.stock.split('-')
      condition.push({ stock: { [`$${operation}`]: value } })
    }
    if (req.query.order_by) {
      const orderBy: [string, "ASC" | "DESC"][] = JSON.parse(req.query.order_by)
      orderBy.forEach(([key, v]) => {
        const splittedKey = key.split('.').reverse()
        const formSort = (i: number, key: string, value: any) => {
          if (i === 0) return { [key]: v }
          return { [key]: value }
        }
        let latestValue = {}
        splittedKey.forEach((k: string, i: number) => {
          latestValue = formSort(i, k, latestValue)
        })
        sort.push(latestValue)
      })
    }
    
    const q = entityManager.createQueryBuilder(Item, 'item')
      .select(['*', 'count(item.id) over() as total_row'])
      .orderBy([...sort, { created_at: "ASC" }])
      .where({ $and: [...condition] })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    await entityManager.populate(data, ['rack', 'supply', 'supply.supplier', 'sub_category'])
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Item, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const data = new Item()
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "Item created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any>,
      Params: { id: number }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Item, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Item (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Item, { id })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Item (id: ${id}) deleted` })
  }
}