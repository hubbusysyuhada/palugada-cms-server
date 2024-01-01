import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Supply from "../database/entity/Supply";
import Supplier from "../database/entity/Supplier";
import Item, { UnitType } from "../database/entity/Item";
import Rack from "../database/entity/Rack";
import SubCategory from "../database/entity/SubCategory";
import _ from "lodash";

type ItemPayload = {
  unique_id: string;
  description: string;
  rack_id: string;
  sub_category_id: number;
  selling_price: number;
  buying_price: number;
  stock: number;
  unit: UnitType;
  name: string;
}

export type OrderType = Record<string, any>

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { supplier_id?: string; keywords?: string; limit: number; offset: number; paid: string; order_by?: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const condition = []
    const sort: OrderType[] = []
    if (req.query.supplier_id) condition.push({ supplier: { id: { $in: JSON.parse(req.query.supplier_id) } } })
    if (req.query.paid) condition.push({ is_paid: { $in: JSON.parse(req.query.paid) } })
    if (req.query.keywords) condition.push({ invoice_number: { $like: `%${req.query.keywords}%` } })
    if (req.query.order_by) {
      const orderBy: [string, "ASC" | "DESC"][] = JSON.parse(req.query.order_by)      
      orderBy.forEach(([key, o]) => sort.push({[key]: o}))
    }
    const q = entityManager.createQueryBuilder(Supply, 'supply')
      .select(['*', 'count(supply.id) over() as total_row'])
      .orderBy([...sort, { created_at: "ASC" }])
      .where({ $and: condition })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    await entityManager.populate(data, ['items', 'supplier'])
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Supply, { id }, { })
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    try {
      await entityManager.begin()
      const supply = new Supply()
      supply.supplier = await entityManager.findOneOrFail(Supplier, { id: req.body.supplier_id })
      supply.invoice_number = req.body.invoice_number
      supply.due_date = new Date(req.body.due_date)
      supply.issued_date = new Date(req.body.issued_date)
      supply.is_paid = req.body.is_paid
      supply.notes = req.body.notes

      let totalPrice = 0
      supply.json_data = []

      for (const i of req.body.items as ItemPayload[]) {
        const item = new Item()
        item.unique_id = i.unique_id
        item.description = i.description
        item.selling_price = i.selling_price
        item.buying_price = i.buying_price
        item.stock = i.stock
        item.rack = await entityManager.findOneOrFail(Rack, { id: i.rack_id })
        item.sub_category = await entityManager.findOneOrFail(SubCategory, { id: i.sub_category_id })
        item.unit = i.unit
        item.name = i.name

        supply.items.add(item)
        totalPrice += item.buying_price * item.stock
        supply.json_data.push({
          id: item.id,
          stock: item.stock,
          unique_id: item.unique_id,
          description: item.description,
          buying_price: item.buying_price,
          selling_price: item.selling_price,
          sub_category_id: item.sub_category.id,
          rack_id: item.rack.id,
          name: item.name
        })
      }
      
      supply.total_price = totalPrice
      entityManager.persist(supply)
      await entityManager.commit()
    } catch (error) {
      console.log("error", error);
      await entityManager.rollback()
      throw new Error(error)
    }
    return rep.code(201).send({ message: "Supply created" })
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any>,
      Params: { id: number }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Supply, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Supply (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Supply, { id })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Supply (id: ${id}) deleted` })
  }
}