import React from 'react'
import { useLocation } from "react-router-dom"
import { Button, ButtonSize } from '../../button/Button'
import ToggleMode from '../../togglemode/ToggleMode';
import {
    MdDashboard,
    MdOutlineCalculate,
    MdPendingActions,
    MdLogout,
    MdOutlineHomeWork,
    MdGroups,
    MdSupervisedUserCircle,
    MdOutlineDriveFileRenameOutline
} from "react-icons/md";
import { IoApps } from "react-icons/io5"


const MenuMobile = () => {

    const location = useLocation();

    return (
        <div className='md:hidden bg-sky-500 w-full'>
            <div className='flex flex-row h-[100px] items-start pt-2 justify-around'>
                <Button
                    isBorder={location.pathname === "/home"}
                    size={ButtonSize.Medium}
                    label='Accueil'
                >
                    <MdDashboard />
                </Button>
                <Button
                    size={ButtonSize.Medium}
                    isBorder={false}
                    label='Commandes'
                >
                    <MdPendingActions />
                </Button>
                <Button
                    isBorder={false}
                    size={ButtonSize.Medium}
                    label='Compta'
                >
                    <MdOutlineCalculate />
                </Button>
                <Button
                    isBorder={false}
                    size={ButtonSize.Medium}
                    label='Menu'
                >
                    <IoApps />
                </Button>
            </div>
        </div>
    )
}

export default MenuMobile