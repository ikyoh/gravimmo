import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { requestIRI } from "../utils/axios.utils";

const useGetCommands = () => {

    const [commands, setCommands] = useState([]);

    const getCommandQueries = useQueries({
        queries:
            commands?.map((commandIRI) => ({
                queryKey: ["commands", commandIRI],
                queryFn: () =>
                    requestIRI({ url: commandIRI, method: "get" })
                , staleTime: Infinity,
            }))
    });



    const isLoading = getCommandQueries.some(
        (result) => result.isLoading
    );

    const isSuccess =
        getCommandQueries.length === 0
            ? false
            : getCommandQueries.every((result) => result.isSuccess);

    return {
        setCommands,
        isSuccess,
        isLoading,
        fetchedCommands: getCommandQueries.map((result) => result.data),
    };

};

export default useGetCommands;
