import { useState } from 'react';
import { MdClose } from "react-icons/md";
import classNames from 'classnames';
import Header from 'components/templates/header/Header';

export const useModal = () => {

    const [modal, setModal] = useState({
        title: '',
        show: false,
        content: false
    })

    const handleOpenModal = (event) => {
        setModal({ ...modal, show: true, title: event.title, content: event.content })
    }

    const handleCloseModal = () => {
        setModal({ ...modal, show: false })
    }

    const className = classNames({
        "modal": true,
        "modal-open": modal.show,
    });

    const Modal = () => {
        return (
            <div className={className}>
                <div className="modal-box rounded-md w-11/12 max-w-5xl h-full p-0 bg-white dark:bg-dark dark:bg-gradient-modal scrollbar">
                        <Header title={modal.title} isModal={true}>
                            <button onClick={handleCloseModal} className="absolute right-0 top-3 text-primary p-2 text-4xl font-thin transition ease-in-out active:scale-[0.9] duration-100">
                                <MdClose />
                            </button>
                        </Header>
                    <div className='relative px-5 pt-5 h-full'>
                        {modal.content}
                    </div>
                </div>
            </div>
        )
    }

    return {
        Modal,
        handleOpenModal,
        handleCloseModal,
    }
}