import { useState, useEffect } from 'react';

export const useSortBy = () => {

    const [sortValue, setSortValue] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')


    return {
        setSortValue,
        sortValue,
        sortDirection
    }
}