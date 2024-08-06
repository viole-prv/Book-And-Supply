import React, { CSSProperties, FC } from "react";

import { CN } from "../../utils/Helper";

import "./Counter.scss";

type Props = {
    value?: number;
    className?: string;
    children: React.ReactElement[];
    onClick?: () => void;
};

const Counter: FC<Props> = ({ value, className, children, onClick }) => {
    return (
        <div
            className={CN("counter-wrapper", className)}
            onClick={onClick}
        >
            <div className="counter">
                {children[0]}
                {Number(value) > 0 && (
                    <div className="counter__index">{value}</div>
                )}
            </div>
            {children[1]}
        </div>
    );
};

export default Counter;
