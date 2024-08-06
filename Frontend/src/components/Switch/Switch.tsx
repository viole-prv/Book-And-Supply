import React, { FC } from "react";

import { CN } from "../../utils/Helper";
import Spinner from "../Loader/Spinner";

import "./Switch.scss";

type Props = {
    min: number;
    value: number;
    max: number;
    className?: string;
    loading: boolean;
    onChange: (value: number) => void;
};

const Switch: FC<Props> = ({
    min,
    value,
    max,
    className,
    loading,
    onChange,
}) => {
    return (
        <div className={CN("switch", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={() => {
                    if (value > min) {
                        onChange(value - 1);
                    }
                }}
            >
                <title>minus</title>
                <path d="M19,13H5V11H19V13Z" />
            </svg>
            {loading ? (
                <Spinner
                    size="small"
                    color="primary"
                />
            ) : (
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value < min) {
                            onChange(min);
                        } else if (value > max) {
                            onChange(max);
                        } else {
                            onChange(value);
                        }
                    }}
                />
            )}

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={() => {
                    if (value < max) {
                        onChange(value + 1);
                    }
                }}
            >
                <title>plus</title>
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
        </div>
    );
};
export default Switch;
