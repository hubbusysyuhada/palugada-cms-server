import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Transaction from "../database/entity/Transaction";

export default class {
  static async findAll(req: FastifyRequest, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const data = await entityManager.find(Transaction, { })
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Transaction, { id }, { })
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const data = new Transaction()
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(201).send({ message: "Transaction created" })
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
    const data = await entityManager.findOneOrFail(Transaction, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Transaction (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Transaction, { id })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Transaction (id: ${id}) deleted` })
  }
}