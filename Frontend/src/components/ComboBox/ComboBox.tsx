import React, { CSSProperties, FC, useRef, useState } from "react";

import useResize from "../../hooks/useResize";
import { CN } from "../../utils/Helper";

import "./ComboBox.scss";

type Props = {
    placeholder: string;
    className?: string;
    children: Array<string>;
    onChange?: (array: Array<string>) => void;
};

const ComboBox: FC<Props> = ({
    placeholder,
    className,
    children,
    onChange,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [value, setValue] = useState<string>("");
    const [open, setOpen] = useState(false);

    return (
        <div className={CN("combo-box-wrapper", className)}>
            <div className="combo-box__header">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    onClick={() => {
                        if (value.length === 0 || children.includes(value))
                            return;

                        setValue("");

                        if (onChange) {
                            onChange([...children, value]);
                        }
                    }}
                >
                    <title>plus</title>
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
            </div>
            {children.length > 0 && (
                <div
                    ref={ref}
                    className="combo-box-container"
                    style={{ overflow: open ? "auto" : "hidden" }}
                >
                    {children
                        .slice(0, open ? children.length : 5)
                        .map((value, index) => (
                            <div
                                key={value}
                                className="combo-box"
                            >
                                <span>{value}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    onClick={() => {
                                        if (onChange) {
                                            onChange([
                                                ...children.slice(0, index),
                                                ...children.slice(index + 1),
                                            ]);
                                        }
                                    }}
                                >
                                    <title>close</title>
                                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                </svg>
                            </div>
                        ))}
                </div>
            )}
            {children.length > 5 && (
                <div
                    onClick={() => {
                        if (open) {
                            ref.current?.scrollTo({ top: 0 });
                        }

                        setOpen(!open);
                    }}
                    className="combo-box__show"
                >
                    <span>{open ? "Свернуть" : "Показать"}</span>
                    {open ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>chevron-up</title>
                            <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>chevron-down</title>
                            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                        </svg>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComboBox;
