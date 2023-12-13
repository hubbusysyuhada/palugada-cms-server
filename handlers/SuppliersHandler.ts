import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Supplier from "../database/entity/Supplier";
import Supply from "../database/entity/Supply";

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { keywords: string; limit: number; offset: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const condition = []
    if (req.query.keywords) {
      condition.push(
        { name: { $like: `%${req.query.keywords}%` } },
        { contact_info: { $like: `%${req.query.keywords}%` } },
        { contact_person: { $like: `%${req.query.keywords}%` } },
        { account_name: { $like: `%${req.query.keywords}%` } },
        { account_number: { $like: `%${req.query.keywords}%` } },
        { bank_name: { $like: `%${req.query.keywords}%` } },
      )
    }

    const q = entityManager.createQueryBuilder(Supplier, 'supplier')
      .select(['*', 'count(supplier.id) over() as total_row'])
      .orderBy({ created_at: "ASC" })
      .where({ $or: condition })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Supplier, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const data = new Supplier()
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "Supplier created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any>,
      Params: { id: number }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    // const {  } = qs.parse(req.query as string) as QueryProps
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Supplier, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Supplier (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Supplier, { id })
    const linkedSupplies = await entityManager.find(Supply, { supplier: { id } })
    if (linkedSupplies.length) rep.code(400).send({ message: `Supplier ${data.name} still in used in Supplies` })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Supplier (id: ${id}) deleted` })
  }
}