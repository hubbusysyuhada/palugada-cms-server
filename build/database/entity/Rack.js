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
var Item_1 = __importDefault(require("./Item"));
var Rack = /** @class */ (function () {
    function Rack() {
        this.id = (0, uuid_1.v4)();
        this.created_at = new Date();
        this.items = new orm.Collection(this);
    }
    __decorate([
        orm.PrimaryKey({ type: "uuid" }),
        __metadata("design:type", String)
    ], Rack.prototype, "id", void 0);
    __decorate([
        orm.Property({ type: 'timestamp with timezone' }),
        __metadata("design:type", Date)
    ], Rack.prototype, "created_at", void 0);
    __decorate([
        orm.Property({ type: 'varchar', length: 255, index: false }),
        __metadata("design:type", String)
    ], Rack.prototype, "name", void 0);
    __decorate([
        orm.Property({ type: 'integer', index: false }),
        __metadata("design:type", Number)
    ], Rack.prototype, "storage_number", void 0);
    __decorate([
        orm.OneToMany(function () { return Item_1.default; }, function (opposite_table) { return opposite_table.rack; }),
        __metadata("design:type", Object)
    ], Rack.prototype, "items", void 0);
    __decorate([
        orm.Property({ persist: false }),
        __metadata("design:type", Number)
    ], Rack.prototype, "total_row", void 0);
    Rack = __decorate([
        orm.Entity({ tableName: "racks", comment: "equal to \"rak\" table" }),
        orm.Unique({ properties: ['name', 'storage_number'] })
    ], Rack);
    return Rack;
}());
exports.default = Rack;
//# sourceMappingURL=Rack.js.map