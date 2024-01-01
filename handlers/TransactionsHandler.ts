import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Transaction, { TransactionType } from "../database/entity/Transaction";
import Employee from "../database/entity/Employee";
import Item from "../database/entity/Item";
import TransactionItem from "../database/entity/TransactionItem";
import { OrderType } from "./SuppliesHandler";
import parseNumber from "../helpers/parseNumber";

type CreateTransactionPayloadType = {
  vehicle_type: string;
  plate_number: string;
  customer_name: string;
  customer_phone: string;
  notes: string;
  type: TransactionType;
  services: { name: string; price: number }[];
  items: { id: number; amount: number }[];
  mechanicIds: string[];
}
export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { keywords?: string; start_date?: string; type?: string; end_date?: string; limit: number; offset: number; order_by?: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()

    const condition = []
    const sort: OrderType[] = []
    if (req.query.start_date) condition.push({ created_at: { $gte: new Date(req.query.start_date) } })
    if (req.query.end_date) condition.push({ created_at: { $lte: new Date(req.query.end_date) } })
    if (req.query.type) condition.push({ type:{ $in: JSON.parse(req.query.type) } })
    if (req.query.keywords) condition.push({
      $or: [
        { invoice: { $like: `%${req.query.keywords}%` } },
        { notes: { $like: `%${req.query.keywords}%` } },
        { customer_phone: { $like: `%${req.query.keywords}%` } },
        { customer_name: { $like: `%${req.query.keywords}%` } },
        { vehicle_type: { $like: `%${req.query.keywords}%` } },
        { plate_number: { $like: `%${req.query.keywords}%` } }
      ]
    })
    if (req.query.order_by) {
      const orderBy: [string, "ASC" | "DESC"][] = JSON.parse(req.query.order_by)
      orderBy.forEach(([key, o]) => sort.push({ [key]: o }))
    }

    const q = entityManager.createQueryBuilder(Transaction, 'transaction')
      .select(['*'])
      .orderBy([...sort, { created_at: "ASC" }])
      .leftJoinAndSelect('mechanics', 'mechanics')
      .leftJoinAndSelect('transaction_items', 'transaction_items')
      .leftJoinAndSelect('transaction_items.item', 'item')
      .where({ $and: [...condition] })
      .limit(req.query.limit)
      .offset(req.query.offset)

    const totalRow = await q.getCount()
    const data = await q.getResult()
    data.forEach(d => d.total_row = totalRow)
    
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Transaction, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: CreateTransactionPayloadType }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    try {
      await entityManager.begin()
      const transaction = new Transaction()
      const now = new Date()
      const dateCode = `${parseNumber(now.getDate())}${parseNumber(now.getMonth() + 1)}${String(now.getFullYear())[2]}${String(now.getFullYear())[3]}`
      const typeCode = req.body.type === 'IN' ? '01' : '02'
      const [_, todaysTransactionCount] = await entityManager.findAndCount(Transaction, { invoice: { $like: `${dateCode}%` } })
      const transactionCode = parseNumber(todaysTransactionCount + 1)
      const services: Record<string, any>[] = []
      transaction.total_price = 0
      transaction.customer_name = req.body.customer_name
      transaction.customer_phone = req.body.customer_phone
      transaction.notes = req.body.notes
      transaction.plate_number = req.body.plate_number
      transaction.vehicle_type = req.body.vehicle_type
      transaction.created_at = now
      transaction.invoice = dateCode + typeCode + transactionCode
      transaction.type = req.body.type

      req.body.services.forEach((s: { name: string; price: number; }) => {
        services.push(s)
        transaction.total_price += s.price
      })
      transaction.additional_services = services

      for (const id of req.body.mechanicIds) {
        const employee = await entityManager.findOneOrFail(Employee, { id })
        transaction.mechanics.add(employee)
      }

      for (const item of req.body.items) {
        const { id, amount } = item
        const itemFound = await entityManager.findOneOrFail(Item, { id })
        const transactionItem = new TransactionItem()
        transactionItem.transaction = transaction
        transactionItem.item = itemFound
        transactionItem.amount = amount
        itemFound.stock -= amount
        transaction.total_price += amount * itemFound.selling_price
        entityManager.persist(transactionItem)
        entityManager.persist(itemFound)
      }
      entityManager.persist(transaction)
      await entityManager.commit()
      rep.code(201).send({ message: "Transaction created" })
    } catch (error) {
      console.log("error", error);
      await entityManager.rollback()
      throw new Error(error)
    }
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any>,
      Params: { id: number }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Transaction, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Transaction (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Transaction, { id })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Transaction (id: ${id}) deleted` })
  }
}