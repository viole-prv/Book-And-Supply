import React, { FC, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import PromotionService from "../../services/promotion.service";

import "./Promotion.scss";

export const Promotion: FC = () => {
    const { add } = useContext(Toaster);

    const [name, setName] = useState("");
    const [value, setValue] = useState(0);

    const promotionMutation = PromotionService.Create();

    useEffect(() => {
        if (promotionMutation.isError) {
            const error = promotionMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }

        if (promotionMutation.isSuccess) {
            add("Success!");
        }
    }, [promotionMutation.isError, promotionMutation.isSuccess]);

    return (
        <div className="security__promotion-wrapper">
            <div className="promotion">
                <div className="promotion__main">
                    <div className="flex">
                        <Input
                            type="text"
                            value={name}
                            placeholder="Название"
                            variant="float"
                            onChange={(value) => setName(value)}
                        />
                        <Input
                            type="number"
                            value={value}
                            placeholder="Значение"
                            variant="float"
                            onChange={(value) => setValue(Number(value))}
                        />
                    </div>
                    <div className="main__button">
                        <Button
                            onClick={() =>
                                promotionMutation.mutate({
                                    name,
                                    value,
                                })
                            }
                        >
                            Добавить
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default { Promotion };
