import React, { FC } from "react";

import { CN } from "../../utils/Helper";
import Spinner from "../Loader/Spinner";

import "./Icon.scss";

type Props = {
    className?: string;
    loading?: boolean;
    children: React.ReactElement;
    onClick?: () => void;
};

const Icon: FC<Props> = ({ className, loading, children, onClick }) => {
    return (
        <div
            className={CN("icon", className)}
            onClick={onClick}
        >
            {loading ? (
                <Spinner
                    size="small"
                    color="primary"
                />
            ) : (
                children
            )}
        </div>
    );
};

export default Icon;
