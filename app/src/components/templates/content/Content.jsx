const Content = ({ children }) => {
    return (
        <div className="text-white px-0 mt-3 mb-10 md:mb-auto md:mt-0 md:px-3 mx-0 md:mx-5 bg-fixed flex flex-col gap-8">
            {children}
        </div>
    );
};

export default Content;
