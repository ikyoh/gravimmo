import type { PropsWithChildren } from 'react';
import { Title } from '../title/Title'
import classNames from 'classnames'


type HeaderProps = PropsWithChildren<{
    title: string;
    isModal?: boolean,
    isLoading?: boolean,
    isError?: boolean,
    error: { message?: string }
}>

const Header = ({ title, children, isModal = false, isLoading, error }: HeaderProps) => {

    const headerClassName = classNames("flex flex-row justify-between items-center sticky top-0 mx-6 md:mx-0 flex-none",
        {
            "dark:bg-dark dark:bg-gradient-modal-header border-b border-slate-600 py-4": isModal,
            "bg-white md:bg-light dark:bg-dark border-b border-slate-600 md:border-0 h-20": !isModal,
        })

    return (
        <div className={headerClassName}>
            <div className='flex items-center gap-6'>
                <Title title={title} isLoading={isLoading} />
                {error ? "Error : " + error.message : null}    
            </div>
            <div className="flex flex-row gap-3 items-center">
                {children}
            </div>
        </div>
    )
}

export default Header