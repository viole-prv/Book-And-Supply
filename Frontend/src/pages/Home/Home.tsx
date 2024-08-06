import React, {
    FC,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useParams } from "react-router-dom";

import CheckBox, { ICheckContainer } from "../../components/CheckBox/CheckBox";
import DropDown from "../../components/DropDown/DropDown";
import Filter from "../../components/Filter/Filter";
import Model from "../../components/Model/Model";
import Navigation from "../../components/Navigation/Navigation";
import Pagination from "../../components/Pagination/Pagination";
import Range, { IRangeContainer } from "../../components/Range/Range";
import Select from "../../components/Select/Select";
import Skeleton from "../../components/Skeleton/Skeleton";
import { Context as Default } from "../../providers/Default/Default";
import CategoryService from "../../services/category.service";
import PieceService from "../../services/piece.service";
import RangeService from "../../services/range.service";
import SortService from "../../services/sort.service";
import Card from "../Piece/Card";

import "./Home.scss";

const Home: FC = () => {
    const { categoryValue } = useParams<{ categoryValue: string }>();

    if (categoryValue === undefined) return null;

    const { isDesktop } = useContext(Default);

    const ref = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    const onChildren = (children: ICheckContainer | IRangeContainer) => {
        const { type, node } = children;

        switch (type) {
            case "CheckBox": {
                return <CheckBox>{node}</CheckBox>;
            }

            case "Range": {
                return (
                    <Range
                        value={node.value}
                        min={node.min}
                        max={node.max}
                        onChange={node.onChange}
                    />
                );
            }
        }
    };

    const { isLoading: rangeLoading, data: range } = RangeService.Entry();
    const { isLoading: sortLoading, data: sort } = SortService.Entry();
    const { isLoading: categoryLoading, data: category } =
        CategoryService.ByTag(categoryValue, 60 * 1000);

    const property = useMemo(() => {
        if (category) {
            return category.property.reduce<Record<string, string[]>>(
                (accumulator, currentValue) => {
                    const T = accumulator[currentValue.name] || [];

                    currentValue.array.forEach((pair) => {
                        if (pair.value) {
                            T.push(pair.key);
                        }
                    });

                    if (T.length > 0) {
                        accumulator[currentValue.name] = T;
                    }

                    return accumulator;
                },
                {},
            );
        }
    }, [category]);

    const filterContainer = useMemo(() => {
        return (
            <div className="filter-container">
                {range && (
                    <Filter
                        name="Цена"
                        defaultOpen={true}
                    >
                        <Range
                            value={range.value}
                            min={range.min}
                            max={range.max}
                            onChange={(min: number, max: number) => {
                                onChange();

                                RangeService.Update(min, max);
                            }}
                        />
                    </Filter>
                )}
                {category &&
                    category.property.map(({ name, array }) => (
                        <Filter
                            key={name}
                            name={name}
                            defaultOpen={true}
                        >
                            {onChildren({
                                type: "CheckBox",
                                node: array.map(({ key, value }) => {
                                    return {
                                        checked: value,
                                        children: key,
                                        onChange: (value) => {
                                            onChange();

                                            CategoryService.Property(
                                                categoryValue,
                                                name,
                                                value,
                                                key,
                                            );
                                        },
                                    };
                                }),
                            })}
                        </Filter>
                    ))}
            </div>
        );
    }, [range, category]);

    const brickContainer = useMemo(() => {
        if (category) {
            const property = category.property.filter((property) =>
                property.array.some((pair) => pair.value),
            );

            return (
                property.length > 0 && (
                    <div className="brick-container">
                        {property.map((property) => (
                            <div
                                key={property.name}
                                className="brick"
                                onClick={() => {
                                    onChange();

                                    CategoryService.Property(
                                        categoryValue,
                                        property.name,
                                        false,
                                    );
                                }}
                            >
                                <span className="brick__name">
                                    {property.name}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="brick__icon"
                                >
                                    <title>close</title>
                                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                </svg>
                            </div>
                        ))}
                    </div>
                )
            );
        }
    }, [category]);

    const sortContainer = useMemo(() => {
        if (sort) {
            return isDesktop ? (
                <Select
                    defaultValue={sort.value}
                    placeholder="Сортировка"
                    nullable={false}
                    onChange={(value) => {
                        if (value) {
                            onChange();

                            SortService.Update(value);
                        }
                    }}
                >
                    {sort.list.reduce<Map<number, string>>(
                        (accumulator, currentValue) => {
                            accumulator.set(currentValue.id, currentValue.name);

                            return accumulator;
                        },
                        new Map<number, string>(),
                    )}
                </Select>
            ) : (
                <DropDown
                    defaultValue={sort.value}
                    onChange={(value) => {
                        onChange();

                        SortService.Update(value);
                    }}
                >
                    {sort.list.reduce<Map<number, string>>(
                        (accumulator, currentValue) => {
                            accumulator.set(currentValue.id, currentValue.name);

                            return accumulator;
                        },
                        new Map<number, string>(),
                    )}
                </DropDown>
            );
        }
    }, [sort]);

    const onChange = () => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }

        setCurrentPage(1);
        setPageSize(12);
    };

    const {
        isLoading,
        isFetching,
        data: piece,
    } = PieceService.Entry({
        tag: categoryValue,
        currentPage,
        pageSize,
        fromPrice: range?.value[0],
        toPrice: range?.value[1],
        sort: sort?.value,
        property,
    });

    useEffect(() => {
        if (piece) {
            const T = () => {
                if (currentPage > 1 || pageSize >= piece.count) return;

                const { scrollTop, clientHeight, scrollHeight } =
                    document.documentElement;

                if (scrollTop + clientHeight >= scrollHeight - 45) {
                    setPageSize(pageSize + 12);
                }
            };

            window.addEventListener("scroll", T);

            return () => {
                window.removeEventListener("scroll", T);
            };
        }
    }, [piece]);

    if (rangeLoading || sortLoading || categoryLoading) return null;

    return (
        <main
            ref={ref}
            className="home-wrapper"
        >
            <Navigation />
            <div className="home">
                <div className="home__filter">
                    {isDesktop ? (
                        filterContainer
                    ) : (
                        <>
                            <div
                                className="filter__header"
                                onClick={() => setOpen(true)}
                            >
                                <span>Фильтры</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <title>tune-variant</title>
                                    <path d="M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z" />
                                </svg>
                            </div>
                            {open && (
                                <Model
                                    name="Фильтры"
                                    variant="stretch"
                                    onClose={() => setOpen(false)}
                                >
                                    <>
                                        {brickContainer}
                                        {filterContainer}
                                    </>
                                </Model>
                            )}
                        </>
                    )}
                </div>
                <div className="home__sort">{sortContainer}</div>
                <div className="home__separate" />
                {isDesktop && (
                    <div className="home__brick">{brickContainer}</div>
                )}
                <div className="home__piece">
                    {isLoading ? (
                        <Skeleton>
                            {Array.from({ length: 4 }, (_, i) => (
                                <div
                                    key={i}
                                    className="piece-card"
                                >
                                    <div className="piece-card__picture skeleton" />
                                    <div
                                        style={{ minHeight: "22px" }}
                                        className="piece-card__price skeleton"
                                    />
                                    <div
                                        style={{ minHeight: "44px" }}
                                        className="piece-card__info skeleton"
                                    />
                                    <div
                                        style={{ minHeight: "32px" }}
                                        className="piece-card__navbar skeleton"
                                    />
                                </div>
                            ))}
                        </Skeleton>
                    ) : (
                        piece?.list.map((piece) => (
                            <Card
                                key={piece.tag}
                                piece={piece}
                            />
                        ))
                    )}
                </div>
                {piece && (
                    <div className="home__pagination">
                        <Pagination
                            currentPage={currentPage}
                            pageSize={pageSize}
                            pageCount={Math.ceil(piece.count / pageSize)}
                            loading={isFetching}
                            onChange={(value) => setCurrentPage(value)}
                        />
                    </div>
                )}
            </div>
        </main>
    );
};

export default Home;
