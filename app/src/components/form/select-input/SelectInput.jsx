import uuid from "react-uuid";

import { useGetAllDatas } from "queryHooks/useService";
import Error from "../error/FormError";
import Label from "../label/FormLabel";

export const SelectInput = ({
    name,
    label,
    register,
    error,
    required,
    type,
    placeholder,
    validationSchema,
    setValue,
}) => {
    const { data = [], isLoading } = useGetAllDatas();

    const uniqCategories = () => {
        return data
            .reduce(
                (unique, item) =>
                    unique.includes(item.category)
                        ? unique
                        : [...unique, item.category],
                []
            )
            .sort();
    };

    return (
        <div className="w-full mb-2">
            <Label name={name} label={label} required={required} />
            <div className="flex gap-3 items-center">
                <input
                    id={name}
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    {...register(name, validationSchema)}
                />

                {!isLoading && data.length >= 1 ? (
                    <select
                        className="mt-2"
                        name="cat"
                        id="cat"
                        onChange={(e) => setValue(name, e.target.value)}
                    >
                        <option value="">Catégories</option>
                        {uniqCategories().map((item) => (
                            <option key={uuid()} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                ) : null}
            </div>
            <Error error={error} />
        </div>
    );
};
