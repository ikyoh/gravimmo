import Error from "../error/FormError";
import Label from "../label/FormLabel";

interface FormInputProps {
    name?: any;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: any;
    register?: any;
}

export const FormInput = ({
    name,
    label,
    register,
    error,
    required,
    type,
    placeholder,
    disabled = false,
}: FormInputProps) => (
    <div className="w-full mb-3">
        <Label name={name} label={label} required={required} />
        <input
            id={name}
            name={name}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            {...register(name)}
        />
        <Error error={error} />
    </div>
);
