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
var Supplier_1 = __importDefault(require("./Supplier"));
var Item_1 = __importDefault(require("./Item"));
var Supply = /** @class */ (function () {
    function Supply() {
        this.created_at = new Date();
        this.total_price = 0;
        this.is_paid = false;
        this.issued_date = new Date();
        this.due_date = new Date(new Date().setDate(new Date().getDate() + 7));
        // @orm.Property({ type: 'integer', index: false })
        // amount: number = 0;
        this.json_data = [];
        this.items = new orm.Collection(this);
    }
    __decorate([
        orm.PrimaryKey({ autoincrement: true }),
        __metadata("design:type", Number)
    ], Supply.prototype, "id", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Supply.prototype, "created_at", void 0);
    __decorate([
        orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" }),
        __metadata("design:type", Supplier_1.default)
    ], Supply.prototype, "supplier", void 0);
    __decorate([
        orm.Property({ type: 'integer', index: false }),
        __metadata("design:type", Number)
    ], Supply.prototype, "total_price", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: false }),
        __metadata("design:type", String)
    ], Supply.prototype, "invoice_number", void 0);
    __decorate([
        orm.Property({ type: 'boolean' }),
        __metadata("design:type", Boolean)
    ], Supply.prototype, "is_paid", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Supply.prototype, "issued_date", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Supply.prototype, "due_date", void 0);
    __decorate([
        orm.Property({ type: "json" }),
        __metadata("design:type", Object)
    ], Supply.prototype, "json_data", void 0);
    __decorate([
        orm.OneToMany(function () { return Item_1.default; }, function (opposite_table) { return opposite_table.supply; }),
        __metadata("design:type", Object)
    ], Supply.prototype, "items", void 0);
    __decorate([
        orm.Property({ persist: false }),
        __metadata("design:type", Number)
    ], Supply.prototype, "total_row", void 0);
    Supply = __decorate([
        orm.Entity({ tableName: "supplies", comment: "equal to \"pasokan\" table" })
    ], Supply);
    return Supply;
}());
exports.default = Supply;
//# sourceMappingURL=Supply.js.map