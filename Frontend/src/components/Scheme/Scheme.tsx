import React, { FC } from "react";

import "./Scheme.scss";

type Props = {
    score: Record<number, number>;
    count: number;
};

const Scheme: FC<Props> = ({ score, count }) => {
    return (
        <table className="scheme">
            <tbody>
                {Array.from({ length: 5 }, (_, index) => 5 - index).map(
                    (index) => {
                        const T = score[index] | 0;
                        const N = (T / count) * 100;

                        return (
                            <tr key={index}>
                                <td>{index}</td>
                                <th>
                                    <div className="progress-wrapper">
                                        <div
                                            className="progress"
                                            style={{
                                                width: `${(Number.isNaN(N) ? 0 : N).toFixed(2)}%`,
                                            }}
                                        />
                                    </div>
                                </th>
                                <td>{T}</td>
                            </tr>
                        );
                    },
                )}
            </tbody>
        </table>
    );
};

export default Scheme;
