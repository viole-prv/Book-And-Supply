import React, { FC } from "react";
import { useParams } from "react-router-dom";

import critiqueService from "../../services/critique.service";

import Card from "./Card";

import "./Critique.scss";

const Critique: FC = () => {
    const { pieceValue } = useParams<{ pieceValue: string }>();

    if (pieceValue === undefined) return null;

    const { data: critiqueList } = critiqueService.Entry(pieceValue);

    return (
        <div className="critique-wrapper">
            <div className="critique-container">
                {critiqueList?.map((critique) => (
                    <Card
                        key={critique.name}
                        critique={critique}
                    />
                ))}
            </div>
        </div>
    );
};

export default Critique;
