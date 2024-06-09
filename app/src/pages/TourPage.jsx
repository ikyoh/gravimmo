import { Button, ButtonSize } from "components/button/Button";
import { CardTour } from "components/cards/tour/CardTour";
import Loader from "components/loader/Loader";
import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import dayjs from "dayjs";
import { useModal } from "hooks/useModal";
import _ from "lodash";
import { useGetOneData, usePutData } from "queryHooks/useTour";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { arrayOfIris } from "utils/functions.utils";

import TourDropdown from "components/dropdown/contents/TourDropdown";
import { NoDataFound } from "components/noDataFound/NoDataFound";
import { Reorder } from "framer-motion";
import useMakeInvoices from "hooks/useMakeInvoices";
export const TourPage = () => {
    const navigate = useNavigate();
    const { state: previousPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    const { id } = useParams();
    const { data, isLoading, error, isSuccess, fetchStatus, isFetching } =
        useGetOneData(id);

    const [commands, setCommands] = useState([]);

    const {
        setCommands: setCommandsInvoice,
        isLoading: isLoadingMakeInvoices,
    } = useMakeInvoices();

    const { mutate, isSuccess: isPutSuccess } = usePutData();

    useEffect(() => {
        if (isSuccess && data && data.positions.length === 0)
            setCommands(arrayOfIris(data.commands));
        if (isSuccess && data && data.positions.length !== 0)
            setCommands(data.positions);
    }, [isSuccess, data]);

    const handleSaveOrder = () => {
        mutate({ id: id, positions: commands });
    };

    if (isLoading) return <Loader />;
    if (isLoadingMakeInvoices) return <Loader text="Enregistrement en cours" />;
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
                <TourDropdown
                    tourID={id}
                    setCommandsInvoice={setCommandsInvoice}
                />

                {_.isEmpty(previousPageState) ? (
                    <Button size={ButtonSize.Big} onClick={() => navigate(-1)}>
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
                {data.commands.length === 0 ? (
                    <NoDataFound />
                ) : (
                    <div className="flex">
                        <ul className="steps steps-vertical">
                            {commands.map((item) => (
                                <li
                                    key={item}
                                    className="step step-neutral text-xs !min-h-0"
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
                                        className="mb-2"
                                    >
                                        <CardTour iri={iri} />
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    </div>
                )}
            </Content>
        </>
    );
};
