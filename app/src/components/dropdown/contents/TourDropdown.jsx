import Dropdown from "components/dropdown/Dropdown";
import dayjs from "dayjs";
import useMakeInvoices from "hooks/useMakeInvoices";
import { usePutData as usePutCommand } from "queryHooks/useCommand";
import { useGetOneData, usePutData } from "queryHooks/useTour";
import { BsPiggyBank } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline, IoIosCloseCircle } from "react-icons/io";

const TourDropdown = ({ tourID }) => {
    const { mutate } = usePutData();
    const { data } = useGetOneData(tourID);
    const { mutate: updateCommand } = usePutCommand();

    const { setCommands, isLoading: isLoadingMakeInvoices } = useMakeInvoices();

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
                    _command.madeAt = dayjs();

                if (
                    status === "DEFAULT - posé" &&
                    command.status === "DEFAULT - préparé"
                )
                    _command.deliveredAt = dayjs();

                updateCommand(_command);
            })
        );
    };

    if (data.commands.every((command) => command.invoice)) return null;

    return (
        <Dropdown type="button">
            {data.commands.some(
                (command) => command.status === "DEFAULT - à traiter"
            ) && (
                <button
                    className="bg-secondary"
                    onClick={() =>
                        handleChangeCommandsStatus("DEFAULT - préparé")
                    }
                >
                    <IoIosCheckmarkCircleOutline size={30} />
                    Valider la préparation
                </button>
            )}

            {!data.commands.some(
                (command) => command.status === "DEFAULT - à traiter"
            ) &&
                data.commands.some(
                    (command) => command.status === "DEFAULT - préparé"
                ) && (
                    <button
                        onClick={() =>
                            handleChangeCommandsStatus("DEFAULT - posé")
                        }
                    >
                        <IoIosCheckmarkCircleOutline size={30} />
                        Valider la pose
                    </button>
                )}
            <button onClick={() => setCommands(data.commands)}>
                <BsPiggyBank size={30} />
                Facturer la tournée
            </button>
            <button onClick={() => mutate({ id: tourID, commands: [] })}>
                <IoIosCloseCircle size={30} />
                Annuler la tournée
            </button>
        </Dropdown>
    );
};

export default TourDropdown;
