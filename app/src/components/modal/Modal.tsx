import { PropsWithChildren } from "react"

type ModalProps = PropsWithChildren<{
    label?: string;
}>


export const Modal = ({
    label = "Valider",
    children
}: ModalProps) => {
    return (
        <div className="fixed bg-opacity-50 inset-0 z-50">
            <div className="w-full md:w-4/6 mx-auto mt-10 text-white md:rounded-xl p-3 md:p-0 h-[500px] background-gradient-modal">
                fdsfsd
                {children}
            </div>
        </div>
    )
}



