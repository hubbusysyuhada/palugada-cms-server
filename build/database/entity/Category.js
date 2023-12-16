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
var uuid_1 = require("uuid");
var Catalog_1 = __importDefault(require("./Catalog"));
var SubCategory_1 = __importDefault(require("./SubCategory"));
var Category = /** @class */ (function () {
    function Category() {
        this.id = (0, uuid_1.v4)();
        this.created_at = new Date();
        this.sub_categories = new orm.Collection(this);
    }
    __decorate([
        orm.PrimaryKey({ type: "uuid" }),
        __metadata("design:type", String)
    ], Category.prototype, "id", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Category.prototype, "created_at", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: true }),
        __metadata("design:type", String)
    ], Category.prototype, "name", void 0);
    __decorate([
        orm.ManyToOne({ onDelete: "NO ACTION", onUpdateIntegrity: "NO ACTION" }),
        __metadata("design:type", Catalog_1.default)
    ], Category.prototype, "catalog", void 0);
    __decorate([
        orm.Property({ persist: false }),
        __metadata("design:type", Number)
    ], Category.prototype, "total_row", void 0);
    __decorate([
        orm.OneToMany(function () { return SubCategory_1.default; }, function (opposite_table) { return opposite_table.category; }),
        __metadata("design:type", Object)
    ], Category.prototype, "sub_categories", void 0);
    Category = __decorate([
        orm.Entity({ tableName: "categories", comment: "equal to \"jenis2\" table" })
    ], Category);
    return Category;
}());
exports.default = Category;
//# sourceMappingURL=Category.js.map