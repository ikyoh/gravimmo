import { MdClose } from "react-icons/md";
import { Button, ButtonSize } from "../button/Button";
import Header from "../templates/header/Header";


export const Modal = ({ title, children, handleCloseModal }) => {

    // const noClick = (e) => {
    //     e.stopPropagation()
    // }

    return (
        <div className="inset-0 z-[100] fixed h-screen w-screen md:bg-opacity-50 md:bg-black flex justify-center md:pt-[5em]">
            <div className="flex flex-col bg-white dark:bg-dark dark:bg-gradient-modal md:rounded rounded-none w-full md:w-[600px] h-full md:h-[700px] slide-modal scrollbar pl-6 pr-4">
                <Header title={title} isModal={true}>
                    <Button
                        isBorder={false}
                        size={ButtonSize.Big}
                        onClick={handleCloseModal}
                    >
                        <MdClose />
                    </Button>
                </Header>
                <div className="grow">
                    {children}
                </div>
            </div>
        </div>
    )
}



