import { orderStatusColor } from 'config/translations.config'
import { StatusColor } from 'components/dot/Dot'
import dayjs from 'dayjs'


export const generatePassword = (length = 8) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let password = ""
    for (let i = 0; i <= length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password
}

export const orderStatus = (status, date) => {
    if (status)
        return orderStatusColor[status]
    else {
        if (dayjs().diff(dayjs(date), 'day') > 7)
            return StatusColor.Error
        else
            return StatusColor.Action
    }
}