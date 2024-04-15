import classNames from "classnames";

const Content = ({ children, isModalContent = false }) => {
    const className = classNames({
        "text-white px-0 mt-3 mb-10 md:mb-auto flex flex-col gap-8": true,
        "md:mt-0 md:px-3 mx-5": !isModalContent,
        "md:mt-5 md:px-0 mx-0": isModalContent,
    });

    return <div className={className}>{children}</div>;
};

export default Content;
