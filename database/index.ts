import env from "../helpers/env";
import { Configuration, Connection, IDatabaseDriver, MikroORM, Options, UnderscoreNamingStrategy } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MySqlDriver } from "@mikro-orm/mysql";
import databaseSeeder from "./seeders/databaseSeeder";

export default class MikroOrmInstance {
  constructor(
    private orm: MikroORM<MySqlDriver>
  ) { }

  static async init() {
    let options: Record<string, any> = {
      entities: ['./database/entity'],
      type: env.DB_TYPE as "mongo" | "mysql" | "mariadb" | "postgresql" | "sqlite" | "better-sqlite",
      metadataProvider: TsMorphMetadataProvider,
      namingStrategy: UnderscoreNamingStrategy,
      pool: { max: 10, min: 2 },
      forceUtcTimezone: true,
      driverOptions: { connection: { ssl: { rejectUnauthorized: false } } },
      migrations: { disableForeignKeys: false }
    }

    if (env.DB_URL) options.clientUrl = env.DB_URL
    else {
      options = {
        ...options, dbName: env.DB_NAME,
        user: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        host: env.DB_HOST,
      }
    }

    const orm = await MikroORM.init<MySqlDriver>(options)

    const generator = orm.getSchemaGenerator()
    await generator.updateSchema()

    if (process.argv.includes("seed:true")) await databaseSeeder(orm.em.fork())
    return new MikroOrmInstance(orm)
  }

  private async getOrm() {
    return this.orm
  }

  public async getEm() {
    return this.orm.em.fork()
  }

  public async open() {
    await this.orm.connect()
  }

  public async close() {
    await this.orm.close()
  }
}