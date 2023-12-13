import * as qs from "qs"
import { FastifyReply, FastifyRequest } from "fastify";
import Employee from "../database/entity/Employee";

export default class {
  static async findAll(req: FastifyRequest<{ Querystring: { name?: string; limit: number; offset: number; is_active: string; } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const condition = []
    
    if (req.query.name) condition.push({ name: { $like: `%${req.query.name}%` } })
    if (req.query.is_active === 'true') condition.push({ is_active: true })
    const q = entityManager.createQueryBuilder(Employee, 'employee')
      .select(['*', 'count(employee.id) over() as total_row'])
      .orderBy({ created_at: "ASC" })
      .where({ $and: condition })
      .limit(req.query.limit)
      .offset(req.query.offset)
    const data = await q.getResult()
    rep.code(200).send({ data })
  }

  static async findById(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    // const {  } = qs.parse(req.query as string) as QueryProps
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOne(Employee, { id }, {})
    rep.code(200).send({ data })
  }

  static async create(req: FastifyRequest<{ Body: Record<string, any> }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const existing = await entityManager.findOne(Employee, { name: req.body.name, is_active: true })
    if (existing) rep.code(400).send({ message: `Employee ${req.body.name} already existed.` })
    else {
      const data = new Employee()
      for (const key in req.body) {
        data[key] = req.body[key]
      }
      await entityManager.persistAndFlush(data)
      rep.code(201).send({ message: "Employee created" })
    }
  }

  static async update(
    req: FastifyRequest<{
      Body: Record<string, any>,
      Params: { id: string }
    }>,
    rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const existing = await entityManager.findOne(Employee, { name: req.body.name, is_active: true, id: { $ne: id } })
    if (existing) rep.code(400).send({ message: `Employee ${req.body.name} already existed.` })
    else {
      const data = await entityManager.findOneOrFail(Employee, { id })
      for (const key in req.body) {
        data[key] = req.body[key]
      }
      await entityManager.persistAndFlush(data)
      rep.code(200).send({ message: `Employee (id: ${id}) updated` })
    }
  }

  static async delete(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const entityManager = await req.orm.getEm()
    const id = req.params.id
    const data = await entityManager.findOneOrFail(Employee, { id })
    await entityManager.remove(data).flush()
    rep.code(200).send({ message: `Employee (id: ${id}) deleted` })
  }
}