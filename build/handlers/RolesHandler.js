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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Role_1 = __importDefault(require("../database/entity/Role"));
var RoutePermission_1 = __importDefault(require("../database/entity/RoutePermission"));
var User_1 = __importDefault(require("../database/entity/User"));
var default_1 = /** @class */ (function () {
    function default_1() {
    }
    default_1.findAll = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        return [4 /*yield*/, entityManager.find(Role_1.default, {}, {
                                populate: ["permissions"], fields: ['id', 'name', 'permissions.id', 'permissions.name'], orderBy: {
                                    created_at: "ASC"
                                }
                            })];
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
            var entityManager, data, _i, _a, id, permission;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _b.sent();
                        data = new Role_1.default();
                        data.name = req.body.name;
                        _i = 0, _a = req.body.permissionsId || [];
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        id = _a[_i];
                        return [4 /*yield*/, entityManager.findOneOrFail(RoutePermission_1.default, { id: id })];
                    case 3:
                        permission = _b.sent();
                        data.permissions.add(permission);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, entityManager.persistAndFlush(data)];
                    case 6:
                        _b.sent();
                        rep.code(201).send({ message: "Role created" });
                        return [2 /*return*/];
                }
            });
        });
    };
    default_1.update = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, id, permissions, data, _i, _a, id_1, permission;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _b.sent();
                        id = req.params.id;
                        return [4 /*yield*/, entityManager.find(RoutePermission_1.default, { roles: { id: id } }, { populate: ["roles"] })];
                    case 2:
                        permissions = _b.sent();
                        return [4 /*yield*/, entityManager.findOneOrFail(Role_1.default, { id: id }, { populate: ["permissions"] })];
                    case 3:
                        data = _b.sent();
                        data.name = req.body.name;
                        permissions.forEach(function (p) { return p.roles.remove(data); });
                        _i = 0, _a = req.body.permissionsId;
                        _b.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        id_1 = _a[_i];
                        return [4 /*yield*/, entityManager.findOneOrFail(RoutePermission_1.default, { id: id_1 })];
                    case 5:
                        permission = _b.sent();
                        data.permissions.add(permission);
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        entityManager.persist(data);
                        entityManager.persist(permissions);
                        return [4 /*yield*/, entityManager.flush()];
                    case 8:
                        _b.sent();
                        rep.code(200).send({ message: "Role (id: ".concat(id, ") updated") });
                        return [2 /*return*/];
                }
            });
        });
    };
    default_1.delete = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, id, isUsed, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        id = req.params.id;
                        return [4 /*yield*/, entityManager.findOne(User_1.default, { role: { id: id } })];
                    case 2:
                        isUsed = _a.sent();
                        if (!isUsed) return [3 /*break*/, 3];
                        rep.code(400).send({ message: "Role still in used in user" });
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, entityManager.findOneOrFail(Role_1.default, { id: id })];
                    case 4:
                        data = _a.sent();
                        return [4 /*yield*/, entityManager.remove(data).flush()];
                    case 5:
                        _a.sent();
                        rep.code(200).send({ message: "Role (id: ".concat(id, ") deleted") });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=RolesHandler.js.map