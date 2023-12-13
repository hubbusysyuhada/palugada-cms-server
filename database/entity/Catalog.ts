import * as orm from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'
import Category from './Category';

@orm.Entity({ tableName: "catalogs", comment: "equal to \"jenis1 table\"" })
export default class Catalog {
    @orm.PrimaryKey({type: "uuid"})
    id: string = uuid();

    @orm.Property({ type: 'timestamp with timezone' })
    created_at: Date = new Date();

    @orm.Property({ type: 'varchar', length: 255, index: true, unique: true })
    name: string;

    @orm.Property({ persist: false })
    total_row: number;

    @orm.OneToMany(() => Category, opposite_table => opposite_table.catalog)
    categories = new orm.Collection<Category>(this);
}