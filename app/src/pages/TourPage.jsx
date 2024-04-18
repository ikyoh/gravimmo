import { Button, ButtonSize } from "components/button/Button";
import { CardTour } from "components/cards/tour/CardTour";
import Dropdown from "components/dropdown/Dropdown";
import TourForm from "components/forms/tour/TourForm";
import Loader from "components/loader/Loader";
import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import dayjs from "dayjs";
import useMakeInvoices from "hooks/useMakeInvoices";
import { useModal } from "hooks/useModal";
import _ from "lodash";
import { usePutData as usePutCommand } from "queryHooks/useCommand";
import { useGetOneData, usePutData } from "queryHooks/useTour";
import { useEffect, useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdArrowBack, MdPendingActions } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { arrayOfIris } from "utils/functions.utils";

import { Reorder } from "framer-motion";

export const TourPage = () => {
    const navigate = useNavigate();
    const { state: previousPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    const { id } = useParams();
    const { data = [], isLoading, error, isSuccess } = useGetOneData(id);

    const {
        setCommands: setInvoiceCommands,
        isLoading: isLoadingMakeInvoices,
    } = useMakeInvoices();

    const [commands, setCommands] = useState([]);

    const { mutate } = usePutData();
    const { mutate: updateCommand } = usePutCommand();

    useEffect(() => {
        if (isSuccess && data && data.positions.length === 0)
            setCommands(arrayOfIris(data.commands));
        if (isSuccess && data && data.positions.length !== 0)
            setCommands(data.positions);
    }, [isSuccess]);

    const handleSaveOrder = () => {
        mutate({ id: id, positions: commands });
    };

    const handleChangeCommandsStatus = async (status) => {
        await Promise.all(
            data.commands.map(async (command) => {
                if (
                    command.status === "facturé" ||
                    command.status === "DEFAULT - posé"
                )
                    return;
                const _command = { id: command.id, status: status };
                if (
                    status === "DEFAULT - préparé" &&
                    command.status === "DEFAULT - à traiter"
                )
                    _command.deliveredAt = dayjs();
                if (status === "DEFAULT - posé") _command.deliveredAt = dayjs();
                updateCommand(_command);
            })
        );
    };

    if (isLoading) return <Loader />;
    else
        return (
            <>
                <Modal />
                <Header
                    title={"Tournée #" + data.id}
                    subtitle={
                        dayjs(data.scheduledAt).format("dddd D MMMM YYYY") +
                        " - " +
                        data.user.firstname +
                        " " +
                        data.user.lastname
                    }
                    isLoading={isLoading}
                    error={error}
                >
                    {data.status !== "facturé" && (
                        <Dropdown type="button">
                            <button
                                onClick={() =>
                                    handleChangeCommandsStatus(
                                        "DEFAULT - préparé"
                                    )
                                }
                            >
                                <IoIosCheckmarkCircleOutline size={30} />
                                Valider la préparation
                            </button>
                            <button>
                                <IoIosCheckmarkCircleOutline size={30} />
                                Valider la pose
                            </button>
                            <button>
                                <IoIosCheckmarkCircleOutline size={30} />
                                Facturer
                            </button>
                            <button>
                                <IoIosCheckmarkCircleOutline size={30} />
                                Reporter la tournée
                            </button>
                            <button>
                                <IoIosCheckmarkCircleOutline size={30} />
                                Annuler la tournée
                            </button>
                            {commands.some(
                                (command) =>
                                    command.status === "DEFAULT - à traiter"
                            ) && (
                                <button>
                                    <IoIosCheckmarkCircleOutline size={30} />
                                    Valider la préparation
                                </button>
                            )}
                            {commands.some(
                                (command) =>
                                    command.status === "DEFAULT - préparé"
                            ) && (
                                <button>
                                    <IoIosCheckmarkCircleOutline size={30} />
                                    Valider la pose
                                </button>
                            )}

                            {data.status === "DEFAULT - à traiter" && (
                                <button
                                    onClick={() =>
                                        handleChangeCommandsStatus(
                                            "DEFAULT - préparé"
                                        )
                                    }
                                >
                                    <IoIosCheckmarkCircleOutline size={30} />
                                    Valider la préparation
                                </button>
                            )}
                            {data.status === "DEFAULT - préparé" && (
                                <button
                                    onClick={() =>
                                        handleChangeCommandsStatus(
                                            "DEFAULT - posé"
                                        )
                                    }
                                >
                                    <IoIosCheckmarkCircleOutline size={30} />
                                    Valider la pose
                                </button>
                            )}
                            {data.status === "DEFAULT - posé" && (
                                <button
                                    onClick={() =>
                                        setInvoiceCommands(data.commands)
                                    }
                                >
                                    <BsPiggyBank size={26} /> Facturer
                                </button>
                            )}
                            {(data.status === "DEFAULT - à traiter" ||
                                data.status === "DEFAULT - préparé") && (
                                <button
                                    onClick={() =>
                                        handleOpenModal({
                                            title: "Date de la tournée",
                                            content: (
                                                <TourForm
                                                    commands={data.commands}
                                                    handleCloseModal={
                                                        handleCloseModal
                                                    }
                                                />
                                            ),
                                        })
                                    }
                                >
                                    <MdPendingActions size={26} />
                                    Reporter la tournée
                                </button>
                            )}
                        </Dropdown>
                    )}
                    {_.isEmpty(previousPageState) ? (
                        <Button
                            size={ButtonSize.Big}
                            onClick={() => navigate(-1)}
                        >
                            <MdArrowBack />
                        </Button>
                    ) : (
                        <Button
                            size={ButtonSize.Big}
                            onClick={() =>
                                navigate("/tours", { state: previousPageState })
                            }
                        >
                            <MdArrowBack />
                        </Button>
                    )}
                </Header>
                <Content>
                    <div className="flex">
                        <ul className="steps steps-vertical">
                            {commands.map((item) => (
                                <li
                                    key={item}
                                    className="step step-neutral"
                                ></li>
                            ))}
                        </ul>
                        <div className="grow">
                            <Reorder.Group
                                axis="y"
                                values={commands}
                                onReorder={setCommands}
                                onMouseUp={() => handleSaveOrder()}
                            >
                                {commands.map((iri) => (
                                    <Reorder.Item
                                        key={iri}
                                        value={iri}
                                        className="mb-3"
                                    >
                                        <CardTour iri={iri} />
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    </div>
                </Content>
            </>
        );
};
