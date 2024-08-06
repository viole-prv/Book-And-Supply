import React, { FC, useState } from "react";

import "./Slider.scss";

type Props = {
    caption: string;
    children: Array<string>;
};

const Slider: FC<Props> = ({ caption, children }) => {
    const [current, setCurrent] = useState(0);

    return (
        <div
            className="slider"
            onMouseLeave={() => setCurrent(0)}
        >
            <ul>
                {children.map((value, index) => (
                    <li
                        key={value}
                        onMouseOver={() => setCurrent(index)}
                    />
                ))}
            </ul>
            <img
                alt={caption}
                src={children[current]}
                draggable={false}
                loading="lazy"
            />
        </div>
    );
};

export default Slider;
