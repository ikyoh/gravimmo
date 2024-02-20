import { useModal } from "hooks/useModal";
import { IoApps } from "react-icons/io5";
import { Button, ButtonSize } from "../../button/Button";
import Menu from "../menu/Menu";

const MenuMobile = () => {
    const { Modal, handleOpenModal, handleCloseModal } = useModal();

    return (
        <div className="md:hidden bg-dark w-full sticky bottom-0">
            <Modal />
            <div className="flex flex-row h-16 items-start pt-2 justify-around">
                <Button
                    isBorder={false}
                    size={ButtonSize.big}
                    onClick={() =>
                        handleOpenModal({
                            isMenu: true,
                            content: (
                                <Menu handleCloseModal={handleCloseModal} />
                            ),
                        })
                    }
                >
                    <IoApps />
                </Button>
            </div>
        </div>
    );
};

export default MenuMobile;
