import React, { useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";

import Button from "../../components/Button/Button";
import DragDrop from "../../components/DragDrop/DragDrop";
import Input from "../../components/Input/Input";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import UserService from "../../services/user.service";

import "./Edit.scss";

const Edit = () => {
    const { add } = useContext(Toaster);

    const { data: user } = UserService.Entry();

    if (user === undefined) return null;

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [picture, setPicture] = useState(user.picture);

    const [day, setDay] = useState(user.day);
    const [month, setMonth] = useState(user.month);
    const [year, setYear] = useState(user.year);

    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [eMail, setEMail] = useState(user.eMail);

    const userMutation = UserService.Update();

    useEffect(() => {
        if (userMutation.isError) {
            const error = userMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }

        if (userMutation.isSuccess) {
            add("Success!");
        }
    }, [userMutation.isError, userMutation.isSuccess]);

    return (
        <div className="profile__edit-wrapper">
            <div className="edit">
                <div className="edit__top">
                    {picture && (
                        <img
                            alt="Изображение"
                            src={picture}
                            draggable={false}
                            loading="lazy"
                            className="top__picture"
                        />
                    )}
                    <DragDrop
                        className="top__drag-drop"
                        onChange={(value) => setPicture(value)}
                    />
                    <Input
                        type="text"
                        value={firstName}
                        placeholder="Имя"
                        variant="float"
                        onChange={(value) => setFirstName(value)}
                    />
                    <Input
                        type="text"
                        value={lastName}
                        placeholder="Фамилия"
                        variant="float"
                        onChange={(value) => setLastName(value)}
                    />
                    <div className="top__date-birth">
                        <Input
                            type="text"
                            value={day.padStart(2, "0")}
                            placeholder="День"
                            variant="float"
                            onChange={(value) => {
                                let T = value;

                                if (T.length > 2) {
                                    T = T.slice(0, 2);
                                }

                                setDay(T);
                            }}
                        />
                        <Input
                            type="text"
                            value={month.padStart(2, "0")}
                            placeholder="Месяц"
                            variant="float"
                            onChange={(value) => {
                                let T = value;

                                if (T.length > 2) {
                                    T = T.slice(0, 2);
                                }

                                setMonth(T);
                            }}
                        />
                        <Input
                            type="text"
                            value={year.padStart(4, "0")}
                            placeholder="Год"
                            variant="float"
                            onChange={(value) => {
                                let T = value;

                                if (T.length > 4) {
                                    T = T.slice(0, 4);
                                }

                                setYear(T);
                            }}
                        />
                    </div>
                    <Input
                        type="text"
                        value={phoneNumber}
                        placeholder="+7 (XXX) XXX-XX-XX"
                        onChange={(value) => {
                            let T = value.replace(/\D/g, "");

                            if (T.length > 11) {
                                T = T.slice(0, 11);
                            }

                            let phoneNumber = "+7";

                            if (T.length === 1) {
                                phoneNumber += ` (${T}`;
                            } else if (T.length > 1) {
                                phoneNumber += ` (${T.slice(1, 4)}`;
                            }

                            if (T.length > 4) {
                                phoneNumber += `) ${T.slice(4, 7)}`;
                            }

                            if (T.length > 7) {
                                phoneNumber += `-${T.slice(7, 9)}`;
                            }

                            if (T.length > 9) {
                                phoneNumber += `-${T.slice(9, 11)}`;
                            }

                            setPhoneNumber(phoneNumber);
                        }}
                    />
                    <Input
                        type="text"
                        value={eMail}
                        placeholder="Почта"
                        onChange={(value) => setEMail(value)}
                    />
                </div>
                <div className="edit__bottom">
                    <Button
                        onClick={() =>
                            userMutation.mutate({
                                firstName,
                                lastName,
                                picture,
                                day,
                                month,
                                year,
                                phoneNumber,
                                eMail,
                            })
                        }
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Edit;
