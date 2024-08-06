import React, { FC, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Context as Toaster } from "../../providers/Toaster/Toaster";
import API from "../../utils/API";
import { CN } from "../../utils/Helper";
import Point from "../Loader/Point";

import "./DragDrop.scss";

type Props = {
    className?: string;
    onChange: (value: string) => void;
};

const DragDrop: FC<Props> = ({ className, onChange }) => {
    const { add } = useContext(Toaster);

    const [active, setActive] = useState(false);

    const { isPending, mutate } = useMutation({
        mutationFn: (data: FormData) => API.post("/api/imgur", data),
        onSuccess: (response) => {
            onChange(response.data);
        },
        onError: () => add("Не удалось загрузить изображение."),
    });

    const onFileList = (fileList: FileList) => {
        const file = fileList[0];

        if (file === undefined) return;

        const extension = file.name.split(".").pop();

        if (
            !extension ||
            !["jpeg", "jpg", "gif", "png", "apng", "tiff"].includes(
                extension.toLowerCase(),
            )
        ) {
            add("Не удается загрузить файл.");

            return;
        }

        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            if (reader.result) {
                const T = new FormData();
                T.append("file", new Blob([reader.result]));

                mutate(T);
            }
        };
    };

    return (
        <label
            htmlFor="browse"
            className={CN("drag-drop", active && "drag-drop-active", className)}
            onDragEnter={() => setActive(true)}
            onDragLeave={(e: React.DragEvent<HTMLLabelElement>) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) {
                    return;
                }

                setActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e: React.DragEvent<HTMLLabelElement>) => {
                e.preventDefault();

                if (e.dataTransfer.files) {
                    onFileList(e.dataTransfer.files);
                }

                setActive(false);
            }}
        >
            <input
                id="browse"
                type="file"
                disabled={isPending}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                        onFileList(e.target.files);
                    }
                }}
            />
            <div className="drag-drop__icon">
                {isPending ? (
                    <Point />
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <title>upload</title>
                        <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                    </svg>
                )}
            </div>
        </label>
    );
};

export default DragDrop;
