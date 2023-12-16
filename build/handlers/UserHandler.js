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
var User_1 = __importDefault(require("../database/entity/User"));
var RoutePermission_1 = __importDefault(require("../database/entity/RoutePermission"));
var Role_1 = __importDefault(require("../database/entity/Role"));
var default_1 = /** @class */ (function () {
    function default_1() {
    }
    default_1.getAll = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, ownerRole, condition, q, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        return [4 /*yield*/, entityManager.findOneOrFail(Role_1.default, { name: "owner" })];
                    case 2:
                        ownerRole = _a.sent();
                        condition = [{ role: { $ne: ownerRole.id } }];
                        if (req.query.username)
                            condition.push({ external_id: { $like: "%".concat(req.query.username, "%") } });
                        if (req.query.role_id)
                            condition.push({ role: { id: { $in: JSON.parse(req.query.role_id) } } });
                        q = entityManager.createQueryBuilder(User_1.default, 'user')
                            .select(['user.id', 'user.external_id', 'user.role', 'count(user.id) over() as total_row'])
                            .orderBy({ created_at: "ASC" })
                            .where({ $and: condition })
                            .limit(req.query.limit)
                            .offset(req.query.offset);
                        return [4 /*yield*/, q.getResult()];
                    case 3:
                        data = _a.sent();
                        return [4 /*yield*/, entityManager.populate(data, ['role'])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, rep.code(200).send(data)];
                }
            });
        });
    };
    default_1.register = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, existingUser, role, user, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _b.sent();
                        return [4 /*yield*/, entityManager.findOne(User_1.default, { external_id: req.body.external_id })];
                    case 2:
                        existingUser = _b.sent();
                        return [4 /*yield*/, entityManager.findOneOrFail(Role_1.default, { id: req.body.role_id })];
                    case 3:
                        role = _b.sent();
                        if (existingUser)
                            return [2 /*return*/, rep.code(400).send({ message: "User already existed!" })];
                        user = new User_1.default();
                        user.external_id = req.body.external_id;
                        _a = user;
                        return [4 /*yield*/, req.bcryptHash(req.body.password)];
                    case 4:
                        _a.password = _b.sent();
                        user.role = role;
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, entityManager.persistAndFlush(user)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, rep.code(201).send({ message: "User created" })];
                    case 7:
                        error_1 = _b.sent();
                        return [2 /*return*/, rep.code(400).send({ error: error_1 })];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    default_1.logIn = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, external_id, user, isPasswordCorrect, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        external_id = req.body.external_id;
                        return [4 /*yield*/, entityManager.findOne(User_1.default, { external_id: external_id }, { populate: ['role'] })];
                    case 2:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 4];
                        return [4 /*yield*/, req.bcryptCompare(req.body.password, user.password)];
                    case 3:
                        isPasswordCorrect = _a.sent();
                        if (isPasswordCorrect) {
                            token = req.server.jwt.sign(user, { expiresIn: '1w' });
                            return [2 /*return*/, rep.code(200).send({ token: token, user: { external_id: external_id, role: user.role.name } })];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, rep.code(400).send({ message: "invalid External Id / Password" })];
                }
            });
        });
    };
    default_1.profile = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, _a, external_id, role;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _b.sent();
                        return [4 /*yield*/, entityManager.findOneOrFail(User_1.default, { id: req.user.id }, { populate: ['role'] })];
                    case 2:
                        _a = _b.sent(), external_id = _a.external_id, role = _a.role;
                        return [2 /*return*/, rep.code(200).send({ external_id: external_id, role: role.name })];
                }
            });
        });
    };
    default_1.features = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, user, features;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _a.sent();
                        user = req.user;
                        return [4 /*yield*/, entityManager.find(RoutePermission_1.default, { roles: { id: user.role.id } }, { fields: ['name'] })];
                    case 2:
                        features = (_a.sent()).map(function (v) { return v.name; });
                        return [2 /*return*/, rep.code(200).send({ features: features })];
                }
            });
        });
    };
    default_1.changePassword = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, external_id, user, isPasswordCorrect, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _b.sent();
                        external_id = req.body.external_id;
                        if (!req.body.newPassword)
                            return [2 /*return*/, rep.code(400).send({ message: "new password must not empty" })];
                        return [4 /*yield*/, entityManager.findOne(User_1.default, { external_id: external_id })];
                    case 2:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 6];
                        return [4 /*yield*/, req.bcryptCompare(req.body.password, user.password)];
                    case 3:
                        isPasswordCorrect = _b.sent();
                        if (!isPasswordCorrect) return [3 /*break*/, 6];
                        _a = user;
                        return [4 /*yield*/, req.bcryptHash(req.body.newPassword)];
                    case 4:
                        _a.password = _b.sent();
                        return [4 /*yield*/, entityManager.persistAndFlush(user)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, rep.code(200).send({ message: "Password changed" })];
                    case 6: return [2 /*return*/, rep.code(400).send({ message: "invalid External Id / Password" })];
                }
            });
        });
    };
    default_1.changeRole = function (req, rep) {
        return __awaiter(this, void 0, void 0, function () {
            var entityManager, user, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, req.orm.getEm()];
                    case 1:
                        entityManager = _b.sent();
                        return [4 /*yield*/, entityManager.findOneOrFail(User_1.default, { id: req.params.id })];
                    case 2:
                        user = _b.sent();
                        _a = user;
                        return [4 /*yield*/, entityManager.findOneOrFail(Role_1.default, { id: req.body.role })];
                    case 3:
                        _a.role = _b.sent();
                        return [4 /*yield*/, entityManager.persistAndFlush(user)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, rep.code(200).send({ message: "Role changed" })];
                }
            });
        });
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=UserHandler.js.map