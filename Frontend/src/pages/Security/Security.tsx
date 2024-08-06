import React, { FC } from "react";
import { useOutlet } from "react-router-dom";

import Position from "../../components/Position/Position";

import "./Security.scss";

const Security: FC = () => {
    const T = useOutlet();

    return (
        <Position
            path={[
                {
                    header: "Категория",
                    value: [
                        {
                            to: "category",
                            key: "Добавить",
                            header: true,
                        },
                    ],
                },
                {
                    header: "Каталог",
                    value: [
                        {
                            to: "piece",
                            key: "Добавить",
                            header: true,
                        },
                    ],
                },
                {
                    header: "Продвижение",
                    value: [
                        {
                            to: "promotion",
                            key: "Добавить",
                            header: true,
                        },
                    ],
                },
                {
                    header: "Пользователи",
                    value: [{ to: "user", key: "Управление", header: true }],
                },
            ]}
        >
            {T}
        </Position>
    );
};

export default Security;
