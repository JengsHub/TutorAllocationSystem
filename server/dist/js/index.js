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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const typescript_rest_1 = require("typescript-rest");
// Importing all handlers
require("./handlers");
const helpers_1 = require("./helpers");
exports.app = express_1.default();
exports.app.use(cors_1.default());
exports.app.use(body_parser_1.default.json());
exports.app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield helpers_1.TryDBConnect(() => {
        res.json({
            error: 'Database connection error, please try again later',
        });
    }, next);
}));
typescript_rest_1.Server.buildServices(exports.app);
// Just checking if given PORT variable is an integer or not
let port = parseInt(process.env.PORT || "");
if (isNaN(port) || port === 0) {
    port = 8888;
}
exports.app.listen(port, () => {
    console.log(`🚀 Server Started at PORT: ${port}`);
});
