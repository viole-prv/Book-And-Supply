import React, { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import Button from "../../components/Button/Button";
import CheckBox from "../../components/CheckBox/CheckBox";
import DragDrop from "../../components/DragDrop/DragDrop";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import CategoryService, { IProperty } from "../../services/category.service";
import PieceService, { TPiece, TProperty } from "../../services/piece.service";
import PromotionService from "../../services/promotion.service";
import { randomInteger } from "../../utils/Helper";

import "./Piece.scss";

export const Piece: FC<TPiece> = ({ id, ...T }) => {
    const { add } = useContext(Toaster);

    const [tag, setTag] = useState(T.tag);
    const [name, setName] = useState(T.name);
    const [picture, setPicture] = useState<string[]>(T.picture);
    const [price, setPrice] = useState(T.price);
    const [property, setProperty] = useState<TProperty[]>(T.property);
    const [description, setDescription] = useState(T.description);
    const [count, setCount] = useState(T.count);
    const [category, setCategory] = useState<number | null>(T.category);
    const [promotion, setPromotion] = useState<number | null>(T.promotion);

    const { data: categoryList } = CategoryService.Entry();
    const { data: promotionList } = PromotionService.Entry();

    const createMutation = PieceService.Create();

    useEffect(() => {
        if (createMutation.isError) {
            const error = createMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }

        if (createMutation.isSuccess) {
            add("Success!");
        }
    }, [createMutation.isError, createMutation.isSuccess]);

    const updateMutation = PieceService.Update();

    useEffect(() => {
        if (updateMutation.isError) {
            const error = updateMutation.error as AxiosError;

            if (error.response) {
                add(`Ошибка: ${error.response.status}`);
            }
        }

        if (updateMutation.isSuccess) {
            add("Success!");
        }
    }, [updateMutation.isError, updateMutation.isSuccess]);

    const updateProperty = (
        piecePropertyList: TProperty[],
        categoryPropertyList: IProperty[],
    ) => {
        return categoryPropertyList.map((property) => {
            const pieceProperty = piecePropertyList.find(
                ({ name }) => name === property.name,
            );

            return {
                ...property,
                array: property.array.map((pair) => {
                    const piecePair = pieceProperty?.array.find(
                        ({ key }) => key === pair.key,
                    );

                    return {
                        key: pair.key,
                        value: piecePair ? piecePair.value : false,
                    };
                }),
            };
        });
    };

    useEffect(() => {
        if (categoryList) {
            if (category) {
                const T = categoryList.find(({ id }) => id === category);

                if (T) {
                    setProperty((propertyList) =>
                        updateProperty(propertyList, T.property),
                    );
                }
            } else {
                setProperty([]);
            }
        }
    }, [categoryList, category]);

    const onName = (name: string, value: string) => {
        setProperty((propertyList) =>
            propertyList.map((property) =>
                property.name === name
                    ? {
                          ...property,
                          name: value,
                      }
                    : property,
            ),
        );
    };

    const onArray = (name: string, value: boolean, key: string) => {
        setProperty((propertyList) =>
            propertyList.map((property) => {
                if (property.name === name) {
                    return {
                        ...property,
                        array: property.array.map((pair) => ({
                            key: pair.key,
                            value: pair.key === key ? value : pair.value,
                        })),
                    };
                }

                return property;
            }),
        );
    };

    if (categoryList === undefined || promotionList === undefined) return null;

    return (
        <div className="security__piece-wrapper">
            <div className="piece">
                <div className="piece__main">
                    <div className="flex">
                        <Input
                            type="text"
                            value={tag}
                            placeholder="Тег"
                            variant="float"
                            onChange={(value) => setTag(value)}
                        />
                        <Input
                            type="text"
                            value={name}
                            placeholder="Название"
                            variant="float"
                            onChange={(value) => setName(value)}
                        />
                    </div>
                    {picture.length > 0 && (
                        <div className="main__trailer-wrapper">
                            {picture.map((picture, index) => (
                                <div
                                    key={picture}
                                    className="trailer"
                                >
                                    <div className="trailer__picture">
                                        <img
                                            alt={index.toString()}
                                            src={picture}
                                            draggable={false}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="trailer__icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            onClick={() => {
                                                setPicture((T) => [
                                                    ...T.slice(0, index),
                                                    ...T.slice(index + 1),
                                                ]);
                                            }}
                                        >
                                            <title>close</title>
                                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <DragDrop
                        className="main__drag-drop"
                        onChange={(value) =>
                            setPicture((picture) => [...picture, value])
                        }
                    />
                    <div className="flex">
                        <Input
                            type="number"
                            value={price}
                            placeholder="Цена"
                            variant="float"
                            onChange={(value) => setPrice(Number(value))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                onClick={() =>
                                    setPrice(randomInteger(1000, 5000))
                                }
                            >
                                <title>currency-usd</title>
                                <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
                            </svg>
                        </Input>
                        <Input
                            type="number"
                            value={count}
                            placeholder="Количество"
                            variant="float"
                            onChange={(value) => setCount(Number(value))}
                        />
                    </div>
                    <div className="main__textarea">
                        <Input
                            type="textarea"
                            value={description}
                            placeholder="Описание"
                            variant="float"
                            onChange={(value) => setDescription(value)}
                        />
                    </div>
                    <div className="main__select">
                        <Select
                            defaultValue={category}
                            placeholder="Категория"
                            nullable={true}
                            onChange={(value) => setCategory(value)}
                        >
                            {categoryList.reduce<Map<number, string>>(
                                (accumulator, currentValue) => {
                                    accumulator.set(
                                        currentValue.id,
                                        currentValue.name,
                                    );

                                    return accumulator;
                                },
                                new Map<number, string>(),
                            )}
                        </Select>
                        <Select
                            defaultValue={promotion}
                            placeholder="Продвижение"
                            nullable={true}
                            onChange={(value) => setPromotion(value)}
                        >
                            {promotionList.reduce<Map<number, string>>(
                                (accumulator, currentValue) => {
                                    accumulator.set(
                                        currentValue.id,
                                        currentValue.name,
                                    );

                                    return accumulator;
                                },
                                new Map<number, string>(),
                            )}
                        </Select>
                    </div>
                    <div className="main__button">
                        <Button
                            onClick={() => {
                                const T = {
                                    tag,
                                    name,
                                    picture,
                                    price,
                                    property,
                                    description,
                                    count,
                                    category,
                                    promotion,
                                };

                                if (id) {
                                    updateMutation.mutate({ id, ...T });
                                } else {
                                    createMutation.mutate(T);
                                }
                            }}
                        >
                            {id ? "Обновить" : "Добавить"}
                        </Button>
                    </div>
                </div>
                {property.length > 0 && (
                    <div className="piece__property">
                        {property.map((property, index) => (
                            <div
                                key={index}
                                className="property-wrapper"
                            >
                                <Input
                                    type="text"
                                    value={property.name}
                                    placeholder="Название"
                                    variant="float"
                                    onChange={(value) =>
                                        onName(property.name, value)
                                    }
                                />
                                <CheckBox>
                                    {property.array.map((pair) => ({
                                        checked: pair.value,
                                        children: pair.key,
                                        onChange: (value) =>
                                            onArray(
                                                property.name,
                                                value,
                                                pair.key,
                                            ),
                                    }))}
                                </CheckBox>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const PieceUpdate: FC = () => {
    const { pieceValue } = useParams<{ pieceValue: string }>();

    if (pieceValue === undefined) return null;

    const { isLoading, data: piece } = PieceService.ByTag(pieceValue);

    if (isLoading) return null;

    if (piece === undefined) return null;

    return (
        <Piece
            id={piece.id}
            tag={piece.tag}
            name={piece.name}
            picture={piece.picture}
            price={piece.price.current}
            property={piece.property.map((property) => ({
                ...property,
                array: property.array.map((key) => ({
                    key,
                    value: true,
                })),
            }))}
            description={piece.description}
            count={piece.count}
            category={piece.category && piece.category.id}
            promotion={piece.promotion && piece.promotion.id}
        />
    );
};

export default { Piece, PieceUpdate };
