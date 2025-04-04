import React from 'react';
import { PropsWithChildren } from 'react';
interface IProps {
    config?: {
        activeOpacity?: number;
        duration?: number;
    };
}
declare const Provider: React.FC<PropsWithChildren<IProps>>;
export default Provider;
