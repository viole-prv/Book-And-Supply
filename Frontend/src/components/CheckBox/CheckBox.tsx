import React, { FC, useContext, useRef, useState } from "react";

import useResize from "../../hooks/useResize";
import { Context as Default } from "../../providers/Default/Default";

import "./CheckBox.scss";

export interface ICheckContainer {
    type: "CheckBox";
    node: Array<Props>;
}

type Props = {
    checked: boolean;
    children: string;
    onChange?: (value: boolean) => void;
};

const CheckBox: FC<{ children: Array<Props> }> = ({ children }) => {
    const { isDesktop } = useContext(Default);

    const ref = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);

    return (
        <div className="check-box-wrapper">
            <div
                ref={ref}
                className="check-box-container"
                style={{ overflow: open ? "auto" : "hidden" }}
            >
                {children
                    .slice(0, open ? children.length : 5)
                    .map(({ checked, children, onChange }) => (
                        <label
                            key={children}
                            className="check-box"
                        >
                            <input
                                onChange={(e) => {
                                    e.stopPropagation();

                                    if (onChange) {
                                        onChange(e.target.checked);
                                    }
                                }}
                                type="checkbox"
                                checked={checked}
                            />
                            {isDesktop && <div />}
                            <span>{children}</span>
                        </label>
                    ))}
            </div>
            {children.length > 5 && (
                <div
                    onClick={() => {
                        if (open) {
                            ref.current?.scrollTo({ top: 0 });
                        }

                        setOpen(!open);
                    }}
                    className="check-box__show"
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

export default CheckBox;
