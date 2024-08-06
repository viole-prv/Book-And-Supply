import React, { FC, useRef } from "react";

import { CN } from "../../utils/Helper";

import "./Model.scss";

type Props = {
    variant: "center" | "stretch" | "bottom";
    name?: string;
    children: React.ReactElement;
    onClose: () => void;
};

const Model: FC<Props> = ({ name, variant, children, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            onClick={(event) => {
                if (ref.current === event.target) {
                    onClose();
                }
            }}
            className="model-wrapper"
        >
            <div className={CN("model", `model-${variant}`)}>
                {variant === "center" && (
                    <div className="model__header">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            onClick={onClose}
                        >
                            <title>close</title>
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                    </div>
                )}
                {variant === "stretch" && name && (
                    <div className="model__header">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            onClick={onClose}
                        >
                            <title>chevron-left</title>
                            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                        </svg>
                        <span>{name}</span>
                    </div>
                )}
                <div className="model__main">{children}</div>
            </div>
        </div>
    );
};

export default Model;
