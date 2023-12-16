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
var TransactionItem_1 = __importDefault(require("./TransactionItem"));
var Transaction = /** @class */ (function () {
    function Transaction() {
        this.created_at = new Date();
        // @orm.ManyToMany({ mappedBy: 'helped_transactions', entity: () => Employee })
        // helpers = new orm.Collection<Employee>(this);
        // @orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" })
        // mechanic!: Employee;
        this.transaction_items = new orm.Collection(this);
        this.total_price = 0;
        this.additional_services = [];
    }
    __decorate([
        orm.PrimaryKey({ autoincrement: true }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "id", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Transaction.prototype, "created_at", void 0);
    __decorate([
        orm.OneToMany(function () { return TransactionItem_1.default; }, function (opposite_table) { return opposite_table.transaction; }),
        __metadata("design:type", Object)
    ], Transaction.prototype, "transaction_items", void 0);
    __decorate([
        orm.Property({ type: 'integer', index: false }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "total_price", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: false }),
        __metadata("design:type", String)
    ], Transaction.prototype, "vehicle_type", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: true }),
        __metadata("design:type", String)
    ], Transaction.prototype, "plate_number", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: true }),
        __metadata("design:type", String)
    ], Transaction.prototype, "customer_name", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: true }),
        __metadata("design:type", String)
    ], Transaction.prototype, "customer_phone", void 0);
    __decorate([
        orm.Property({ type: 'json', nullable: true }),
        __metadata("design:type", Array)
    ], Transaction.prototype, "additional_services", void 0);
    Transaction = __decorate([
        orm.Entity({ tableName: "transactions", comment: "table to record any transactions" })
    ], Transaction);
    return Transaction;
}());
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map