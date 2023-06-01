import React from 'react'
import { Dot, StatusColor } from 'components/dot/Dot'
import { orderStatusColor } from 'config/translations.config'
import dayjs from 'dayjs'
import { RiLockFill } from 'react-icons/ri'

const OrderStatus = ({ status, isHanging, date }) => {
    if (status)
        return (
            <div className='flex items-center gap-1'>
                {isHanging
                    ? <Dot color={orderStatusColor['bloqué']} />
                    : <Dot color={orderStatusColor[status]} />
                }
                <p className={`first-letter:uppercase ${isHanging && "mr-3"}`}>{status}</p>
                {isHanging && <RiLockFill size={16} className='absolute right-0' />}
            </div>
        )
    else {
        if (dayjs().diff(dayjs(date), 'day') > 7)
            return (
                <div className='flex items-center gap-1'>
                    <Dot color={StatusColor.Error} />
                    En retard
                </div>
            )
        else
            return (
                <div className='flex items-center gap-1'>
                    <Dot color={StatusColor.Action} />
                    En cours
                </div>
            )
    }
}

export default OrderStatus