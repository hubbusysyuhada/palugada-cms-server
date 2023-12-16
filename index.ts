import fastify from 'fastify'
import "reflect-metadata"
import bcrypt from 'fastify-bcrypt'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import routes from './routes'
import MikroOrmInstance from './database'
import fastifyStatic from '@fastify/static'
import path from 'path'
import env from './helpers/env'

(async () => {
  const server = fastify()

  const orm = await MikroOrmInstance.init()
  
  server.register(bcrypt, { saltWorkFactor: 5 })
  server.register(routes, { prefix: 'api' })
  server.register((server, opts, next) => {
    server.get('/auth', (req, res) => {
      res.redirect('/')
    })
    next()
  })
  server.register(jwt, { secret: "secret" })
  server.decorateRequest('orm', orm)
  server.register(fastifyStatic, {
    root: path.join(__dirname, 'out'),
  })
  server.register(cors, {
    origin: (origin, cb) => {
      // if (!origin || new URL(origin).hostname === 'localhost') cb(null, true) // currently disabled to support temporary live on cloud
    }
  })

  server.listen({ port: +(process.env.PORT) || 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
})()