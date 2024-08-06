import React, { FC } from "react";

import "./Star.scss";

type Props = {
    variant: "large" | "medium" | "small";
    min: number;
    max: number;
};

const Star: FC<Props> = ({ variant, min, max }) => {
    const N = (min / max) * 100;

    let width = 16;
    let height = 12;

    switch (variant) {
        case "large":
            width *= 1.5;
            height *= 1.5;

            break;

        case "medium":
            width *= 1.25;
            height *= 1.25;
            break;

        case "small":
            width *= 1;
            height *= 1;

            break;
    }

    return (
        <div
            style={{ width: `${width * max}px`, height: `${height}px` }}
            className="star-wrapper"
        >
            <div
                className="star__empty"
                style={{ backgroundSize: `${width}px ${height}px` }}
            />
            <div
                className="star"
                style={{
                    backgroundSize: `${width}px ${height}px`,
                    width: `${N.toFixed(2)}%`,
                }}
            />
        </div>
    );
};

export default Star;
