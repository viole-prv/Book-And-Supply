import React, { FC } from "react";

import Skeleton from "../../components/Skeleton/Skeleton";
import FavoriteService from "../../services/favorite.service";
import Card from "../Piece/Card";

import "./Favorite.scss";

const Favorite: FC = () => {
    const { isLoading, data: favoriteList } = FavoriteService.Entry(60 * 1000);

    return (
        <div className="profile__favorite-wrapper">
            <div className="favorite">
                {isLoading ? (
                    <Skeleton>
                        {Array.from({ length: 4 }, (_, i) => (
                            <div
                                key={i}
                                className="piece-card"
                            >
                                <div className="piece-card__picture skeleton" />
                                <div
                                    style={{ minHeight: "22px" }}
                                    className="piece-card__price skeleton"
                                />
                                <div
                                    style={{ minHeight: "44px" }}
                                    className="piece-card__info skeleton"
                                />
                                <div
                                    style={{ minHeight: "32px" }}
                                    className="piece-card__navbar skeleton"
                                />
                            </div>
                        ))}
                    </Skeleton>
                ) : (
                    favoriteList?.map((piece) => (
                        <Card
                            key={piece.tag}
                            piece={piece}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Favorite;
