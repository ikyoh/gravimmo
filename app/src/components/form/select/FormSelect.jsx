import Error from "../error/FormError";
import Label from "../label/FormLabel";

export const FormSelect = ({
    name,
    label,
    register,
    error,
    required,
    placeholder,
    validationSchema,
    children,
    defaultValue,
    onChange,
}) => (
    <div className="w-full mb-3">
        <Label name={name} label={label} required={required} />
        <select
            id={name}
            name={name}
            placeholder={placeholder}
            {...register(name, validationSchema)}
            onChange={onChange}
        >
            {children}
        </select>
        <Error error={error} />
    </div>
);
