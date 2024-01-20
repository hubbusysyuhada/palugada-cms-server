import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Employee from './Employee';
import Item from './Item';
import TransactionItem from './TransactionItem';

export enum TransactionType {
    IN = 'IN',
    OUT = 'OUT'
}

@orm.Entity({ tableName: "transactions", comment: "table to record any transactions" })
export default class Transaction {
    @orm.PrimaryKey({autoincrement: true})
    id: number;

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.ManyToMany({ mappedBy: 'helped_transactions', entity: () => Employee })
    mechanics = new orm.Collection<Employee>(this);

    @orm.Property({ type: 'varchar', length: 255, index: true, comment: 'example 1708220201 -- DD/MM/YY/01 if type is in or 02 if type is out/2 digit of order number on that day' })
    invoice: string;

    @orm.OneToMany(() => TransactionItem, opposite_table => opposite_table.transaction)
    transaction_items = new orm.Collection<TransactionItem>(this);

    @orm.Property({ type: 'integer', index: false })
    total_price: number = 0;

    @orm.Property({ type: 'varchar', length: 255, index: false })
    vehicle_type?: string;

    @orm.Property({ type: 'varchar', length: 255, index: true })
    plate_number?: string;

    @orm.Property({ type: 'varchar', length: 255, index: true })
    machine_number?: string;

    @orm.Property({ type: 'varchar', length: 255, index: true })
    customer_name?: string;

    @orm.Property({ type: 'varchar', length: 255, index: true })
    customer_phone?: string;

    @orm.Enum(() => TransactionType)
    type: TransactionType = TransactionType.IN

    @orm.Property({ type: 'tinytext' })
    notes?: string;

    @orm.Property({ type: 'integer', index: false })
    discount: number = 0;

    @orm.Property({ type: 'json', nullable: true })
    additional_services: Record<string, any>[] = []

    @orm.Property({ persist: false })
    total_row: number;
}