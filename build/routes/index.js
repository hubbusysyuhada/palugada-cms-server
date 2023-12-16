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
var userRoute_1 = __importDefault(require("./userRoute"));
var rolesRoute_1 = __importDefault(require("./rolesRoute"));
var routePermissionsRoute_1 = __importDefault(require("./routePermissionsRoute"));
var employeesRoute_1 = __importDefault(require("./employeesRoute"));
var catalogsRoute_1 = __importDefault(require("./catalogsRoute"));
var categoriesRoute_1 = __importDefault(require("./categoriesRoute"));
var subCategoriesRoute_1 = __importDefault(require("./subCategoriesRoute"));
var racksRoute_1 = __importDefault(require("./racksRoute"));
var suppliersRoute_1 = __importDefault(require("./suppliersRoute"));
var suppliesRoute_1 = __importDefault(require("./suppliesRoute"));
var itemsRoute_1 = __importDefault(require("./itemsRoute"));
var transactionsRoute_1 = __importDefault(require("./transactionsRoute"));
var baseRoute = function (server, opts, next) {
    server.get('/ping', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.send("pong");
            return [2 /*return*/];
        });
    }); });
    server.register(userRoute_1.default);
    server.register(rolesRoute_1.default, { prefix: 'roles' });
    server.register(routePermissionsRoute_1.default, { prefix: 'route_permissions' });
    server.register(employeesRoute_1.default, { prefix: 'employees' });
    server.register(catalogsRoute_1.default, { prefix: 'catalogs' });
    server.register(categoriesRoute_1.default, { prefix: 'categories' });
    server.register(subCategoriesRoute_1.default, { prefix: 'sub_categories' });
    server.register(racksRoute_1.default, { prefix: 'racks' });
    server.register(suppliersRoute_1.default, { prefix: 'suppliers' });
    server.register(suppliesRoute_1.default, { prefix: 'supplies' });
    server.register(itemsRoute_1.default, { prefix: 'items' });
    server.register(transactionsRoute_1.default, { prefix: 'transactions' });
    next();
};
exports.default = baseRoute;
//# sourceMappingURL=index.js.map