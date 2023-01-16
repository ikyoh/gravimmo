import React, { useState, PropsWithChildren } from 'react'
import Menu from '../menu/Menu'
import { Modal } from '../../modal/Modal'
import MenuMobile from '../menu/MenuMobile'


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
            <div className='flex flex-col-reverse md:flex-row min-h-screen'>
                <div className='bg-purple-500 fixed bottom-0 w-full md:w-[110px] md:h-screen md:sticky md:top-0 z-10'>
                    <MenuMobile />
                    <Menu />
                </div>
                <div className='grow flex flex-col mb-24'>
                    {React.cloneElement(children, { handleCloseModal, handleOpenModal })}
                </div>
            </div>
        </>
    )
}

