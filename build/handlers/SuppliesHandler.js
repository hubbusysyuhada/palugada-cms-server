"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Supply_1 = __importDefault(require("../database/entity/Supply"));
var Supplier_1 = __importDefault(require("../database/entity/Supplier"));
var Item_1 = __importDefault(require("../database/entity/Item"));
var Rack_1 = __importDefault(require("../database/entity/Rack"));
var SubCategory_1 = __importDefault(require("../database/entity/SubCategory"));
var default_1 = /** @class */ (function () {
    function default_1() {
    }
    default_1.findAll = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, condition, sort, orderBy_1, q, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        condition = [];
                        sort = [];
                        if (req.query.supplier_id)
                            condition.push({ supplier: { id: { $in: JSON.parse(req.query.supplier_id) } } });
                        if (req.query.paid)
                            condition.push({ is_paid: { $in: JSON.parse(req.query.paid) } });
                        if (req.query.keywords)
                            condition.push({ invoice_number: { $like: "%".concat(req.query.keywords, "%") } });
                        if (req.query.order_by) {
                            orderBy_1 = JSON.parse(req.query.order_by);
                            orderBy_1.forEach(function (_a) {
                                var _b;
                                var key = _a[0], o = _a[1];
                                return sort.push((_b = {}, _b[key] = o, _b));
                            });
                        }
                        q = entityManager.createQueryBuilder(Supply_1.default, 'supply')
                            .select(['*', 'count(supply.id) over() as total_row'])
                            .orderBy(__spreadArray(__spreadArray([], sort, true), [{ created_at: "ASC" }], false))
                            .where({ $and: condition })
                            .limit(req.query.limit)
                            .offset(req.query.offset);
                        return [4 /*yield*/, q.getResult()];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, entityManager.populate(data, ['items', 'supplier'])];
                    case 3:
                        _a.sent();
                        rep.code(200).send({ data: data });
                        return [2 /*return*/];
                }
            });
        });
    };
    default_1.findById = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, id, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        id = req.params.id;
                        return [4 /*yield*/, entityManager.findOne(Supply_1.default, { id: id }, {})];
                    case 2:
                        data = _a.sent();
                        rep.code(200).send({ data: data });
                        return [2 /*return*/];
                }
            });
        });
    };
    default_1.create = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, supply, _a, totalPrice, _i, _b, i, item, _c, _d, error_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 11, , 13]);
                        return [4 /*yield*/, entityManager.begin()];
                    case 3:
                        _e.sent();
                        supply = new Supply_1.default();
                        _a = supply;
                        return [4 /*yield*/, entityManager.findOneOrFail(Supplier_1.default, { id: req.body.supplier_id })];
                    case 4:
                        _a.supplier = _e.sent();
                        supply.invoice_number = req.body.invoice_number;
                        supply.due_date = new Date(req.body.due_date);
                        supply.issued_date = new Date(req.body.issued_date);
                        supply.is_paid = req.body.is_paid;
                        totalPrice = 0;
                        supply.json_data = [];
                        _i = 0, _b = req.body.items;
                        _e.label = 5;
                    case 5:
                        if (!(_i < _b.length)) return [3 /*break*/, 9];
                        i = _b[_i];
                        item = new Item_1.default();
                        item.unique_id = i.unique_id;
                        item.description = i.description;
                        item.selling_price = i.selling_price;
                        item.buying_price = i.buying_price;
                        item.stock = i.stock;
                        _c = item;
                        return [4 /*yield*/, entityManager.findOneOrFail(Rack_1.default, { id: i.rack_id })];
                    case 6:
                        _c.rack = _e.sent();
                        _d = item;
                        return [4 /*yield*/, entityManager.findOneOrFail(SubCategory_1.default, { id: i.sub_category_id })];
                    case 7:
                        _d.sub_category = _e.sent();
                        supply.items.add(item);
                        totalPrice += item.buying_price * item.stock;
                        supply.json_data.push({
                            id: item.id,
                            stock: item.stock,
                            unique_id: item.unique_id,
                            description: item.description,
                            buying_price: item.buying_price,
                            selling_price: item.selling_price,
                            sub_category_id: item.sub_category.id,
                            rack_id: item.rack.id
                        });
                        _e.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 5];
                    case 9:
                        supply.total_price = totalPrice;
                        entityManager.persist(supply);
                        return [4 /*yield*/, entityManager.commit()];
                    case 10:
                        _e.sent();
                        return [3 /*break*/, 13];
                    case 11:
                        error_1 = _e.sent();
                        console.log("error", error_1);
                        return [4 /*yield*/, entityManager.rollback()];
                    case 12:
                        _e.sent();
                        throw new Error(error_1);
                    case 13: return [2 /*return*/, rep.code(201).send({ message: "Supply created" })];
                }
            });
        });
    };
    default_1.update = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, id, data, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()
                        // const {  } = qs.parse(req.query as string) as QueryProps
                    ];
                    case 1:
                        entityManager = _a.sent();
                        id = req.params.id;
                        return [4 /*yield*/, entityManager.findOneOrFail(Supply_1.default, { id: id })];
                    case 2:
                        data = _a.sent();
                        for (key in req.body) {
                            data[key] = req.body[key];
                        }
                        return [4 /*yield*/, entityManager.persistAndFlush(data)];
                    case 3:
                        _a.sent();
                        rep.code(200).send({ message: "Supply (id: ".concat(id, ") updated") });
                        return [2 /*return*/];
                }
            });
        });
    };
    default_1.delete = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, id, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        id = req.params.id;
                        return [4 /*yield*/, entityManager.findOneOrFail(Supply_1.default, { id: id })];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, entityManager.remove(data).flush()];
                    case 3:
                        _a.sent();
                        rep.code(200).send({ message: "Supply (id: ".concat(id, ") deleted") });
                        return [2 /*return*/];
                }
            });
        });
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=SuppliesHandler.js.map