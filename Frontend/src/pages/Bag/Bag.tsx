import React, { FC, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import Button from "../../components/Button/Button";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import BagService from "../../services/bag.service";
import OrderService from "../../services/order.service";
import { getDeclension } from "../../utils/Helper";

import Card from "./Card";

import "./Bag.scss";

const Bag: FC = () => {
    const navigate = useNavigate();

    const { add } = useContext(Toaster);

    const { isLoading, data: bagList } = BagService.Entry(60 * 1000);

    const orderMutation = OrderService.Create();

    useEffect(() => {
        if (orderMutation.isError) {
            const error = orderMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }

        if (orderMutation.isSuccess) {
            navigate("/profile/order");
        }
    }, [orderMutation.isError, orderMutation.isSuccess]);

    const T0 = useMemo(() => (bagList ? bagList.length : 0), [bagList]);

    const T1 = useMemo(() => {
        if (bagList) {
            return bagList.reduce((accumulator, currentValue) => {
                const X = currentValue.piece.price.rate
                    ? currentValue.piece.price.primary
                    : currentValue.piece.price.current;

                return accumulator + X * currentValue.quantity;
            }, 0);
        }
    }, [bagList]);

    const T2 = useMemo(() => {
        if (bagList) {
            return bagList.reduce(
                (accumulator, currentValue) =>
                    accumulator +
                    currentValue.piece.price.current * currentValue.quantity,
                0,
            );
        }
    }, [bagList]);

    const T3 = useMemo(() => {
        if (bagList) {
            return bagList
                .filter((bag) => bag.piece.price.rate > 0)
                .reduce((accumulator, currentValue) => {
                    const X =
                        currentValue.piece.price.primary -
                        currentValue.piece.price.current;

                    return accumulator + X * currentValue.quantity;
                }, 0);
        }
    }, [bagList]);

    if (isLoading) return null;

    return (
        <main className="bag-wrapper">
            <div className="bag__top">
                <span>Корзина</span>
            </div>
            <div className="bag__bottom">
                <div className="bottom__piece">
                    {bagList?.map((bag) => (
                        <Card
                            key={bag.piece.tag}
                            piece={bag.piece}
                        />
                    ))}
                </div>
                <div className="bottom__summary">
                    <div className="summary__top">
                        <div className="info">
                            <span>
                                {T0}{" "}
                                {getDeclension(T0, [
                                    "товар",
                                    "товара",
                                    "товаров",
                                ])}
                            </span>
                            <span>{T1?.toLocaleString("ru")} ₽</span>
                        </div>
                        <div className="info">
                            <span>Всего вы экономите</span>
                            <span style={{ color: "crimson" }}>
                                -{T3?.toLocaleString("ru")} ₽
                            </span>
                        </div>
                    </div>
                    <div className="summary__bottom">
                        <div className="price">
                            <span>Итого:</span>
                            <span>{T2?.toLocaleString("ru")} ₽</span>
                        </div>
                        <Button
                            className="summary__button"
                            onClick={orderMutation.mutate}
                        >
                            Оформить
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Bag;
