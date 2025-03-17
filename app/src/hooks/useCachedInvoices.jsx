import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { API_INVOICES } from "../config/api.config";
import { request } from "../utils/axios.utils";

const useCachedInvoices = (cachedDate) => {

    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const queryClient = useQueryClient();

    const makeCachedInvoiceQueries = useQueries({
        queries:
            invoices.filter(f => f.status === "validé")?.map((invoice) => {
                return {
                    queryKey: ["makeCachedInvoices", invoice["@id"]],
                    queryFn: () =>
                        request({
                            url: API_INVOICES + "/" + invoice.id,
                            method: "put",
                            data: {
                                cashedAt: cachedDate,
                                status: "lettré",
                            },
                        }),
                    staleTime: Infinity,
                }

            }) || [],
    });

    const isPendingInvoices = makeCachedInvoiceQueries.some(
        (result) => result.isLoading
    );


    const isSuccessInvoices =
        makeCachedInvoiceQueries.length === 0
            ? false
            : makeCachedInvoiceQueries.every((result) => result.isSuccess);


    useEffect(() => {
        if (isSuccessInvoices) {
            queryClient.invalidateQueries(["invoices"]);
            setInvoices([]);
            setIsSuccess(true);
        }
    }, [isSuccessInvoices, queryClient]);

    useEffect(() => {
        if (isPendingInvoices) {
            setIsLoading(true);
        } else setIsLoading(false);
    }, [isPendingInvoices]);

    return {
        isSuccess,
        isLoading,
        setInvoices,
    };
};

export default useCachedInvoices;
