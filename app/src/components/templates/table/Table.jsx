import classNames from "classnames";

const Table = ({ children, width = "auto" }) => {
    const className = classNames(
        "w-full text-left border-collapse bg-gradient-to-br from-purple-500/30 to-accent/30 dark:bg-gradient-page bg-fixed rounded",
        {
            "table-auto": width === "auto",
            "table-fixed": width === "fixed",
        }
    );

    return (
        <div className="px-5 md:px-10 relative mb-5 mt-8 md:mt-0">
            <table className={className}>{children}</table>
        </div>
    );
};

export default Table;
