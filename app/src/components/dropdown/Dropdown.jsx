import classNames from "classnames";
import { Button, ButtonSize } from "components/button/Button";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import "./style.css";

const Dropdown = ({ type = "card", isDisabled, children, icon }) => {
    const className = classNames({
        "absolute top-3 -right-1": type === "card",
        "absolute top-2 -right-1": type === "table",
        "absolute top-4 right-0": type === "tour",
    });

    const classNameContent = classNames(
        "dropdown-content z-[1] bg-slate-400 dark:bg-primary rounded w-64 pr-2",
        {
            "translate-x-1 -translate-y-[10px]": type === "card",
            "translate-x-1 -translate-y-2": type === "table",
            "!fixed md:!absolute left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-2 top-36 md:translate-y-1":
                type === "button",
        }
    );

    if (type === "button")
        return (
            <div className="dropdown md:dropdown-left">
                <label tabIndex={0}>
                    <Button disabled={isDisabled} size={ButtonSize.Big}>
                        {icon ? icon : <BsThreeDots />}
                    </Button>
                </label>
                <div tabIndex={0} className={classNameContent}>
                    {children}
                </div>
            </div>
        );

    return (
        <div className={className}>
            <div className="dropdown dropdown-left dropdown-start group">
                <label
                    tabIndex={0}
                    className="btn btn-circle btn-sm bg-transparent border-none hover:bg-transparent"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseUp={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <BsThreeDotsVertical className="dark:text-white/20 text-dark/20 text-3xl group-hover:text-accent" />
                </label>
                {!isDisabled && (
                    <div
                        tabIndex={0}
                        className={classNameContent}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        onMouseUp={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
