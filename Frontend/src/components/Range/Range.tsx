import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import "./Range.scss";

export interface IRangeContainer {
    type: "Range";
    node: Props;
}

type Props = {
    min: number;
    max: number;
    value: Array<number>;
    onChange: (min: number, max: number) => void;
};

const Range: FC<Props> = ({ min, max, value, onChange }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [minRangeValue, setMinRangeValue] = useState(0);
    const [maxRangeValue, setMaxRangeValue] = useState(0);

    const [minNumberValue, setMinNumberValue] = useState(0);
    const [maxNumberValue, setMaxNumberValue] = useState(0);

    useEffect(() => {
        setMinRangeValue(value[0]);
        setMaxRangeValue(value[1]);

        setMinNumberValue(value[0]);
        setMaxNumberValue(value[1]);
    }, [value]);

    const toValue = useCallback(
        (value: number) => {
            return Math.round(((value - min) / (max - min)) * 100);
        },
        [min, max],
    );

    useEffect(() => {
        const minValue = toValue(minRangeValue);
        const maxValue = toValue(maxRangeValue);

        if (ref.current) {
            ref.current.style.left = `${minValue}%`;
            ref.current.style.width = `${maxValue - minValue}%`;
        }
    }, [minRangeValue, maxRangeValue, toValue]);

    const onBlurMinNumberValue = (value: number) => {
        if (value < min) value = min;
        if (value >= maxRangeValue) value = maxRangeValue - 1;

        setMinNumberValue(value);
        onChange(value, maxRangeValue);
    };

    const onBlueMaxNumberValue = (value: number) => {
        if (value > max) value = max;
        if (value <= minRangeValue) value = minRangeValue + 1;

        setMaxNumberValue(value);
        onChange(minRangeValue, value);
    };

    const onChangeMinRangeValue = (value: number) => {
        value = Math.min(value, maxRangeValue - 1);

        setMinRangeValue(value);
        setMinNumberValue(value);
    };

    const onChangeMaxRangeValue = (value: number) => {
        value = Math.max(value, minRangeValue + 1);

        setMaxRangeValue(value);
        setMaxNumberValue(value);
    };

    return (
        <div className="range-wrapper">
            <input
                type="range"
                min={min}
                max={max}
                value={minRangeValue}
                onChange={(e) => onChangeMinRangeValue(Number(e.target.value))}
                onMouseUp={() => onChange(minRangeValue, maxRangeValue)}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxRangeValue}
                onChange={(e) => onChangeMaxRangeValue(Number(e.target.value))}
                onMouseUp={() => onChange(minRangeValue, maxRangeValue)}
            />
            <div className="range">
                <div
                    ref={ref}
                    className="range__slider"
                />
                <div className="range-container">
                    <label>
                        <span>от</span>
                        <input
                            type="number"
                            maxLength={5}
                            onChange={(e) =>
                                setMinNumberValue(Number(e.target.value))
                            }
                            onBlur={(e) =>
                                onBlurMinNumberValue(Number(e.target.value))
                            }
                            value={minNumberValue}
                        />
                        <span>₽</span>
                    </label>
                    <label>
                        <span>до</span>
                        <input
                            type="number"
                            maxLength={5}
                            onChange={(e) =>
                                setMaxNumberValue(Number(e.target.value))
                            }
                            onBlur={(e) =>
                                onBlueMaxNumberValue(Number(e.target.value))
                            }
                            value={maxNumberValue}
                        />
                        <span>₽</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Range;
