import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Item from './Item';

@orm.Entity({ tableName: "racks", comment: "equal to \"rak\" table" })
@orm.Unique({ properties: ['name', 'storage_number'] })
export default class Rack {
    @orm.PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, index: false })
    name: string;

    @orm.Property({ type: 'varchar', index: false })
    storage_number: string;

    @orm.OneToMany(() => Item, opposite_table => opposite_table.rack)
    items = new orm.Collection<Item>(this);

    @orm.Property({ persist: false })
    total_row: number;
}