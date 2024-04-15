import classNames from "classnames";
import Header from "components/templates/header/Header";
import { useState } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import KeyboardEventHandler from "react-keyboard-event-handler";

export const useModal = () => {
    const [modal, setModal] = useState({
        title: "",
        show: false,
        content: false,
        size: "full",
        isMenu: false,
        isPageContent: false,
    });

    const handleOpenModal = (props) => {
        setModal({
            ...modal,
            show: true,
            title: props.title,
            content: props.content,
            size: props.size || "full",
            isMenu: props.isMenu || false,
            isPageContent: props.isPageContent || false,
        });
    };

    const handleCloseModal = () => {
        setModal({ ...modal, show: false, content: false });
    };

    const className = classNames({
        "modal !bg-black/60 m-0 p-0 md:p-6": true,
        "modal-open": modal.show,
        "backdrop-blur-md ": modal.isMenu,
    });

    const modalClassName = classNames({
        "modal-box max-h-full md:shadow-md shadow-black rounded-none md:rounded-md p-0 bg-white scrollbar dark:bg-dark": true,
        "dark:bg-gradient-modal": !modal.isPageContent,
        "w-full md:w-11/12 max-w-5xl h-full": modal.size === "full",
        "w-[80vw] h-auto rounded-md p-0": modal.isMenu === true,
    });

    const Modal = () => {
        return createPortal(
            <div
                className={className}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onMouseUp={(e) => {
                    e.stopPropagation();
                }}
            >
                <KeyboardEventHandler
                    handleKeys={["esc"]}
                    handleFocusableElements={true}
                    onKeyEvent={(key, e) => handleCloseModal()}
                />

                <div
                    className={modalClassName}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseUp={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {modal.title && (
                        <Header title={modal.title} isModal={true}>
                            <button
                                onClick={handleCloseModal}
                                className="absolute right-0 top-5 md:top-3 text-dark dark:text-white p-0 md:p-2 text-4xl font-thin transition ease-in-out active:scale-[0.9] duration-100"
                            >
                                <MdClose />
                            </button>
                        </Header>
                    )}
                    <div
                        className={`relative h-full ${
                            !modal.isMenu && "px-5 pt-5}"
                        }`}
                    >
                        {modal.content}
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return {
        Modal,
        handleOpenModal,
        handleCloseModal,
    };
};
