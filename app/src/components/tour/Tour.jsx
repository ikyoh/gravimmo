import { CardTour } from "components/cards/tour/CardTour";
import Dropdown from "components/dropdown/Dropdown";
import Loader from "components/loader/Loader";
import dayjs from "dayjs";
import { useGetOneData, usePutData } from "queryHooks/useTour";
import { useEffect, useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import { arrayOfIris } from "utils/functions.utils";

import { Reorder } from "framer-motion";

const Tour = ({ id, reorder }) => {
    const { data = [], isLoading, error, isSuccess } = useGetOneData(id);
    const [commands, setCommands] = useState([]);

    const { mutate } = usePutData();

    useEffect(() => {
        if (isSuccess && data && data.positions.length === 0)
            setCommands(arrayOfIris(data.commands));
        if (isSuccess && data && data.positions.length !== 0)
            setCommands(data.positions);
    }, [isSuccess]);

    const handleSaveOrder = () => {
        mutate({ id: id, positions: commands });
    };

    if (isLoading) return <Loader />;

    return (
        <div>
            <div className="text-right">
                <Dropdown type="button">
                    <button
                        className="bg-secondary"
                        disabled={data.status === "annulé" || data.isHanging}
                        onClick={() =>
                            mutate({
                                id: data.id,
                                status: "préparé",
                                madeAt: dayjs(),
                            })
                        }
                    >
                        <IoIosCheckmarkCircleOutline size={30} />
                        Valider la préparation
                    </button>
                    <button
                        disabled={data.status === "annulé" || data.isHanging}
                        onClick={() =>
                            mutate({
                                id: data.id,
                                status: "posé",
                                deliveredAt: dayjs(),
                            })
                        }
                    >
                        <IoIosCheckmarkCircleOutline size={30} />
                        Valider la pose
                    </button>
                    <button
                        disabled={data.status === "annulé" || data.isHanging}
                        onClick={() =>
                            mutate({
                                id: data.id,
                                status: "posé",
                                deliveredAt: dayjs(),
                            })
                        }
                    >
                        <BsPiggyBank size={30} /> Facturer Facturer la tournée
                    </button>
                </Dropdown>
            </div>

            <div className="flex">
                <ul className="steps steps-vertical">
                    {commands.map((item) => (
                        <li key={item} className="step step-neutral"></li>
                    ))}
                </ul>
                <div className="grow">
                    {reorder ? (
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
                    ) : (
                        commands.map((iri) => <CardTour iri={iri} />)
                    )}
                </div>
            </div>
        </div>
    );
};
export default Tour;
