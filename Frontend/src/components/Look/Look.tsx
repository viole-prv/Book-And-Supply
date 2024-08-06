import React, { FC, useRef, useState } from "react";
import { Link } from "react-router-dom";

import PieceService from "../../services/piece.service";
import { CN } from "../../utils/Helper";

import "./Look.scss";

type Props = {
    className?: string;
    placeholder: string;
};

const Look: FC<Props> = ({ className, placeholder }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [overlay, setOverlay] = useState(false);
    const [value, setValue] = useState("");

    const { data: lookList } = PieceService.Look(value);

    return (
        <div className={CN("look-wrapper", className)}>
            <div
                className="look"
                onFocus={() => setOverlay(true)}
                onBlur={(e) => {
                    if (
                        ref.current &&
                        ref.current.contains(e.relatedTarget as Node)
                    ) {
                        return;
                    }

                    setOverlay(false);
                }}
            >
                <input
                    type="text"
                    value={value}
                    style={{
                        borderBottomLeftRadius:
                            overlay && lookList ? "unset" : "6px",
                        borderBottomRightRadius:
                            overlay && lookList ? "unset" : "6px",
                    }}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="input__icon">
                    {value.length > 0 && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            onClick={() => setValue("")}
                        >
                            <title>close</title>
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <title>magnify</title>
                        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                    </svg>
                </div>
                {overlay && lookList && (
                    <div
                        ref={ref}
                        className="input__dropdown"
                    >
                        {lookList.slice(0, 8).map((piece) => (
                            <Link
                                key={piece.name}
                                to={`/${piece.category?.tag}/${piece.tag}`}
                                onClick={() => setOverlay(false)}
                            >
                                <img
                                    alt={piece.name}
                                    src={piece.picture[0]}
                                />
                                <span>{piece.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            {overlay && <div className="overlay" />}
        </div>
    );
};

export default Look;
