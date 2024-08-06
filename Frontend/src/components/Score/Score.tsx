import React, { FC } from "react";
import { useParams } from "react-router-dom";

import { ICritique } from "../../services/piece.service";
import Scheme from "../Scheme/Scheme";
import Star from "../Star/Star";

import "./Score.scss";

type Props = {
    critique: ICritique;
};

const Score: FC<Props> = ({ critique }) => {
    const { pieceValue } = useParams<{ pieceValue: string }>();

    if (pieceValue === undefined) return null;

    return (
        <>
            <div className="score-wrapper">
                <div className="score">
                    <div className="score__average">
                        <span className="average__star">{critique.star}</span>
                        <Star
                            variant={"large"}
                            min={critique.star}
                            max={5}
                        />
                    </div>
                    <div className="score__scheme">
                        <Scheme
                            score={critique.score}
                            count={critique.count}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Score;
