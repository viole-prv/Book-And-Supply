import React, { FC, useState } from "react";

import { CN } from "../../utils/Helper";

import "./Select.scss";

type Props = {
    defaultValue: number | null;
    placeholder: string;
    nullable: boolean;
    children: Map<number, string>;
    onChange: (value: number | null) => void;
};

const Select: FC<Props> = ({
    defaultValue,
    placeholder,
    nullable,
    onChange,
    children,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="select-wrapper"
            onClick={() => children.size > 0 && setOpen(!open)}
        >
            <div className="select__header">
                {defaultValue === null ? (
                    <span style={{ color: "#a9a9a9" }}>{placeholder}</span>
                ) : (
                    <span>{children.get(defaultValue)}</span>
                )}
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
            {open && (
                <div className="select-container">
                    {Array.from(children).map(([key, value]) => (
                        <div
                            key={key}
                            className={CN(
                                "select",
                                key === defaultValue && "select-current",
                            )}
                        >
                            <span
                                onClick={() => {
                                    onChange(key);

                                    setOpen(false);
                                }}
                            >
                                {value}
                            </span>
                            {nullable && key === defaultValue && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    onClick={() => {
                                        onChange(null);

                                        setOpen(false);
                                    }}
                                >
                                    <title>minus</title>
                                    <path d="M19,13H5V11H19V13Z" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
