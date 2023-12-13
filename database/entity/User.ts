import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Role from './Role';

@orm.Entity({ tableName: "user", comment: "table to map user that has access to the system" })
export default class User {
    @orm.PrimaryKey({type: "uuid"})
    id: string = uuid();

    @orm.Property({ type: 'varchar', length: 255, unique: true, index: true })
    external_id: string;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    password: string;

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.ManyToOne({ onDelete: "CASCADE", onUpdateIntegrity: "CASCADE" })
    role!: Role;

    @orm.Property({ persist: false })
    total_row: number;
}