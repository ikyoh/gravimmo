const FormError = ({ error }) => {
    return error ? (
        <span className="text-error text-sm mt-2">{error?.message}</span>
    ) : null;
};

export default FormError;
