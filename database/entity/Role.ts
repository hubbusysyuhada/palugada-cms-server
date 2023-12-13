import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import RoutePermission from './RoutePermission';

@orm.Entity({ tableName: "roles", comment: "table to define role each user has" })
export default class Role {
    @orm.PrimaryKey({type: "uuid"})
    id: string = uuid();

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, unique: true, index: true })
    name: string;

    @orm.ManyToMany({ entity: () => RoutePermission, mappedBy: "roles" })
    permissions = new orm.Collection<RoutePermission>(this);
}