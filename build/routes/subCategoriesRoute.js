"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SubCategoriesHandler_1 = __importDefault(require("../handlers/SubCategoriesHandler"));
var AllowAuthorized_1 = __importDefault(require("../middleware/AllowAuthorized"));
var CatalogsHandler_1 = __importDefault(require("../handlers/CatalogsHandler"));
var CategoriesHandler_1 = __importDefault(require("../handlers/CategoriesHandler"));
var subCategoriesRoute = function (server, opts, next) {
    server.get('/', { preHandler: [AllowAuthorized_1.default] }, SubCategoriesHandler_1.default.findAll);
    server.get('/all-catalogs', { preHandler: [AllowAuthorized_1.default] }, CatalogsHandler_1.default.findAll);
    server.get('/all-categories', { preHandler: [AllowAuthorized_1.default] }, CategoriesHandler_1.default.findAll);
    server.post('/', { preHandler: [AllowAuthorized_1.default] }, SubCategoriesHandler_1.default.create);
    server.get('/:id', { preHandler: [AllowAuthorized_1.default] }, SubCategoriesHandler_1.default.findById);
    server.put('/:id', { preHandler: [AllowAuthorized_1.default] }, SubCategoriesHandler_1.default.update);
    server.delete('/:id', { preHandler: [AllowAuthorized_1.default] }, SubCategoriesHandler_1.default.delete);
    next();
};
exports.default = subCategoriesRoute;
//# sourceMappingURL=subCategoriesRoute.js.map