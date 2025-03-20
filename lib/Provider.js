"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_1 = require("react-native");
const Provider = ({ children, }) => {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const [isOpen, setIsOpen] = (0, react_2.useState)(false);
    const [notificationChildren, setNotificationChildren] = (0, react_2.useState)(null);
    const [id, setId] = (0, react_2.useState)(null);
    const [notificationOnPress, setNotificationOnPress] = (0, react_2.useState)(undefined);
    const [timeoutNumber, setTimeoutNumber] = (0, react_2.useState)(null);
    (0, react_2.useEffect)(() => {
        ref.current = {
            show: start
        };
    }, []);
    const value = (0, react_native_reanimated_1.useSharedValue)(0);
    const translateValue = (0, react_native_reanimated_1.useSharedValue)(0);
    const start = (properties) => {
        if (!properties.children)
            return;
        setTimeoutNumber(value => {
            if (value !== null)
                clearTimeout(value);
            return null;
        });
        if (properties.id)
            setId(properties.id);
        if (properties.onPress)
            setNotificationOnPress(() => properties.onPress);
        setNotificationChildren(properties.children);
        startAnimation();
    };
    const closeModal = () => {
        value.value = (0, react_native_reanimated_1.withTiming)(0, {
            duration: 350
        }, () => (0, react_native_reanimated_1.runOnJS)(clear)());
    };
    const onPress = () => {
        closeModal();
        if (notificationOnPress)
            notificationOnPress();
    };
    const clear = () => {
        setIsOpen(false);
        setNotificationChildren(null);
        translateValue.value = 0;
        setTimeoutNumber(null);
    };
    const startAnimation = () => {
        setIsOpen(true);
        value.value = (0, react_native_reanimated_1.withTiming)(1, {
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.quad),
            duration: 350
        });
        startTimeout();
    };
    const startTimeout = () => {
        setTimeoutNumber(setTimeout(() => {
            closeModal();
        }, 3500));
    };
    const gesture = react_native_gesture_handler_1.Gesture.Pan()
        .activeOffsetY([-10, 0])
        .onBegin(() => {
        if (timeoutNumber !== null)
            clearTimeout(timeoutNumber);
    })
        .onUpdate(event => {
        const value = event.translationY / 1.5 > 10 ? 10 + (event.translationY / 10) : event.translationY / 1.5;
        if (value > 40)
            return;
        translateValue.value = value;
    })
        .onEnd(event => {
        if (event.translationY > -10) {
            startTimeout();
            translateValue.value = (0, react_native_reanimated_1.withSpring)(0, {
                stiffness: 250,
                damping: 25
            });
            return;
        }
        closeModal();
    });
    const blockStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const interpolateTransform = (0, react_native_reanimated_1.interpolate)(value.value, [0, 1], [-250, insets.top]);
        const interpolateOpacity = (0, react_native_reanimated_1.interpolate)(value.value, [0, 1], [0, 1], react_native_reanimated_1.Extrapolation.CLAMP);
        return {
            opacity: interpolateOpacity,
            transform: [
                {
                    translateY: interpolateTransform + translateValue.value
                }
            ]
        };
    });
    const ref = (0, react_2.useRef)({
        show: start
    });
    return (react_1.default.createElement(Context_1.default.Provider, { value: ref },
        react_1.default.createElement(react_native_portalize_1.Host, { style: {
                flex: 1
            } },
            react_1.default.createElement(react_native_portalize_1.Portal, null, isOpen && (react_1.default.createElement(react_native_gesture_handler_1.GestureDetector, { gesture: gesture },
                react_1.default.createElement(react_native_1.TouchableOpacity, { activeOpacity: 0.7, onPress: onPress },
                    react_1.default.createElement(react_native_reanimated_1.default.View, { key: id, style: blockStyle }, notificationChildren))))),
            children)));
};
exports.default = Provider;
