import * as orm from '@mikro-orm/core'
import Item from './Item';
import Transaction from './Transaction';

@orm.Entity({ tableName: "transaction_items", comment: "table to map items needed for each transaction" })
export default class TransactionItem {
    @orm.PrimaryKey({ autoincrement: true })
    id: number;

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    transaction!: Transaction;

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    item!: Item;

    @orm.Property({ type: 'integer', index: false })
    amount: number = 0;

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();
}