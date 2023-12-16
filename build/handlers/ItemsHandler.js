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
var Item_1 = __importDefault(require("../database/entity/Item"));
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
                            condition.push({ supply: { supplier: { id: { $in: JSON.parse(req.query.supplier_id) } } } });
                        if (req.query.keywords)
                            condition.push({ $or: [{ unique_id: { $like: "%".concat(req.query.keywords, "%") } }, { description: { $like: "%".concat(req.query.keywords, "%") } }] });
                        if (req.query.sub_category_id)
                            condition.push({ sub_category: { id: { $in: JSON.parse(req.query.sub_category_id) } } });
                        if (req.query.order_by) {
                            orderBy_1 = JSON.parse(req.query.order_by);
                            orderBy_1.forEach(function (_a) {
                                var key = _a[0], v = _a[1];
                                var splittedKey = key.split('.').reverse();
                                var formSort = function (i, key, value) {
                                    var _a, _b;
                                    if (i === 0)
                                        return _a = {}, _a[key] = v, _a;
                                    return _b = {}, _b[key] = value, _b;
                                };
                                var latestValue = {};
                                splittedKey.forEach(function (k, i) {
                                    latestValue = formSort(i, k, latestValue);
                                });
                                sort.push(latestValue);
                            });
                        }
                        q = entityManager.createQueryBuilder(Item_1.default, 'item')
                            .select(['*', 'count(item.id) over() as total_row'])
                            .orderBy(__spreadArray(__spreadArray([], sort, true), [{ created_at: "ASC" }], false))
                            .where({ $and: __spreadArray([], condition, true) })
                            .limit(req.query.limit)
                            .offset(req.query.offset);
                        return [4 /*yield*/, q.getResult()];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, entityManager.populate(data, ['rack', 'supply', 'supply.supplier', 'sub_category'])];
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
                        return [4 /*yield*/, entityManager.findOne(Item_1.default, { id: id }, {})];
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
            var entityManager, data, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        data = new Item_1.default();
                        for (key in req.body) {
                            data[key] = req.body[key];
                        }
                        return [4 /*yield*/, entityManager.persistAndFlush(data)];
                    case 2:
                        _a.sent();
                        rep.code(201).send({ message: "Item created" });
                        return [2 /*return*/];
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
                        return [4 /*yield*/, entityManager.findOneOrFail(Item_1.default, { id: id })];
                    case 2:
                        data = _a.sent();
                        for (key in req.body) {
                            data[key] = req.body[key];
                        }
                        return [4 /*yield*/, entityManager.persistAndFlush(data)];
                    case 3:
                        _a.sent();
                        rep.code(200).send({ message: "Item (id: ".concat(id, ") updated") });
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
                        return [4 /*yield*/, entityManager.findOneOrFail(Item_1.default, { id: id })];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, entityManager.remove(data).flush()];
                    case 3:
                        _a.sent();
                        rep.code(200).send({ message: "Item (id: ".concat(id, ") deleted") });
                        return [2 /*return*/];
                }
            });
        });
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=ItemsHandler.js.map