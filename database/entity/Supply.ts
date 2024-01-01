import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Supplier from './Supplier';
import Item from './Item';

@orm.Entity({ tableName: "supplies", comment: "equal to \"pasokan\" table" })
export default class Supply {
    @orm.PrimaryKey({ autoincrement: true })
    id: number;

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    supplier!: Supplier;

    @orm.Property({ type: 'integer', index: false })
    total_price: number = 0;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    invoice_number?: string;

    @orm.Property({ type: 'boolean' })
    is_paid: boolean = false;

    @orm.Property({ type: 'timestamp with timezone' })
    issued_date: Date = new Date();

    @orm.Property({ type: 'timestamp with timezone' })
    due_date: Date = new Date(new Date().setDate(new Date().getDate() + 7));

    @orm.Property({ type: 'tinytext' })
    notes?: string;

    @orm.Property({ type: "json" })
    json_data = []

    @orm.OneToMany(() => Item, opposite_table => opposite_table.supply)
    items = new orm.Collection<Item>(this);

    @orm.Property({ persist: false })
    total_row: number;
}