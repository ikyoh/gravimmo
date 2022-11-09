import React from 'react'
import { useLocation } from "react-router-dom"
import ReactLogo from '../../assets/logo-gravimmo.svg'
import { Button, ButtonSize } from '../button/Button'
import {
    MdDashboard,
    MdOutlineCalculate,
    MdPendingActions,
    MdLogout,
    MdOutlineHomeWork,
    MdGroups,
    MdOutlineDriveFileRenameOutline
} from "react-icons/md";
import { IoApps } from "react-icons/io5"
import ToggleMode from '../togglemode/ToggleMode';


const Menu = () => {

    const location = useLocation();

    return (
        <div className='bg-light dark:bg-dark h-full'>
            {/* MOBILE MENU */}
            <div className='lg:hidden flex flex-row h-[100px] items-start pt-2 justify-around bg-gradient-menu-mobile-light dark:bg-gradient-menu-mobile'>
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
            {/* COMPUTER MENU */}
            <div className='hidden lg:flex lg:flex-col items-center justify-between bg-gradient-menu-light dark:bg-gradient-menu h-full py-8'>
                <div className=''>
                    <img src={ReactLogo} alt="Logo" style={{ width: 80 }} />
                </div>
                <div className='flex flex-col gap-3'>
                    <Button
                        isBorder={location.pathname === "/dashboard"}
                        link='/dashboard'
                        size={ButtonSize.Big}
                    >
                        <MdDashboard />
                    </Button>
                    <Button
                        isBorder={location.pathname === "/orders"}
                        link='/orders'
                        size={ButtonSize.Big}
                    >
                        <MdPendingActions />
                    </Button>
                    <Button
                        isBorder={location.pathname === "/invoices"}
                        link='/invoices'
                        size={ButtonSize.Big}
                    >
                        <MdOutlineCalculate />
                    </Button>
                    <Button
                        isBorder={location.pathname === "/trustees"}
                        link='/trustees'
                        size={ButtonSize.Big}
                    >
                        <MdGroups />
                    </Button>
                    <Button
                        size={ButtonSize.Big}
                        isBorder={location.pathname === "/properties"}
                        link='/properties'
                    >
                        <MdOutlineHomeWork />
                    </Button>
                    <Button
                        size={ButtonSize.Big}
                        isBorder={location.pathname === "/services"}
                        link='/services'
                    >
                        <MdOutlineDriveFileRenameOutline />
                    </Button>
                </div>
                <div className='flex flex-col gap-3'>
                    <ToggleMode />
                    <Button
                        isBorder={false}
                        link='/'
                    >
                        <MdLogout />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Menu