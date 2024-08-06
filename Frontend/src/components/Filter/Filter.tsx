import React, { FC, useState } from "react";

import { CN } from "../../utils/Helper";

import "./Filter.scss";

type Props = {
    name: string;
    defaultOpen?: boolean;
    className?: string;
    style?: string;
    children: React.ReactElement;
};

const Filter: FC<Props> = ({ name, className, defaultOpen, children }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="filter">
            <div
                className={CN("filter__top", open && "filter-active")}
                onClick={() => setOpen(!open)}
            >
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
                <span>{name}</span>
            </div>
            {open && (
                <div className={CN("filter__bottom", className)}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default Filter;
