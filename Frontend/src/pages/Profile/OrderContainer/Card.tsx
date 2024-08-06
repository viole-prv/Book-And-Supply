import React, { FC, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import Model from "../../../components/Model/Model";
import { Context as Default } from "../../../providers/Default/Default";
import { Context as Toaster } from "../../../providers/Toaster/Toaster";
import OrderService, { IOrder } from "../../../services/order.service";

import "./Card.scss";

type Props = {
    order: IOrder;
};

const Card: FC<Props> = ({ order }) => {
    const navigate = useNavigate();

    const { isDesktop } = useContext(Default);
    const { add } = useContext(Toaster);

    const [open, setOpen] = useState(false);

    const orderMutation = OrderService.Update();

    useEffect(() => {
        if (orderMutation.isError) {
            const error = orderMutation.error as AxiosError;

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        add(`Ошибка: 1.`);

                        break;
                    case 402:
                        add(`Ошибка: 2.`);

                        break;
                }
            }
        }

        if (orderMutation.isSuccess) {
            navigate(`/profile/order/${order.tag}`);
        }
    }, [orderMutation.isError, orderMutation.isSuccess]);

    const Footer = () => {
        return (
            <div className="footer-wrapper">
                {order.condition === "SUCCEEDED" && <span>Что-то не так?</span>}
                {order.condition === "PENDING" && (
                    <>
                        <span
                            onClick={() => {
                                window.open(
                                    `https://yoomoney.ru/checkout/payments/v2/contract?orderId=${order.tag}`,
                                    "_blank",
                                    "noreferrer",
                                );
                            }}
                        >
                            Оплатить
                        </span>
                        <span onClick={() => orderMutation.mutate(order.tag)}>
                            Проверить
                        </span>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="order-container-card">
            <Link
                to={order.tag}
                className="order-container-card__header"
            >
                <span className="header__date">{order.date}</span>
                <span className="header__price">
                    {order.price.toLocaleString("ru-RU")} ₽
                </span>
            </Link>
            <div className="order-container-card__main">
                {order.piece.map((piece) => (
                    <Link
                        key={piece.tag}
                        to={`/${piece.category}/${piece.tag}`}
                        className="main__picture"
                    >
                        <img
                            alt={piece.name}
                            src={piece.picture}
                            draggable={false}
                            loading="lazy"
                        />
                    </Link>
                ))}
            </div>
            {order.condition !== "CANCELED" && (
                <div className="order-container-card__footer">
                    {isDesktop ? (
                        <Footer />
                    ) : (
                        <>
                            <div
                                className="footer__icon"
                                onClick={() => setOpen(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <title>dots-vertical</title>
                                    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                                </svg>
                            </div>
                            {open && (
                                <Model
                                    variant="bottom"
                                    onClose={() => setOpen(false)}
                                >
                                    <Footer />
                                </Model>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Card;
