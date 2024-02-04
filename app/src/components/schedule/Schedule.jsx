import React, { useState } from 'react'
import { Button, ButtonSize } from 'components/button/Button'
import { MdPendingActions } from 'react-icons/md'
import Calendar from 'react-calendar'
import { useGetDate, usePostData, usePutData } from 'queryHooks/useTour'

export const Schedule = ({ commands }) => {

    const [date, setDate] = useState(new Date())
    const { data } = useGetDate(date)
    const { mutate: putData } = usePutData()
    const { mutate: postData } = usePostData()

    // return an array of IRIs 
    const _commands = commands.reduce(
        (acc, curr) => [...acc, curr["@id"]], []
    )

    const handleSchedule = () => {
        if (data['hydra:totalItems'] !== 0) {
            putData({ id: data['hydra:member'][0].id, commands: _commands, positions: _commands })
        }
        if (data['hydra:totalItems'] === 0) {
            postData({ scheduledAt: date, commands: _commands, positions: _commands })
        }
    }

    if (commands.length === 0) return (
        <Button
            disabled={true}
            size={ButtonSize.Big}
        >
            <MdPendingActions />
        </Button>
    )
    return (
        <div className="dropdown dropdown-left">
            <label tabIndex={0}>
                <Button
                    size={ButtonSize.Big}
                >
                    <MdPendingActions />
                </Button>
            </label>
            <div tabIndex={0} className="dropdown-content card card-compact p-2 bg-slate-400 dark:bg-primary rounded w-96 -translate-x-2 translate-y-1">
                <div className="card-body items-center text-center">
                    <h4 className="card-title">Date de la tournée</h4>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        className={"text-dark dark:text-white"}
                        maxDetail='month'
                        minDetail='month'
                        view='month'
                    />
                    <button
                        className='btn btn-sm btn-primary mt-5'
                        onClick={() => handleSchedule()}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    )
}

