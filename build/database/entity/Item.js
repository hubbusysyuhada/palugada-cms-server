"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var orm = __importStar(require("@mikro-orm/core"));
var Rack_1 = __importDefault(require("./Rack"));
var SubCategory_1 = __importDefault(require("./SubCategory"));
var Supply_1 = __importDefault(require("./Supply"));
var TransactionItem_1 = __importDefault(require("./TransactionItem"));
var Item = /** @class */ (function () {
    function Item() {
        this.created_at = new Date();
        this.buying_price = 0;
        this.selling_price = 0;
        this.stock = 0;
        this.transactions_items = new orm.Collection(this);
    }
    __decorate([
        orm.PrimaryKey({ autoincrement: true }),
        __metadata("design:type", Number)
    ], Item.prototype, "id", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Item.prototype, "created_at", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: true }),
        __metadata("design:type", String)
    ], Item.prototype, "unique_id", void 0);
    __decorate([
        orm.Property({ type: 'integer', index: false }),
        __metadata("design:type", Number)
    ], Item.prototype, "buying_price", void 0);
    __decorate([
        orm.Property({ type: 'integer', index: false }),
        __metadata("design:type", Number)
    ], Item.prototype, "selling_price", void 0);
    __decorate([
        orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" }),
        __metadata("design:type", Rack_1.default)
    ], Item.prototype, "rack", void 0);
    __decorate([
        orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" }),
        __metadata("design:type", SubCategory_1.default)
    ], Item.prototype, "sub_category", void 0);
    __decorate([
        orm.Property({ type: 'integer', index: false }),
        __metadata("design:type", Number)
    ], Item.prototype, "stock", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 500, index: false }),
        __metadata("design:type", String)
    ], Item.prototype, "description", void 0);
    __decorate([
        orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" }),
        __metadata("design:type", Supply_1.default)
    ], Item.prototype, "supply", void 0);
    __decorate([
        orm.OneToMany(function () { return TransactionItem_1.default; }, function (opposite_table) { return opposite_table.item; }),
        __metadata("design:type", Object)
    ], Item.prototype, "transactions_items", void 0);
    __decorate([
        orm.Property({ persist: false }),
        __metadata("design:type", Number)
    ], Item.prototype, "total_row", void 0);
    Item = __decorate([
        orm.Entity({ tableName: "items", comment: "equal to \"barang\" table" })
    ], Item);
    return Item;
}());
exports.default = Item;
//# sourceMappingURL=Item.js.map