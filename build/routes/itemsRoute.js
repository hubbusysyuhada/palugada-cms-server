"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ItemsHandler_1 = __importDefault(require("../handlers/ItemsHandler"));
var AllowAuthorized_1 = __importDefault(require("../middleware/AllowAuthorized"));
var SubCategoriesHandler_1 = __importDefault(require("../handlers/SubCategoriesHandler"));
var SuppliersHandler_1 = __importDefault(require("../handlers/SuppliersHandler"));
var itemsRoute = function (server, opts, next) {
    server.get('/', { preHandler: [AllowAuthorized_1.default] }, ItemsHandler_1.default.findAll);
    server.get('/all-suppliers', { preHandler: [AllowAuthorized_1.default] }, SuppliersHandler_1.default.findAll);
    server.get('/all-sub-categories', { preHandler: [AllowAuthorized_1.default] }, SubCategoriesHandler_1.default.findAll);
    server.post('/', { preHandler: [AllowAuthorized_1.default] }, ItemsHandler_1.default.create);
    server.get('/:id', { preHandler: [AllowAuthorized_1.default] }, ItemsHandler_1.default.findById);
    server.put('/:id', { preHandler: [AllowAuthorized_1.default] }, ItemsHandler_1.default.update);
    next();
};
exports.default = itemsRoute;
//# sourceMappingURL=itemsRoute.js.map