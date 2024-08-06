import React, { FC, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

import Icon from "../../components/Icon/Icon";
import Switch from "../../components/Switch/Switch";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import BagService, { IPiece } from "../../services/bag.service";
import FavoriteService from "../../services/favorite.service";

import "./Card.scss";

type Props = {
    piece: IPiece;
};

const Card: FC<Props> = ({ piece }) => {
    const { add } = useContext(Toaster);

    const { data: bagList } = BagService.Entry(Infinity);
    const { data: favoriteList } = FavoriteService.Entry(Infinity);

    const bagMutation = BagService.Update();

    useEffect(() => {
        if (bagMutation.isError) {
            const error = bagMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }
    }, [bagMutation.isError]);

    const favoriteMutation = FavoriteService.Update();

    useEffect(() => {
        if (favoriteMutation.isError) {
            const error = favoriteMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }
    }, [favoriteMutation.isError]);

    if (bagList === undefined) return null;

    const bag = bagList.find((bag) => bag.piece.tag === piece.tag);

    if (bag === undefined) return null;

    const favorite = favoriteList?.some(
        (favorite) => favorite.tag === piece.tag,
    );

    return (
        <div className="bag-card">
            <Link
                to={`/${piece.category}/${piece.tag}`}
                className="bag-card__picture"
            >
                <img
                    alt={piece.name}
                    src={piece.picture}
                    draggable={false}
                    loading="lazy"
                />
            </Link>
            <Link
                className="bag-card__name"
                to={`/${piece.category}/${piece.tag}`}
            >
                {piece.name}
            </Link>
            {bag.quantity && (
                <Switch
                    min={0}
                    value={bag.quantity}
                    max={piece.count}
                    className="bag-card__buy"
                    loading={bagMutation.isPending}
                    onChange={(value) =>
                        bagMutation.mutate({
                            id: piece.id,
                            quantity: value,
                        })
                    }
                />
            )}
            <div className="bag-card__price">
                <span className="price__current">
                    {(piece.price.current * bag.quantity).toLocaleString("ru")}₽
                </span>
                {piece.price.rate > 0 && (
                    <>
                        <span className="price__rate">
                            -{piece.price.rate}%
                        </span>
                        <div className="price__primary">
                            <span>
                                {(
                                    piece.price.primary * bag.quantity
                                ).toLocaleString("ru")}{" "}
                                ₽
                            </span>
                        </div>
                    </>
                )}
            </div>
            <div className="bag-card__icon">
                <Icon
                    loading={favoriteMutation.isPending}
                    onClick={() => favoriteMutation.mutate(piece.id)}
                >
                    {favorite ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>heart</title>
                            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>heart-outline</title>
                            <path
                                fill="white"
                                d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55Z"
                            />
                            <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                        </svg>
                    )}
                </Icon>
            </div>
        </div>
    );
};

export default Card;
