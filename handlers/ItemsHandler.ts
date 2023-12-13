import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Item from "../database/entity/Item";

export default class {
  static async findAll(req: FastifyRequest, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const data = await entityManager.find(Item, { })
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Item, { id }, { })
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
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
    // const {  } = qs.parse(req.query as string) as QueryProps
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Item, { id })
    for (const key in req.body) {
      data[key] = req.body[key]
    }
    await entityManager.persistAndFlush(data)
    rep.code(200).send({ message: `Item (id: ${id}) updated` })
  }

  static async delete(req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Item, { id })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Item (id: ${id}) deleted` })
  }
}