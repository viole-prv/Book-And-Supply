import React, { FC } from "react";

import { CN } from "../../utils/Helper";
import Spinner from "../Loader/Spinner";

import "./Button.scss";

type Props = {
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    children: string;
    onClick?: () => void;
};

const Button: FC<Props> = ({
    className,
    disabled,
    loading,
    children,
    onClick,
}) => {
    return (
        <button
            className={CN("button", className)}
            disabled={disabled}
            onClick={onClick}
        >
            {loading ? (
                <Spinner
                    size="small"
                    color="white"
                />
            ) : (
                <span>{children}</span>
            )}
        </button>
    );
};

export default Button;
