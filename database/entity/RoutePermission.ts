import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Role from './Role';

@orm.Entity({ tableName: "route_permissions", comment: "table to map which role has access to which routes. add new row to this table if you develop new feature/route that needs RBAC" })
export default class RoutePermission {
    @orm.PrimaryKey({type: "uuid"})
    id: string = uuid();

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, unique: true, index: true })
    name: string;

    @orm.ManyToMany({ pivotTable: 'roles_permissions_pivot', entity: () => Role })
    roles = new orm.Collection<Role>(this);
}