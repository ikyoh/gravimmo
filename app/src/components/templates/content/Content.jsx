import React from 'react'
import './style.css'

const Content = ({ children }) => {
    return (
        <div className='text-white px-3 pb-3 mx-5 bg-white dark:bg-dark dark:bg-gradient-page bg-fixed grow rounded'>
            <div>{children}</div>
        </div>
    )
}

export default Content