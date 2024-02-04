const Table = ({ children }) => {
    return (
        <div className="px-5 md:px-10 relative mb-5 mt-8 md:mt-0">
            <table className="w-full table-fixed text-left border-collapse dark:bg-gradient-page bg-fixed rounded">
                {children}
            </table>
        </div>
    );
};

export default Table;
