import React, { FC } from "react";

import Star from "../../components/Star/Star";
import { ICritique } from "../../services/critique.service";

import "./Card.scss";

type Props = {
    critique: ICritique;
};

const Card: FC<Props> = ({ critique }) => {
    return (
        <div className="critique-card">
            <div className="critique-card__top">
                <img
                    alt={critique.name}
                    src={critique.picture}
                    draggable={false}
                    loading="lazy"
                    className="top__picture"
                />
                <div className="top__info">
                    <span className="info__author">{critique.name}</span>
                    <div className="info__star">
                        <Star
                            variant="small"
                            min={critique.star}
                            max={5}
                        />
                    </div>
                    <span className="info__date">{critique.date}</span>
                </div>
            </div>
            <pre className="critique-card__bottom">{critique.message}</pre>
        </div>
    );
};

export default Card;
