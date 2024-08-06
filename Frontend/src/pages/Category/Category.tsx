import React, { FC } from "react";
import { Link } from "react-router-dom";

import Grid from "../../components/Grid/Grid";
import PieceService from "../../services/piece.service";

import "./Category.scss";

const Category: FC = () => {
    const { isLoading, data: bannerList } = PieceService.Banner();

    if (isLoading) return null;

    return (
        <main className="category-wrapper">
            <div className="category-container">
                {bannerList?.map((banner) => {
                    return (
                        <div
                            key={banner.tag}
                            className="category"
                        >
                            <Link
                                to={banner.tag}
                                className="category__header"
                            >
                                {banner.tag}
                            </Link>
                            <div className="category__banner">
                                <Grid list={banner.list} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default Category;
