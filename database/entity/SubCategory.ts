import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Category from './Category';
import Item from './Item';

@orm.Entity({ tableName: "sub_categories", comment: "equal to \"jenis3\" table" })
export default class SubCategory {
    @orm.PrimaryKey({autoincrement: true})
    id: number;

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, index: true })
    name: string;

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    category!: Category;

    @orm.OneToMany(() => Item, opposite_table => opposite_table.sub_category)
    items = new orm.Collection<Item>(this);

    @orm.Property({ persist: false })
    total_row: number;
}