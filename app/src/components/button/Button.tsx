import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import classNames from "classnames";
import { MdAdd } from "react-icons/md";



export enum ButtonSize {
    Small = 'small',
    Medium = 'medium',
    Big = 'big',
}


export type ButtonProps = PropsWithChildren<{
    isBorder?: boolean,
    size?: ButtonSize;
    link?: string;
    label?: string;
    info?: string;
    onClick?: () => void;
}>

export const Button = ({
    isBorder = true,
    size = ButtonSize.Medium,
    children = <MdAdd />,
    onClick,
    link,
    label,
    info,
    ...otherProps
}: ButtonProps) => {

    const buttonClassName = classNames("flex items-center justify-center p-0.5 rounded-full focus:ring-2 focus:ring-accent ring-offset-2 ring-offset-dark dark:focus:ring-accent group",
        {
            "bg-gradient-to-br from-purple-500 to-accent": isBorder,
            "h-8 w-8": size === ButtonSize.Small,
            "h-14 w-14": size === ButtonSize.Big,
            "h-10 w-10": size === ButtonSize.Medium,
        })

    const iconClassName = classNames("w-full h-full flex items-center justify-center transition-all ease-in duration-75 dark:text-white text-dark group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-accent rounded-full dark:bg-dark bg-light",
        {
            "text-2xl": size === ButtonSize.Small,
            "text-3xl": size === ButtonSize.Medium,
            "text-4xl": size === ButtonSize.Big,
        })


    if (link)
        return (
            <div className='group flex flex-col md:flex-row items-center justify-center relative'>
                <Link to={link} className={buttonClassName} {...otherProps}>
                    <div className={iconClassName}>
                        {children}
                    </div>
                </Link>
                {label ?
                    <div className='dark:text-white text-dark text-xs mt-2 md:hidden'>
                        {label}
                    </div>
                    : null
                }
                {info &&
                    <div className='absolute z-10 left-[64px] text-white p-3 bg-dark rounded hidden group-hover:block'>
                        {info}
                    </div>
                }
            </div >
        )

    return (
        <div className='flex flex-col md:flex-row items-center justify-center'>
            <button type='button' onClick={onClick} className={buttonClassName} {...otherProps}>
                <div className={iconClassName}>
                    {children}
                </div>
            </button>
            {label ?
                <div className='dark:text-white text-dark text-xs mt-2 md:hidden'>
                    {label}
                </div>
                : null
            }
        </div>
    )
}