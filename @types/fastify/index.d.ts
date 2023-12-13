import OrmInstance from "../../database";
import Role from "../../database/entity/Role";

type UserJWT = {
  id: string;
  external_id: string;
  created_at: Date;
  role: Role
}

declare module 'fastify' {
  interface FastifyRequest {
    orm: OrmInstance
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: UserJWT
    user: UserJWT
  }
}