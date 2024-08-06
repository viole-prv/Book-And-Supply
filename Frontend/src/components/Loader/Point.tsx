import React, { FC } from "react";

import "./Point.scss";

const Point: FC = () => {
    return (
        <div className="point-wrapper">
            {Array.from({ length: 3 }, (_, i) => (
                <div
                    key={i}
                    className="point"
                />
            ))}
        </div>
    );
};

export default Point;
