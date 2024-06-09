import { StatusColor } from "components/dot/Dot";
import { statusColor } from "config/translations.config";
import dayjs from "dayjs";

export const generatePassword = (length = 8) => {
    const chars =
        "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    for (let i = 0; i <= length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
};

export const commandStatus = (status, date) => {
    if (status) return statusColor[status];
    else {
        if (dayjs().diff(dayjs(date), "day") > 7) return StatusColor.Error;
        else return StatusColor.Action;
    }
};

export const removeDuplicates = (array) => {
    return array.reduce(
        (accumulator, currentValue) =>
            accumulator.includes(currentValue)
                ? accumulator
                : [...accumulator, currentValue],
        []
    );
};

// return an array of IRIs
export const arrayOfIris = (array) => {
    return array.reduce(
        (accumulator, currentValue) => [...accumulator, currentValue["@id"]],
        []
    );
};

export const arrayOfIds = (array) => {
    return array.reduce(
        (accumulator, currentValue) => [...accumulator, currentValue.id],
        []
    );
};

export const roundPrice = (price) => {
    return Math.round((price + Number.EPSILON) * 100) / 100;
};

export const deepClone = (clone) => {
    return JSON.parse(JSON.stringify(clone));
};

export const price = (number) => {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(number);
};
