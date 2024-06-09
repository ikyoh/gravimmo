import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { API_COMMANDS, API_INVOICES } from "../config/api.config";
import { request } from "../utils/axios.utils";

const useMakeInvoices = () => {
    const [commands, setCommands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const queryClient = useQueryClient();

    const makeInvoiceQueries = useQueries({
        queries:
            commands.length !== 0
                ? commands.map((command) => {
                      if (
                          command.invoice &&
                          command.status !== "DEFAULT - préparé"
                      )
                          return null;
                      else
                          return {
                              queryKey: ["makeInvoice", command["@id"]],
                              queryFn: () =>
                                  request({
                                      url: API_INVOICES,
                                      method: "post",
                                      data: {
                                          command: command["@id"],
                                          trustee: command.trustee
                                              ? command.trustee["@id"] ||
                                                command.trustee
                                              : null,
                                          property: command.property
                                              ? command.property["@id"] ||
                                                command.property
                                              : null,
                                          customer: command.customer
                                              ? command.customer["@id"] ||
                                                command.customer
                                              : null,
                                      },
                                  }),
                              staleTime: Infinity,
                          };
                  })
                : [],
    });

    const isPendingInvoices = makeInvoiceQueries.some(
        (result) => result.isLoading
    );
    const isSuccessInvoices =
        makeInvoiceQueries.length === 0
            ? false
            : makeInvoiceQueries.every((result) => result.isSuccess);

    const updateCommandsQueries = useQueries({
        queries:
            commands.length !== 0 && isSuccessInvoices
                ? commands.map((command) => {
                      if (command.invoice) return null;
                      else {
                          return {
                              queryKey: ["commands", command.id],
                              queryFn: () =>
                                  request({
                                      url: API_COMMANDS + "/" + command.id,
                                      method: "put",
                                      data: { status: "facturé" },
                                  }),
                          };
                      }
                  })
                : [],
    });

    const isPendingCommands = updateCommandsQueries.some(
        (result) => result.isLoading
    );
    const isSuccessCommands =
        updateCommandsQueries.length === 0
            ? false
            : updateCommandsQueries.every((result) => result.isSuccess);

    useEffect(() => {
        if (isSuccessInvoices && isSuccessCommands) {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["commands"] });
            queryClient.invalidateQueries({ queryKey: ["tours"] });
            setCommands([]);
            setIsSuccess(true);
        }
    }, [isSuccessInvoices, isSuccessCommands]);

    useEffect(() => {
        if (isPendingInvoices || isPendingCommands) {
            setIsLoading(true);
        } else setIsLoading(false);
    }, [isPendingInvoices, isPendingCommands]);

    return {
        setCommands,
        isSuccess,
        isLoading,
    };
};

export default useMakeInvoices;
