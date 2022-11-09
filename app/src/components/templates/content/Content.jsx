import React from 'react'

const Content = ({children}) => {
    return (
        <div className='md:my-5 md:rounded bg-white dark:bg-dark dark:md:bg-gradient-page text-white px-3 pb-3 scrollbar grow'>
            {children}
        </div>
    )
}

export default Content