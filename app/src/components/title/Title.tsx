import React from 'react';


interface TitleProps {
    label?: string;
}

export const Title = ({
    label = "syndics",
}: TitleProps) => {
    return (
        <div className='text-dark dark:text-white text-2xl uppercase font-bold '>
            {label}
        </div>
    )
}