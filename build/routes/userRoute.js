"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserHandler_1 = __importDefault(require("../handlers/UserHandler"));
var AuthHandler_1 = __importDefault(require("../middleware/AuthHandler"));
var AllowOwner_1 = __importDefault(require("../middleware/AllowOwner"));
var userRoute = function (server, opts, next) {
    server.get('/users', { preHandler: [AllowOwner_1.default] }, UserHandler_1.default.getAll);
    server.post('/register', { preHandler: [AllowOwner_1.default] }, UserHandler_1.default.register);
    server.post('/change-role/:id', { preHandler: [AllowOwner_1.default] }, UserHandler_1.default.changeRole);
    server.post('/login', UserHandler_1.default.logIn);
    server.get('/profile', { preHandler: [AuthHandler_1.default] }, UserHandler_1.default.profile);
    server.get('/features', { preHandler: [AuthHandler_1.default] }, UserHandler_1.default.features);
    server.post('/change-password', { preHandler: [AuthHandler_1.default] }, UserHandler_1.default.changePassword);
    next();
};
exports.default = userRoute;
//# sourceMappingURL=userRoute.js.map