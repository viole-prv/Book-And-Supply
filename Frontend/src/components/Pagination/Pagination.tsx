import React, { FC, useState } from "react";

import { CN } from "../../utils/Helper";
import Spinner from "../Loader/Spinner";

import "./Pagination.scss";

type Props = {
    currentPage: number;
    pageSize: number;
    pageCount: number;
    loading?: boolean;
    onChange: (value: number) => void;
};

const Pagination: FC<Props> = ({
    currentPage,
    pageSize,
    pageCount,
    loading,
    onChange,
}) => {
    const [minPage, setMinPage] = useState(0);
    const [maxPage, setMaxPage] = useState(pageSize);

    return (
        <div className="pagination-wrapper">
            {loading ? (
                <Spinner
                    size="small"
                    color="primary"
                />
            ) : (
                pageCount > 1 && (
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            onClick={() => {
                                if (currentPage > 1) {
                                    onChange(currentPage - 1);

                                    if ((currentPage - 1) % pageSize === 0) {
                                        setMaxPage(maxPage - pageSize);
                                        setMinPage(minPage - pageSize);
                                    }
                                }
                            }}
                        >
                            <title>chevron-left</title>
                            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                        </svg>
                        <ul className="pagination-container">
                            {minPage >= 1 && (
                                <li
                                    className="pagination"
                                    style={{ pointerEvents: "none" }}
                                >
                                    &hellip;
                                </li>
                            )}
                            {Array.from(
                                { length: pageCount + 1 },
                                (_, index) => {
                                    if (
                                        index < maxPage + 1 &&
                                        index > minPage
                                    ) {
                                        return (
                                            <li
                                                key={index}
                                                className={CN(
                                                    "pagination",
                                                    index === currentPage &&
                                                        "pagination-current",
                                                )}
                                                onClick={() => onChange(index)}
                                            >
                                                {index}
                                            </li>
                                        );
                                    }
                                },
                            )}
                            {pageCount > maxPage && (
                                <li
                                    className="pagination"
                                    style={{ pointerEvents: "none" }}
                                >
                                    &hellip;
                                </li>
                            )}
                        </ul>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            onClick={() => {
                                if (currentPage < pageCount) {
                                    onChange(currentPage + 1);

                                    if (currentPage + 1 > maxPage) {
                                        setMaxPage(maxPage + pageSize);
                                        setMinPage(minPage + pageSize);
                                    }
                                }
                            }}
                        >
                            <title>chevron-right</title>
                            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                    </>
                )
            )}
        </div>
    );
};

export default Pagination;
