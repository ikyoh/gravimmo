import React, { useState, PropsWithChildren } from 'react'
import Menu from '../../menu/Menu'
import { Modal } from '../../modal/Modal'


export const Layout = ({ children }) => {

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


    const RenderModal = () => {

        if (!modal.show) return null
        else return (
            <Modal title={modal.title} handleCloseModal={handleCloseModal}>
                {modal.content}
            </Modal>
        )
    }

    return (
        <>
            <RenderModal />
            <div className='h-screen flex flex-col md:flex-row-reverse'>
                <div className='w-full md:pb-3 md:px-6 md:pt-10 flex flex-col grow'>
                    {React.cloneElement(children, { handleCloseModal, handleOpenModal })}
                </div>
                <div className='md:w-[110px] sticky bottom-0'>
                    <Menu />
                </div>
            </div>
        </>
    )
}

