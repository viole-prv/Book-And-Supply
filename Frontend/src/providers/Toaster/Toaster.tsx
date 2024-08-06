import React, {
    createContext,
    FC,
    useContext,
    useEffect,
    useState,
} from "react";

import "./Toaster.scss";

export interface IList {
    tag: number;
    message: string;
}

type T = {
    add: (message: string) => void;
    remove: (id: number) => void;
    list: IList[];
};

export const Context = createContext<T>({
    add: () => null,
    remove: () => null,
    list: [],
});

type ToasterProvider = {
    children: React.ReactNode;
};

export const ToasterProvider: FC<ToasterProvider> = ({ children }) => {
    const [list, setList] = useState<IList[]>([]);

    const add = (message: string) =>
        setList((toast) => [...toast, { tag: Date.now(), message }]);

    const remove = (tag: number) =>
        setList(list.filter((toast) => toast.tag !== tag));

    return (
        <Context.Provider value={{ add, remove, list }}>
            {children}
        </Context.Provider>
    );
};

type Toaster = {
    message: string;
    onClose: () => void;
};

const Toast: FC<Toaster> = ({ message, onClose }) => {
    useEffect(() => {
        const T = setTimeout(onClose, 5000);

        return () => clearTimeout(T);
    }, [onClose]);

    return (
        <div className="toaster">
            <span className="toaster__name">{message}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="toaster__icon"
                onClick={onClose}
            >
                <title>close</title>
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
        </div>
    );
};

export const Toaster: FC = () => {
    const { remove, list } = useContext(Context);

    return (
        <div className="toaster-container">
            {list.map((toast) => (
                <Toast
                    key={toast.tag}
                    message={toast.message}
                    onClose={() => remove(toast.tag)}
                />
            ))}
        </div>
    );
};
