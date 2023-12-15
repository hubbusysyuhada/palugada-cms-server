import * as orm from '@mikro-orm/core'
import Rack from './Rack';
import SubCategory from './SubCategory';
import Supply from './Supply';
import TransactionItem from './TransactionItem';

@orm.Entity({ tableName: "items", comment: "equal to \"barang\" table" })
export default class Item {
    @orm.PrimaryKey({ autoincrement: true })
    id: number;

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, index: true })
    unique_id: string;

    @orm.Property({ type: 'integer', index: false })
    buying_price: number = 0;

    @orm.Property({ type: 'integer', index: false })
    selling_price: number = 0;

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    rack!: Rack;

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    sub_category!: SubCategory;

    @orm.Property({ type: 'integer', index: false })
    stock: number = 0;

    @orm.Property({ type: 'varchar', length: 500, index: false })
    description?: string;

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    supply!: Supply;

    @orm.OneToMany(() => TransactionItem, opposite_table => opposite_table.item)
    transactions_items = new orm.Collection<TransactionItem>(this);

    @orm.Property({ persist: false })
    total_row: number;
}