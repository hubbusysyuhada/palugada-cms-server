import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Catalog from './Catalog';
import SubCategory from './SubCategory';

@orm.Entity({ tableName: "categories", comment: "equal to \"jenis2\" table" })
export default class Category {
    @orm.PrimaryKey({type: "uuid"})
    id: string = uuid();

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, index: true })
    name: string;

    @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
    catalog!: Catalog;

    @orm.Property({ persist: false })
    total_row: number;

    @orm.OneToMany(() => SubCategory, opposite_table => opposite_table.category)
    sub_categories = new orm.Collection<SubCategory>(this);
}