export const NoDataFound = ({ withBackground = true }) => {
    return (
        <div
            className={`p-5 ${
                withBackground &&
                "mx-10 mt-5 md:mt-0 dark:bg-gradient-page bg-fixed rounded"
            }`}
        >
            Aucune donnée trouvée
        </div>
    );
};
