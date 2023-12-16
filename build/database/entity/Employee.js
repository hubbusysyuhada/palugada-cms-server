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
Object.defineProperty(exports, "__esModule", { value: true });
var orm = __importStar(require("@mikro-orm/core"));
var uuid_1 = require("uuid");
var Employee = /** @class */ (function () {
    function Employee() {
        this.id = (0, uuid_1.v4)();
        this.created_at = new Date();
        this.is_active = true;
        // @orm.ManyToMany({ pivotTable: 'helped_transactions_mechanic_pivot', entity: () => Transaction })
        // helped_transactions = new orm.Collection<Transaction>(this);
        // @orm.OneToMany(() => Transaction, opposite_table => opposite_table.mechanic)
        // main_mechanic_transactions = new orm.Collection<Transaction>(this);
    }
    __decorate([
        orm.PrimaryKey({ type: "uuid" }),
        __metadata("design:type", String)
    ], Employee.prototype, "id", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Employee.prototype, "created_at", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: true }),
        __metadata("design:type", String)
    ], Employee.prototype, "name", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: true }),
        __metadata("design:type", String)
    ], Employee.prototype, "idKaryawan", void 0);
    __decorate([
        orm.Property({ type: 'boolean' }),
        __metadata("design:type", Boolean)
    ], Employee.prototype, "is_active", void 0);
    __decorate([
        orm.Property({ persist: false }),
        __metadata("design:type", Number)
    ], Employee.prototype, "total_row", void 0);
    Employee = __decorate([
        orm.Entity({ tableName: "employees", comment: "equal to \"karyawan\" table" })
    ], Employee);
    return Employee;
}());
exports.default = Employee;
//# sourceMappingURL=Employee.js.map