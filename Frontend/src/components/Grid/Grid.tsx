import React, { FC, useRef, useState } from "react";

import useResize from "../../hooks/useResize";
import Card from "../../pages/Piece/Card";
import { IPiece } from "../../services/piece.service";

import "./Grid.scss";

type Props = {
    list: IPiece[];
};

const Grid: FC<Props> = ({ list }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [chevron, setChevron] = useState(false);

    useResize(() => {
        if (ref.current) {
            setChevron(ref.current.scrollWidth > ref.current.clientWidth);
        }
    }, [ref.current]);

    const onChevron = (value: boolean) => {
        if (ref.current) {
            const T = ref.current.clientWidth;

            ref.current.scrollBy({
                left: value ? -T : T,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="grid-wrapper">
            {chevron && (
                <div
                    className="grid__icon"
                    onClick={() => onChevron(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <title>chevron-left</title>
                        <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                    </svg>
                </div>
            )}
            <div
                ref={ref}
                className="grid"
            >
                {list.map((piece) => (
                    <Card
                        key={piece.tag}
                        piece={piece}
                    />
                ))}
            </div>
            {chevron && (
                <div
                    className="grid__icon"
                    onClick={() => onChevron(false)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <title>chevron-right</title>
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default Grid;
