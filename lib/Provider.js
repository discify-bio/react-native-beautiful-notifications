"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const Context_1 = __importDefault(require("./Context"));
const react_native_portalize_1 = require("react-native-portalize");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const Provider = ({ children }) => {
    const ref = react_2.useRef(null);
    const [isOpen, setIsOpen] = react_2.useState(false);
    const [notificationChildren, setNotificationChildren] = react_2.useState(null);
    const [id, setId] = react_2.useState(null);
    react_2.useEffect(() => {
        ref.current = {
            show: start
        };
    }, []);
    const value = react_native_reanimated_1.useSharedValue(0);
    const start = (properties) => {
        if (!properties.children)
            return;
        if (properties.id)
            setId(properties.id);
        setNotificationChildren(properties.children);
        startAnimation();
    };
    const closeModal = () => {
        setIsOpen(false);
        setNotificationChildren(null);
    };
    const startAnimation = () => {
        setIsOpen(true);
        value.value = react_native_reanimated_1.withSequence(react_native_reanimated_1.withTiming(1, {
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.quad),
            duration: 350
        }), react_native_reanimated_1.withDelay(3000, react_native_reanimated_1.withTiming(0, {
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.quad),
            duration: 350
        }, (isEnded) => {
            if (isEnded)
                react_native_reanimated_1.runOnJS(closeModal)();
        })));
    };
    return (react_1.default.createElement(Context_1.default.Provider, { value: ref },
        react_1.default.createElement(react_native_portalize_1.Host, { style: {
                flex: 1
            } },
            react_1.default.createElement(react_native_portalize_1.Portal, null,
                react_1.default.createElement(react_native_safe_area_context_1.SafeAreaView, { pointerEvents: 'none' }, isOpen && (react_1.default.createElement(react_native_reanimated_1.default.View, { key: id, entering: react_native_reanimated_1.FadeInUp, exiting: react_native_reanimated_1.FadeOutUp }, notificationChildren)))),
            children)));
};
exports.default = Provider;
