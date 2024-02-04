import React from 'react'
import { Dot, StatusColor } from 'components/dot/Dot'
import { statusColor, userStatus as translateStatus } from 'config/translations.config'

const UserStatus = ({ status }) => {

    return (
        <div className='flex items-center gap-2'>
            <Dot color={statusColor[status]} />
            <span className={"first-letter:uppercase"}>{translateStatus[status]}</span>
        </div>
    )
}

export default UserStatus