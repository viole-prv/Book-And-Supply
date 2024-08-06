import React from "react";
import { useParams } from "react-router-dom";

import OrderService from "../../../services/order.service";

import Card from "./Card";

import "./Order.scss";

const Order = () => {
    const { orderValue } = useParams<{ orderValue: string }>();

    if (orderValue === undefined) return null;

    const { isLoading, data: order } = OrderService.ByTag(orderValue);

    if (isLoading) return null;

    return (
        <div className="profile__order-wrapper">
            <div className="order">
                {order?.piece.map((piece) => (
                    <Card
                        key={piece.tag}
                        piece={piece}
                    />
                ))}
            </div>
        </div>
    );
};

export default Order;
