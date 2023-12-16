"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RolesHandler_1 = __importDefault(require("../handlers/RolesHandler"));
var AllowAuthorized_1 = __importDefault(require("../middleware/AllowAuthorized"));
var AllowOwner_1 = __importDefault(require("../middleware/AllowOwner"));
var rolesRoute = function (server, opts, next) {
    server.get('/', { preHandler: [AllowAuthorized_1.default] }, RolesHandler_1.default.findAll);
    server.post('/', { preHandler: [AllowOwner_1.default] }, RolesHandler_1.default.create);
    server.put('/:id', { preHandler: [AllowOwner_1.default] }, RolesHandler_1.default.update);
    server.delete('/:id', { preHandler: [AllowOwner_1.default] }, RolesHandler_1.default.delete);
    next();
};
exports.default = rolesRoute;
//# sourceMappingURL=rolesRoute.js.map