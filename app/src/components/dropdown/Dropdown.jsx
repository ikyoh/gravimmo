import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from 'react-icons/bs'
import "./style.css"

const Dropdown = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex relative">
            <button
                className="relative rounded-full hover:bg-slate-400/10 p-1"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(true)
                }}
            >
                <BsThreeDotsVertical className='text-white/20 text-3xl' />
            </button>
            {isOpen && (
                <div className="dropdown"
                    onClick={(e) => { e.stopPropagation() }}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    )
}

export default Dropdown