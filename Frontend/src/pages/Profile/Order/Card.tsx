import React, { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Model from "../../../components/Model/Model";
import { Context as Toaster } from "../../../providers/Toaster/Toaster";
import CritiqueService from "../../../services/critique.service";
import { IPiece } from "../../../services/order.service";
import { CN } from "../../../utils/Helper";

import "./Card.scss";

type Props = {
    piece: IPiece;
};

const Card: FC<Props> = ({ piece }) => {
    const { add } = useContext(Toaster);

    const [star, setStar] = useState(0);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const critiqueMutation = CritiqueService.Create();

    useEffect(() => {
        if (critiqueMutation.isError) {
            const error = critiqueMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }

        if (critiqueMutation.isSuccess) {
            setOpen(false);
        }
    }, [critiqueMutation.isError, critiqueMutation.isSuccess]);

    return (
        <div className="order-card">
            <Link
                to={`/${piece.category}/${piece.tag}`}
                className="order-card__picture"
            >
                <img
                    alt={piece.name}
                    src={piece.picture}
                    draggable={false}
                    loading="lazy"
                />
            </Link>
            <div className="order-card__header">
                <Link
                    to={`/${piece.category}/${piece.tag}`}
                    className="header__name"
                >
                    <span>{piece.name}</span>
                </Link>
                <span
                    className="header__say"
                    onClick={() => setOpen(true)}
                >
                    Выразить свое мнение
                </span>
            </div>
            <div className="order-card__footer">
                <span className="footer__price">
                    {piece.price.toLocaleString("ru-RU")} ₽
                </span>
                <span className="footer__quantity">{piece.quantity} шт.</span>
                <span className="footer__amount">
                    {(piece.price * piece.quantity).toLocaleString("ru-RU")} ₽
                </span>
            </div>
            {open && (
                <Model
                    variant="center"
                    onClose={() => setOpen(false)}
                >
                    <div className="order-card__say">
                        <div className="say__star-container">
                            {Array.from(
                                { length: 5 },
                                (_, index) => index + 1,
                            ).map((index) => (
                                <svg
                                    key={index}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={CN(
                                        "star",
                                        star >= index && "star-active",
                                    )}
                                    onClick={() => {
                                        if (star === index) {
                                            setStar(0);
                                        } else {
                                            setStar(index);
                                        }
                                    }}
                                >
                                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                </svg>
                            ))}
                        </div>
                        <div className="say__textarea">
                            <Input
                                type="textarea"
                                value={message}
                                onChange={(value) => setMessage(value)}
                            />
                        </div>
                        <Button
                            onClick={() => {
                                critiqueMutation.mutate({
                                    id: piece.id,
                                    star,
                                    message,
                                });
                            }}
                        >
                            Отправить
                        </Button>
                    </div>
                </Model>
            )}
        </div>
    );
};

export default Card;
