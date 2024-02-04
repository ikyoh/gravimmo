import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { Title } from "../title/Title";

type HeaderProps = PropsWithChildren<{
    title: string;
    subtitle?: string;
    isModal?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    error: { message?: string };
}>;

const Header = ({
    title,
    subtitle,
    children,
    isModal = false,
    isLoading,
    error,
}: HeaderProps) => {
    const headerClassName = classNames(
        "flex flex-row justify-between items-center sticky top-0 mx-6 md:mx-0 flex-none z-10",
        {
            "bg-white dark:bg-dark dark:bg-gradient-modal-header border-b border-slate-600 py-5 md:mx-5":
                isModal,
            "px-5 md:px-10 border-b border-slate-600 md:border-0 h-32 bg-light dark:bg-dark":
                !isModal,
        }
    );

    return (
        <div className={headerClassName}>
            <div className="flex items-center gap-6">
                <Title title={title} isLoading={isLoading} />
                {error ? "Error : " + error.message : null}
                {subtitle && (
                    <div className="chat chat-start">
                        <div className="chat-bubble !max-w-none">
                            <div className="mt-0.5">{subtitle}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-3 items-center">{children}</div>
        </div>
    );
};

export default Header;
