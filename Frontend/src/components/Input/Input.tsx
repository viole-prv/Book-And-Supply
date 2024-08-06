import React, { FC } from "react";

import { CN } from "../../utils/Helper";

import "./Input.scss";

type Props = {
    variant?: "float";
    type: "textarea" | "text" | "number" | "password";
    value: string | number;
    placeholder?: string;
    className?: string;
    children?: React.ReactElement;
    onChange?: (value: string) => void;
};

const Input: FC<Props> = ({
    variant,
    type,
    value,
    placeholder,
    className,
    children,
    onChange,
}) => {
    return (
        <div className={CN("input", className)}>
            {type === "textarea" ? (
                <textarea
                    value={value}
                    placeholder={variant === "float" ? " " : placeholder}
                    className="scrollbar"
                    onChange={(e) => {
                        if (onChange) {
                            onChange(e.target.value);
                        }
                    }}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    placeholder={variant === "float" ? " " : placeholder}
                    onChange={(e) => {
                        if (onChange) {
                            onChange(e.target.value);
                        }
                    }}
                />
            )}
            {variant === "float" && <span>{placeholder}</span>}
            {children}
        </div>
    );
};

export default Input;
