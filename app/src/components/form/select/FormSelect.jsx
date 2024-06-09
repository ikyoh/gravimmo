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
    onChange,
}) => {
    return (
        <div className="w-full mb-3">
            <Label name={name} label={label} required={required} />
            <select
                // id={name}
                // name={name}
                placeholder={placeholder}
                //{...register(name, validationSchema)}
                {...register(name, {
                    validationSchema: validationSchema,
                    onChange: onChange,
                })}
            >
                {children}
            </select>
            <Error error={error} />
        </div>
    );
};
