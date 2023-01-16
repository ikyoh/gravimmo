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


const Menu = () => {

    const location = useLocation();

    return (
        <div className='hidden md:block bg-light dark:bg-dark h-full md:w-[110px]'>
            <div className='lg:flex lg:flex-col items-center justify-between bg-gradient-menu-light dark:bg-gradient-menu h-full py-12'>
                <div className=''>
                    <svg className="fill-dark dark:fill-white" width="50" height="50" viewBox="0 0 89 89" xmlns="http://www.w3.org/2000/svg">
                        <path d="M87.1407 32.1028C86.3561 32.0642 85.5132 32.0194 85.0705 32.0194C79.1437 32.0194 74.5299 33.7295 71.2292 37.1505C69.0167 39.4315 67.4795 42.3171 66.5816 45.7908C66.5124 46.0817 66.4857 46.4937 66.4252 46.8113V36.2353C66.4252 35.1244 66.1901 34.1958 66.1209 33.1375C67.6989 30.2904 69.4397 28.0826 71.3495 26.6272C74.7925 24.0491 78.7624 22.8029 83.1552 22.615C81.2139 19.1869 78.966 15.8877 76.0435 12.966C60.1429 -2.93454 35.3168 -4.14774 17.8438 8.97965C22.5519 5.83933 27.9094 4.21649 33.9519 4.21649C39.3424 4.21649 44.3706 5.59873 49.07 8.32862C55.1769 11.8739 59.1082 17.1292 61.3098 23.7425C61.938 25.6263 62.4451 27.6061 62.7565 29.74C62.9153 30.8353 63.0159 31.9777 63.0906 33.1375C63.1606 34.1966 63.3957 35.1251 63.3957 36.2353V60.7894C63.3957 63.4069 63.1559 65.8184 62.7565 68.093C61.8837 73.0582 59.9731 77.1248 57.1953 80.4357C56.5725 81.1787 56.0277 81.9886 55.309 82.6483C51.8314 85.7862 47.7326 87.8203 43.1361 88.9784C55.0055 89.3425 66.9842 85.1037 76.0427 76.046C87.9529 64.1358 91.5163 47.2139 87.1392 32.1028H87.1407ZM65.7867 80.4365H60.2263C63.0034 77.1248 64.914 73.0582 65.7867 68.0922V80.4365Z" />
                        <path d="M49.5558 74.0762C51.2022 72.0885 52.1952 69.5733 52.7692 66.6956C52.8093 66.4951 52.9595 66.385 52.9941 66.1806C53.2701 64.4689 53.4084 62.0684 53.4092 59.0099V37.5316C53.4084 35.6989 52.9768 34.3103 52.7692 32.693C52.1245 27.6711 50.8075 23.3428 48.1554 20.3904C44.3201 16.1918 39.5325 14.083 33.8306 14.083C28.4054 14.083 23.8608 16.018 20.2314 19.8887C16.5171 23.8114 14.6678 28.5117 14.6686 33.9722C14.6678 39.1207 16.4133 43.5961 19.9389 47.3811C23.6886 51.4248 28.3354 53.4455 33.884 53.4463C37.478 53.4463 40.8125 52.513 43.8711 50.6291C45.218 49.765 47.0326 48.3482 49.3144 46.344V56.8154C46.4626 58.9753 44.1133 60.4613 42.2813 61.2735C39.343 62.6212 36.1823 63.295 32.7943 63.295C28.9927 63.295 25.2957 62.5009 21.6671 60.9111C18.0558 59.3212 14.9108 57.0922 12.2155 54.242C6.9106 48.6085 4.26641 41.904 4.2672 34.0941C4.2672 28.01 5.8523 22.5825 9.00677 17.813C-4.14893 35.2876 -2.94595 60.1358 12.9656 76.0466C13.8352 76.9154 14.8369 77.5444 15.7576 78.3275C22.0964 80.1697 27.7268 81.1109 32.6056 81.1109C40.0703 81.1109 45.7204 78.7607 49.5565 74.0778L49.5558 74.0762Z" />
                    </svg>
                </div>
                <div className='flex flex-col gap-3'>
                    <Button
                        isBorder={location.pathname.includes("/dashboard")}
                        link='/dashboard'
                        size={ButtonSize.Big}
                        info="Tableau de bord"
                    >
                        <MdDashboard />
                    </Button>
                    <Button
                        isBorder={location.pathname.includes("/orders")}
                        link='/orders'
                        size={ButtonSize.Big}
                        info="Commandes"
                    >
                        <MdPendingActions />
                    </Button>
                    <Button
                        isBorder={location.pathname.includes("/invoices")}
                        link='/invoices'
                        size={ButtonSize.Big}
                        info="Factures"
                    >
                        <MdOutlineCalculate />
                    </Button>
                    <Button
                        isBorder={location.pathname.includes("/trustees")}
                        link='/trustees'
                        size={ButtonSize.Big}
                        info="Syndics"
                    >
                        <MdSupervisedUserCircle />
                    </Button>
                    <Button
                        isBorder={location.pathname.includes("/contacts")}
                        link='/contacts'
                        size={ButtonSize.Big}
                        info="Contacts"
                    >
                        <MdGroups />
                    </Button>
                    <Button
                        size={ButtonSize.Big}
                        isBorder={location.pathname.includes("/properties")}
                        link='/properties'
                        info="Copropriétés"
                    >
                        <MdOutlineHomeWork />
                    </Button>
                    <Button
                        size={ButtonSize.Big}
                        isBorder={location.pathname === "/services"}
                        link='/services'
                        info="Prestations"
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