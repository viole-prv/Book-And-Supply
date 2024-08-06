import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import Button from "../../components/Button/Button";
import Gallery from "../../components/Gallery/Gallery";
import Grid from "../../components/Grid/Grid";
import Icon from "../../components/Icon/Icon";
import Navigation from "../../components/Navigation/Navigation";
import Score from "../../components/Score/Score";
import Star from "../../components/Star/Star";
import Switch from "../../components/Switch/Switch";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import BagService from "../../services/bag.service";
import CategoryService from "../../services/category.service";
import FavoriteService from "../../services/favorite.service";
import PieceService from "../../services/piece.service";
import Critique from "../Critique/Critique";

import "./Piece.scss";

type Props = {
    critique: boolean;
};

const Piece: FC<Props> = ({ critique }) => {
    const { categoryValue, pieceValue } = useParams<{
        categoryValue: string;
        pieceValue: string;
    }>();

    if (categoryValue === undefined || pieceValue === undefined) return null;

    const { add } = useContext(Toaster);

    const ref = useRef<HTMLDivElement>(null);

    const { data: bagList } = BagService.Entry(Infinity);
    const { data: favoriteList } = FavoriteService.Entry(Infinity);

    const { isLoading: categoryLoading, data: category } =
        CategoryService.ByTag(categoryValue);
    const { isLoading: pieceLoading, data: piece } =
        PieceService.ByTag(pieceValue);
    const { isLoading: similarLoading, data: similarList } =
        PieceService.Similar(pieceValue);

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

    if (critique) {
        useEffect(() => {
            if (piece && similarList) {
                const T = setInterval(() => {
                    if (ref.current) {
                        ref.current.scrollIntoView({ behavior: "smooth" });

                        clearInterval(T);
                    }
                }, 250);

                return () => clearInterval(T);
            }
        }, [piece, similarList]);
    }

    if (categoryLoading || pieceLoading || similarLoading) return null;

    if (
        category === undefined ||
        piece === undefined ||
        similarList === undefined
    )
        return null;

    const bag = bagList?.find((bag) => bag.piece.tag === piece.tag);

    const favorite = favoriteList?.some(
        (favorite) => favorite.tag === piece.tag,
    );

    return (
        <main className="piece-wrapper">
            <Navigation />
            <div className="piece">
                <div className="piece__header">
                    <span className="header__name">{piece.name}</span>
                </div>
                <div className="piece__gallery-wrapper">
                    <div className="gallery">
                        <Gallery
                            caption={piece.name}
                            children={piece.picture}
                        />
                    </div>
                </div>
                <div className="piece__footer">
                    <div className="footer__top">
                        <div
                            className="top__critique"
                            onClick={() => {
                                ref.current?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                        >
                            <Star
                                variant="medium"
                                min={1}
                                max={1}
                            />
                            <span>{piece.critique.star}</span>
                        </div>
                        <div className="top__caption">
                            <span className="caption__header">ИНФОРМАЦИЯ</span>
                            <div className="caption__main">
                                <table className="property">
                                    <tbody>
                                        {piece.property.map((property) => (
                                            <tr key={property.name}>
                                                <th>{property.name}:</th>
                                                <td>
                                                    {property.array.map(
                                                        (value) => (
                                                            <span key={value}>
                                                                {value}
                                                            </span>
                                                        ),
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {piece.description && (
                            <div className="top__caption">
                                <span className="caption__header">
                                    ОПИСАНИЕ
                                </span>
                                <div className="caption__main">
                                    <pre className="description">
                                        {piece.description}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="footer__bottom">
                        <div className="bottom__info">
                            <div className="info__price">
                                <span className="price__current">
                                    {piece.price.current.toLocaleString("ru")} ₽
                                </span>
                                {piece.price.rate > 0 && (
                                    <>
                                        <div className="price__primary">
                                            <span>
                                                {piece.price.primary.toLocaleString(
                                                    "ru",
                                                )}{" "}
                                                ₽
                                            </span>
                                        </div>
                                        <span className="price__rate">
                                            -{piece.price.rate}%
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="info__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <title>information-outline</title>
                                    <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bottom__navbar">
                            {bag?.quantity ? (
                                <Switch
                                    min={0}
                                    value={bag.quantity}
                                    max={piece.count}
                                    className="navbar__buy"
                                    loading={bagMutation.isPending}
                                    onChange={(value) =>
                                        bagMutation.mutate({
                                            id: piece.id,
                                            quantity: value,
                                        })
                                    }
                                />
                            ) : (
                                <>
                                    <Button
                                        className="navbar__buy"
                                        disabled={piece.count === 0}
                                        loading={bagMutation.isPending}
                                        onClick={() =>
                                            bagMutation.mutate({
                                                id: piece.id,
                                                quantity: 1,
                                            })
                                        }
                                    >
                                        Купить
                                    </Button>
                                    <Icon
                                        loading={favoriteMutation.isPending}
                                        onClick={() =>
                                            favoriteMutation.mutate(piece.id)
                                        }
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="piece__similar">
                    <Grid list={similarList} />
                </div>
                <div
                    ref={ref}
                    className="piece__feedback"
                >
                    <div className="feedback__critique">
                        <Critique />
                    </div>
                    <div className="feedback__score">
                        <Score critique={piece.critique} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Piece;
