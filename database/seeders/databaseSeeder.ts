import { EntityManager } from "@mikro-orm/mysql";
import { v4 as uuid } from 'uuid'
import { readFileSync, readdirSync } from "fs";
import _ from "lodash";
import Role from "../entity/Role";
import RoutePermission from "../entity/RoutePermission";

export default async function (em: EntityManager) {
  const seedersSequence = [
    seedRoles,
    seedRoutePermissions,
    seedUser,
    seedRolePermissions
  ]

  for (const f of seedersSequence) await f(em)

  console.log("seeder ran");
}

const seedRoles = async (em: EntityManager) => {
  await seedNormalData(em, 'roles')
}

const seedRoutePermissions = async (em: EntityManager) => {
  await seedNormalData(em, 'route_permissions')
}

const seedUser = async (em: EntityManager) => {
  const tableName = "user"
  const ownerRole = await em.findOneOrFail(Role, { name: "owner" })
  const data = getJsonData(tableName)
  data[0].role_id = ownerRole.id
  const query = generateRawQuery({ data, tableName, em })
  return await em.execute(query)
}

const seedRolePermissions = async (em: EntityManager) => {
  const ownerRole = await em.findOneOrFail(Role, { name: "owner" })
  const permissions = await em.find(RoutePermission, {})
  permissions.forEach(p => ownerRole.permissions.add(p))
  await em.flush()
}

const getJsonData = (entityName: string) => {
  const data: Record<string, any>[] = JSON.parse(readFileSync(`./database/seeders/${entityName}.json`, { encoding: "utf-8" }))
  data.forEach(d => {
    d.created_at = new Date()
    d.id = uuid()
  })
  return data
}

const generateRawQuery = (payload: { em: EntityManager; tableName: string; data: Record<string, any>; }) => {
  const { data, em, tableName } = payload
  const query = em.createQueryBuilder(tableName).insert(data).getFormattedQuery().split('insert into ')
  query[0] = 'insert ignore into '
  return query.join('')
}

const seedNormalData = async (em: EntityManager, tableName: string) => {
  const data = getJsonData(tableName)
  const query = generateRawQuery({ data, tableName, em })
  return await em.execute(query)
}