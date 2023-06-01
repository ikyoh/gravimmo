import React from 'react'
import { usePutData } from 'queryHooks/useOrder'
import { Dot } from 'components/dot/Dot'
import { orderStatusColor } from 'config/translations.config'
import { useModal } from 'hooks/useModal'
import OrderForm from 'components/forms/order/OrderForm'
import dayjs from 'dayjs'

export const OrderDropdown = ({ orderID, status, isHanging }) => {

    const { mutate: putData } = usePutData()
    const { Modal, handleOpenModal, handleCloseModal } = useModal()

    return (
        <>
            <Modal />
            <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-auto">
                {status !== 'facturé' && status !== 'posé' && status !== 'annulé' &&
                    <>
                        <button
                            onClick={() => handleOpenModal({ title: "édition de la commande", content: <OrderForm id={orderID} handleCloseModal={handleCloseModal} /> })}>
                            Modifier la commande
                        </button>

                        <div>Status</div>

                        <button
                            onClick={() => putData({ id: orderID, status: 'préparé', madeAt: dayjs() })}
                            disabled={status === 'préparé' || status === 'posé'}>
                            <Dot color={orderStatusColor["préparé"]} />Préparé
                        </button>

                        <button
                            onClick={() => putData({ id: orderID, status: 'posé', deliveredAt: dayjs() })}
                            disabled={status === 'posé'}
                        >
                            <Dot color={orderStatusColor["posé"]} /> Posé
                        </button>

                        <button
                            onClick={() => putData({ id: orderID, isHanging: !isHanging })}
                        >
                            <Dot color={orderStatusColor["bloqué"]} /> Bloqué
                        </button>

                        <button
                            onClick={() => putData({ id: orderID, status: 'annulé' })}
                            disabled={status === 'annulé' || status === 'posé'}
                        >
                            <Dot color={orderStatusColor["annulé"]} /> Annulé
                        </button>
                    </>
                }
            </div>
        </>
    )
}
