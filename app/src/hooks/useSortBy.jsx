import { useState, useEffect } from 'react';

export const useSortBy = ({value, direction}) => {

    const handleSort = newValue => {
        setPreviousValue(sortValue)
        setValue(newValue)
        setUpdateHook(!updateHook)
    }

    const [updateHook, setUpdateHook] = useState(false)

    const [sortValue, setValue] = useState(value ? value : 'id')

    const [sortDirection, setDirection] = useState(direction ? direction : 'asc')

    const [previousValue, setPreviousValue] = useState('asc')

    useEffect(() => {
        if (sortValue === previousValue) setDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }, [updateHook])

    return {
        handleSort,
        sortValue,
        sortDirection
    }
}