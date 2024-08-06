import React, { FC, useContext, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

import Button from "../../components/Button/Button";
import DragDrop from "../../components/DragDrop/DragDrop";
import Input from "../../components/Input/Input";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import UserService from "../../services/user.service";

import "./Register.scss";

const Register: FC = () => {
    const { add } = useContext(Toaster);

    const [type, setType] = useState(0);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [eye, setEye] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [picture, setPicture] = useState("");

    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");
    const [eMail, setEMail] = useState("");

    const [reCaptcha, setReCaptcha] = useState("");

    const userMutation = UserService.Register();

    useEffect(() => {
        if (userMutation.isError) {
            const error = userMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }
    }, [userMutation.isError]);

    return (
        <main className="register-wrapper">
            <div className="register">
                <div className="register__top">
                    {type === 0 && (
                        <>
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
                        </>
                    )}
                    {type === 1 && (
                        <>
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
                        </>
                    )}
                    {type === 2 && (
                        <>
                            <Input
                                type="text"
                                value={login}
                                placeholder="Логин"
                                variant="float"
                                onChange={(value) => setLogin(value)}
                            />
                            <Input
                                type={eye ? "text" : "password"}
                                value={password}
                                placeholder="Пароль"
                                variant="float"
                                onChange={(value) => setPassword(value)}
                            >
                                {eye ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        onClick={() => setEye(false)}
                                    >
                                        <title>eye-off-outline</title>
                                        <path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        onClick={() => setEye(true)}
                                    >
                                        <title>eye-outline</title>
                                        <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                                    </svg>
                                )}
                            </Input>
                            <div className="top__re-captcha">
                                <ReCAPTCHA
                                    sitekey="6LcfTf0pAAAAAIcf5rp2TfhPF6TwURbWQTBNogYo"
                                    onChange={(value) =>
                                        value && setReCaptcha(value)
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="register__bottom">
                    <div className="bottom__button">
                        {type > 0 && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                onClick={() => setType((type) => type - 1)}
                            >
                                <title>chevron-left</title>
                                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                            </svg>
                        )}
                        <Button
                            onClick={() => {
                                if (type < 2) {
                                    setType((type) => type + 1);

                                    return;
                                }

                                userMutation.mutate({
                                    login,
                                    password,
                                    firstName,
                                    lastName,
                                    picture,
                                    day,
                                    month,
                                    year,
                                    phoneNumber,
                                    eMail,
                                    reCaptcha,
                                });
                            }}
                        >
                            {type < 2 ? "Продолжить" : "Завершить"}
                        </Button>
                    </div>
                    <Link to="/login">У вас уже есть аккаунт?</Link>
                </div>
            </div>
        </main>
    );
};

export default Register;
