import React, { FC, useState } from "react";

import { CN } from "../../utils/Helper";
import Model from "../Model/Model";

import "./DropDown.scss";

type Props = {
    defaultValue: number;
    children: Map<number, string>;
    onChange: (value: number) => void;
};

const DropDown: FC<Props> = ({ defaultValue, onChange, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="drop-down-wrapper"
            onClick={() => children.size > 0 && setOpen(!open)}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <title>sort-variant</title>
                <path d="M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z" />
            </svg>
            <span>{children.get(defaultValue)}</span>
            {open && (
                <Model
                    variant="bottom"
                    onClose={() => setOpen(false)}
                >
                    <div className="drop-down-container">
                        {Array.from(children).map(([key, value]) => (
                            <div
                                key={key}
                                className={CN(
                                    "drop-down",
                                    key === defaultValue && "drop-down-current",
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
                            </div>
                        ))}
                    </div>
                </Model>
            )}
        </div>
    );
};

export default DropDown;
