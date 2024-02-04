import React from 'react'
import { useGetOneData, usePutData } from 'queryHooks/useCommand'
import { Dot } from 'components/dot/Dot'
import { statusColor } from 'config/translations.config'
import { useModal } from 'hooks/useModal'
import { CommandForm } from 'components/forms/command/CommandForm'
import dayjs from 'dayjs'

export const CommandDropdown = ({ commandID }) => {

    const { data, isLoading } = useGetOneData(commandID)
    const { mutate: putData } = usePutData()
    const { Modal, handleOpenModal, handleCloseModal } = useModal()

    if (isLoading) return null
    return (
        <>
            <Modal />
            <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-auto z-50">

                <button
                    onClick={() => handleOpenModal({ title: "édition de la commande", content: <CommandForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
                    Modifier la commande
                </button>
                {
                    data.trackingEmail &&
                    <a href={data.trackingEmail} target="_blank">
                        Email de commande
                    </a>
                }

                <div>Status</div>

                <button
                    onClick={() => putData({ id: data.id, status: 'préparé', madeAt: dayjs() })}
                    disabled={data.status === 'préparé' || data.status === 'posé'}>
                    <Dot color={statusColor["préparé"]} />Préparé
                </button>

                <button
                    onClick={() => putData({ id: data.id, status: 'posé', deliveredAt: dayjs() })}
                    disabled={data.status === 'posé'}
                >
                    <Dot color={statusColor["posé"]} /> Posé
                </button>

                <button
                    onClick={() => putData({ id: data.id, isHanging: !data.isHanging })}
                >
                    <Dot color={statusColor["bloqué"]} /> Bloqué
                </button>

                <button
                    onClick={() => putData({ id: data.id, status: 'annulé' })}
                    disabled={data.status === 'annulé' || data.status === 'posé'}
                >
                    <Dot color={statusColor["annulé"]} /> Annulé
                </button>
            </div>
        </>
    )
}
