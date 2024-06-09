import { CardTour } from "components/cards/tour/CardTour";
import Loader from "components/loader/Loader";
import { useDeleteIRI, useGetOneData, usePutData } from "queryHooks/useTour";
import { useEffect, useState } from "react";

import { arrayOfIris } from "utils/functions.utils";

import TourDropdown from "components/dropdown/contents/TourDropdown";
import { Reorder } from "framer-motion";

const Tour = ({ id, reorder }) => {
    const { data = [], isLoading, error, isSuccess } = useGetOneData(id);
    const [commands, setCommands] = useState([]);

    const { mutate } = usePutData();
    const { mutate: deleteTour } = useDeleteIRI();

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
        <div className="">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 mb-5">
                    <div className="text-xl font-bold uppercase">
                        Tournée #{data.id}
                    </div>
                    <div className="chat chat-start">
                        <div className="chat-bubble !max-w-none">
                            <div className="mt-0.5">
                                {data.user.firstname} {data.user.lastname}
                            </div>
                        </div>
                    </div>
                </div>
                <TourDropdown tourID={id} />
            </div>

            <div className="flex">
                <ul className="steps steps-vertical">
                    {commands.map((item) => (
                        <li
                            key={item}
                            className="step step-neutral !min-h-0"
                        ></li>
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
                        commands.map((iri) => (
                            <div className="mb-3" key={iri}>
                                <CardTour iri={iri} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
export default Tour;
