import React, { FC, useContext, useRef, useState } from "react";

import useResize from "../../hooks/useResize";
import { Context as Default } from "../../providers/Default/Default";
import { CN } from "../../utils/Helper";

import "./Gallery.scss";

type Props = {
    caption: string;
    children: Array<string>;
};

const Gallery: FC<Props> = ({ caption, children }) => {
    const { isDesktop } = useContext(Default);

    const ref = useRef<HTMLDivElement>(null);

    const [current, setCurrent] = useState(0);
    const [chevron, setChevron] = useState(false);

    useResize(() => {
        if (ref.current) {
            setChevron(
                isDesktop
                    ? ref.current.scrollHeight > ref.current.clientHeight
                    : ref.current.scrollWidth > ref.current.clientWidth,
            );
        }
    }, [ref.current, isDesktop]);

    const onChevron = (value: boolean) => {
        if (ref.current) {
            ref.current.scrollBy({
                [isDesktop ? "top" : "left"]: value ? -86 : 86,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="gallery__wrapper">
            <div className="gallery__slider">
                {chevron && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        onClick={() => onChevron(true)}
                    >
                        {isDesktop ? (
                            <>
                                <title>chevron-up</title>
                                <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
                            </>
                        ) : (
                            <>
                                <title>chevron-left</title>
                                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                            </>
                        )}
                    </svg>
                )}
                <div
                    ref={ref}
                    className="slider-container"
                >
                    {children.map((value, index) => (
                        <img
                            key={value}
                            alt={caption}
                            src={value}
                            draggable={false}
                            loading="lazy"
                            className={CN(
                                "slider",
                                current === index && "slider-current",
                            )}
                            onClick={() => {
                                if (current < index) {
                                    onChevron(false);
                                } else if (current > index) {
                                    onChevron(true);
                                }

                                setCurrent(index);
                            }}
                        />
                    ))}
                </div>
                {chevron && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        onClick={() => onChevron(false)}
                    >
                        {isDesktop ? (
                            <>
                                <title>chevron-down</title>
                                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                            </>
                        ) : (
                            <>
                                <title>chevron-right</title>
                                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </>
                        )}
                    </svg>
                )}
            </div>
            <div className="gallery__picture">
                <img
                    alt={caption}
                    src={children[current]}
                    draggable={false}
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default Gallery;
