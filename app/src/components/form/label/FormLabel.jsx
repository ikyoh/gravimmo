const FormLabel = ({ name, label, required = false }) => {
    return (
        <label htmlFor={name} className="text-dark dark:text-accent">
            {label}
            {required && " *"}
        </label>
    );
};

export default FormLabel;
