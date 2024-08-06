import React, { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import Button from "../../components/Button/Button";
import ComboBox from "../../components/ComboBox/ComboBox";
import Input from "../../components/Input/Input";
import { Context as Toaster } from "../../providers/Toaster/Toaster";
import CategoryService, {
    TCategory,
    TProperty,
} from "../../services/category.service";

import "./Category.scss";

export const Category: FC<TCategory> = ({ id, ...T }) => {
    const { add } = useContext(Toaster);

    const [tag, setTag] = useState(T.tag);
    const [name, setName] = useState(T.name);
    const [property, setProperty] = useState<TProperty[]>(T.property);

    const createMutation = CategoryService.Create();

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

    const updateMutation = CategoryService.Update();

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

    const onProperty = (name: string, value: any, key: string) => {
        setProperty((propertyList) =>
            propertyList.map((property) =>
                property.name === name
                    ? {
                          ...property,
                          [key]: value,
                      }
                    : property,
            ),
        );
    };

    return (
        <div className="security__category-wrapper">
            <div className="category">
                <div className="category__main">
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
                    <div className="main__button">
                        <Button
                            onClick={() => {
                                const T = { tag, name, property };

                                if (id) {
                                    updateMutation.mutate({ ...T, id });
                                } else {
                                    createMutation.mutate(T);
                                }
                            }}
                        >
                            {id ? "Обновить" : "Добавить"}
                        </Button>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            onClick={() =>
                                setProperty((propertyList) => [
                                    ...propertyList,
                                    { name: "", array: [] },
                                ])
                            }
                        >
                            <title>plus</title>
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                    </div>
                </div>
                {property.length > 0 && (
                    <div className="category__property">
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
                                    onChange={(value) => {
                                        onProperty(
                                            property.name,
                                            value,
                                            "name",
                                        );
                                    }}
                                />
                                <ComboBox
                                    placeholder="Текст"
                                    onChange={(value) => {
                                        onProperty(
                                            property.name,
                                            value,
                                            "array",
                                        );
                                    }}
                                >
                                    {property.array}
                                </ComboBox>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const CategoryUpdate: FC = () => {
    const { categoryValue } = useParams<{ categoryValue: string }>();

    if (categoryValue === undefined) return null;

    const { isLoading, data: category } = CategoryService.ByTag(categoryValue);

    if (isLoading) return null;

    if (category === undefined) return null;

    return (
        <Category
            id={category.id}
            tag={category.tag}
            name={category.name}
            property={category.property.map((property) => ({
                ...property,
                array: property.array.map((pair) => pair.key),
            }))}
        />
    );
};

export default { Category, CategoryUpdate };
