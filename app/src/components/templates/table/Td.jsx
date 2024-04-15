const Td = ({ label, text, children, isTextUppercase = false }) => {
    return (
        <td className="pl-2 pr-2 first:pl-5 relative">
            <div className="flex items-center relative min-h-12">
                {label ? (
                    <span className="inline-block w-5/12 md:hidden text-sm text-indigo-300">
                        {label}
                    </span>
                ) : null}
                {children}
                <p
                    className={`overflow-hidden leading-none ${
                        isTextUppercase && "first-letter:uppercase"
                    }`}
                >
                    {text}
                </p>
            </div>
        </td>
    );
};

export default Td;
