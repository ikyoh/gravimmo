import React from 'react'
import classNames from 'classnames'


const CardsContainer = ({ aside = false, children, cols = 4, className }) => {

    const _className = classNames("flex flex-col md:flex-row gap-8", className)

    return (
        <div className={_className}>
            <div className={`grow grid grid-cols-1 gap-8 ${aside ? "md:grid-cols-" + (cols - 1) : "md:grid-cols-" + cols}`}>
                {children}
            </div>
            {aside &&
                <div className='md:w-1/4'>
                    {aside}
                </div>
            }
        </div>
    )
}

export default CardsContainer