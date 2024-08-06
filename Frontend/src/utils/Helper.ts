import { AxiosError } from "axios";

import API from "./API";

export function CN(...args: Array<string | boolean | undefined>): string {
    return args
        .filter((value): value is string => typeof value === "string")
        .join(" ");
}

export function getDeclension(
    count: number,
    N: [string, string, string],
): string {
    const T: number[] = [2, 0, 1, 1, 1, 2];

    return N[
        count % 100 > 4 && count % 100 < 20
            ? 2
            : T[count % 10 < 5 ? count % 10 : 5]
    ];
}

export function getCookie(name: string): string | undefined {
    let match = document.cookie.match(
        new RegExp(
            "(?:^|; )" +
                name.replace(/([.$?*|{}()\[\]\\\/+^])/g, "\\$1") +
                "=([^;]*)",
        ),
    );

    return match ? decodeURIComponent(match[1]) : undefined;
}

type Cookie = {
    expires: Date;
    secure: boolean;
    sameSite: "Lax" | "Strict" | "None";
};

export function setCookie(name: string, value: string, cookie: Cookie): void {
    let T = `${name}=${encodeURIComponent(value)}; path=/`;

    if (cookie.expires) {
        T += `; expires=${cookie.expires.toUTCString()}`;
    }

    if (cookie.secure) {
        T += "; Secure";
    }

    if (cookie.sameSite) {
        T += `; SameSite=${cookie.sameSite}`;
    }

    document.cookie = T;
}

export function toDate(min: number): Date {
    return new Date(new Date().getTime() + min * 60 * 1000);
}

export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface IPair {
    key: string;
    value: boolean;
}
