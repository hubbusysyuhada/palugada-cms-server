import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Transaction from './Transaction';

@orm.Entity({ tableName: "employees", comment: "equal to \"karyawan\" table" })
export default class Employee {
    @orm.PrimaryKey({type: "uuid"})
    id: string = uuid();

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, index: true })
    name: string;

    @orm.Property({ type: 'varchar', length: 255, index: true })
    idKaryawan: string;

    @orm.Property({ type: 'boolean' })
    is_active: boolean = true;

    @orm.Property({ persist: false })
    total_row: number;

    // @orm.ManyToMany({ pivotTable: 'helped_transactions_mechanic_pivot', entity: () => Transaction })
    // helped_transactions = new orm.Collection<Transaction>(this);

    // @orm.OneToMany(() => Transaction, opposite_table => opposite_table.mechanic)
    // main_mechanic_transactions = new orm.Collection<Transaction>(this);
}