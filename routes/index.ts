import { FastifyPluginCallback } from "fastify";
import userRoute from "./userRoute";
import rolesRoute from "./rolesRoute";
import routePermissionsRoute from "./routePermissionsRoute";
import employeesRoute from "./employeesRoute";
import catalogsRoute from "./catalogsRoute";
import categoriesRoute from "./categoriesRoute";
import subCategoriesRoute from "./subCategoriesRoute";
import racksRoute from "./racksRoute";
import suppliersRoute from "./suppliersRoute";
import suppliesRoute from "./suppliesRoute";
import itemsRoute from "./itemsRoute";
import transactionsRoute from "./transactionsRoute";


const baseRoute: FastifyPluginCallback = (server, opts, next) => {
  server.get('/ping', async (req, res) => {
    res.send("pong")
  })

  server.register(userRoute)
  server.register(rolesRoute, {prefix: 'roles'})
  server.register(routePermissionsRoute, {prefix: 'route_permissions'})
  server.register(employeesRoute, {prefix: 'employees'})
  server.register(catalogsRoute, {prefix: 'catalogs'})
  server.register(categoriesRoute, {prefix: 'categories'})
  server.register(subCategoriesRoute, {prefix: 'sub_categories'})
  server.register(racksRoute, {prefix: 'racks'})
  server.register(suppliersRoute, {prefix: 'suppliers'})
  server.register(suppliesRoute, {prefix: 'supplies'})
  server.register(itemsRoute, {prefix: 'items'})
  server.register(transactionsRoute, {prefix: 'transactions'})

  next()
}


export default baseRoute