"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SuppliesHandler_1 = __importDefault(require("../handlers/SuppliesHandler"));
var AllowAuthorized_1 = __importDefault(require("../middleware/AllowAuthorized"));
var SuppliersHandler_1 = __importDefault(require("../handlers/SuppliersHandler"));
var RacksHandler_1 = __importDefault(require("../handlers/RacksHandler"));
var SubCategoriesHandler_1 = __importDefault(require("../handlers/SubCategoriesHandler"));
var suppliesRoute = function (server, opts, next) {
    server.get('/', { preHandler: [AllowAuthorized_1.default] }, SuppliesHandler_1.default.findAll);
    server.get('/all-suppliers', { preHandler: [AllowAuthorized_1.default] }, SuppliersHandler_1.default.findAll);
    server.get('/all-racks', { preHandler: [AllowAuthorized_1.default] }, RacksHandler_1.default.findAll);
    server.get('/all-sub-categories', { preHandler: [AllowAuthorized_1.default] }, SubCategoriesHandler_1.default.findAll);
    server.post('/', { preHandler: [AllowAuthorized_1.default] }, SuppliesHandler_1.default.create);
    server.get('/:id', { preHandler: [AllowAuthorized_1.default] }, SuppliesHandler_1.default.findById);
    server.put('/:id', { preHandler: [AllowAuthorized_1.default] }, SuppliesHandler_1.default.update);
    server.delete('/:id', { preHandler: [AllowAuthorized_1.default] }, SuppliesHandler_1.default.delete);
    next();
};
exports.default = suppliesRoute;
//# sourceMappingURL=suppliesRoute.js.map