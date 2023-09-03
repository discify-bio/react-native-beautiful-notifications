"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Context_1 = __importDefault(require("./Context"));
const useNotification = () => {
    const notificationContext = (0, react_1.useContext)(Context_1.default);
    const notification = (0, react_1.useMemo)(() => {
        return notificationContext.current;
    }, [notificationContext.current]);
    return notification;
};
exports.default = useNotification;
