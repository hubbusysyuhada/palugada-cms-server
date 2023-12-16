"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SuppliersHandler_1 = __importDefault(require("../handlers/SuppliersHandler"));
var AllowAuthorized_1 = __importDefault(require("../middleware/AllowAuthorized"));
var suppliersRoute = function (server, opts, next) {
    server.get('/', { preHandler: [AllowAuthorized_1.default] }, SuppliersHandler_1.default.findAll);
    server.post('/', { preHandler: [AllowAuthorized_1.default] }, SuppliersHandler_1.default.create);
    server.get('/:id', { preHandler: [AllowAuthorized_1.default] }, SuppliersHandler_1.default.findById);
    server.put('/:id', { preHandler: [AllowAuthorized_1.default] }, SuppliersHandler_1.default.update);
    server.delete('/:id', { preHandler: [AllowAuthorized_1.default] }, SuppliersHandler_1.default.delete);
    next();
};
exports.default = suppliersRoute;
//# sourceMappingURL=suppliersRoute.js.map