import React, { FC } from "react";

import "./Spinner.scss";

type Props = {
    size: "small" | "large";
    color: "white" | "primary";
};

const Spinner: FC<Props> = ({ size, color }) => {
    const sizeStyles = {
        small: 16,
        large: 32,
    };

    const colorStyles = {
        white: "#fff",
        primary: "var(--primary-100)",
    };

    const sizeStyle = sizeStyles[size];
    const borderStyle = `${sizeStyle * 0.125}px`;
    const colorStyle = colorStyles[color];

    return (
        <div className="spinner-wrapper">
            <div
                className="spinner"
                style={{
                    color: colorStyle,
                }}
            >
                {Array.from({ length: 4 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            width: sizeStyle,
                            height: sizeStyle,
                            borderWidth: borderStyle,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Spinner;
