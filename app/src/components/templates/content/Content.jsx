import React from 'react'

const Content = ({children}) => {
    return (
        <div className='md:rounded text-white px-3 pb-3 mx-5 bg-white dark:bg-dark dark:bg-gradient-page bg-fixed sticky grow'>
            {children}
        </div>
    )
}

export default Content