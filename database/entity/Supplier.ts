import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Supply from './Supply';

@orm.Entity({ tableName: "suppliers", comment: "equal to \"supplier\" table" })
export default class Supplier {
    @orm.PrimaryKey({ autoincrement: true })
    id: number;

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, index: true })
    name: string;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    account_number?: string;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    bank_name?: string;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    account_name?: string;

    @orm.Property({ type: 'tinytext' })
    address?: string;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    contact_info?: string;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    contact_person?: string;

    @orm.OneToMany(() => Supply, opposite_table => opposite_table.supplier)
    supplies = new orm.Collection<Supply>(this);

    @orm.Property({ type: 'tinytext' })
    notes?: string;

    @orm.Property({ persist: false })
    total_row: number;
}