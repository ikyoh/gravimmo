import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { API_COMMANDS as API, API_ZONES, itemsPerPage } from "../config/api.config";
import { request, requestIRI } from "../utils/axios.utils";

/* CONFIG */
const queryKey = "commands";

/* API REQUESTS */
const fetchAllDatas = () => {
    return request({ url: API + "?pagination=false", method: "get" });
};

const fetchFilteredDatas = (sortValue, sortDirection, searchValue) => {
    return request({
        url:
            API +
            "?pagination=false" +
            "&order[" +
            sortValue +
            "]=" +
            sortDirection +
            "&" +
            searchValue,
        method: "get",
    });
};

const fetchFilteredByStatus = (status) => {
    return request({
        url: API + "?pagination=true&status=" + status,
        method: "get",
    });
};

const fetchStats = ({ status, isHanging = false }) => {
    let options = "?pagination=true&itemsPerPage=1&isHanging=" + isHanging;
    if (status) options += "&status=" + status;
    return request({
        url: API + options,
        method: "get",
    });
};

const fetchPaginatedDatas = ({
    page = 1,
    sortValue = "id",
    sortDirection = "ASC",
    searchValue,
    filters,
    property,
    details,
}) => {
    let options =
        "?page=" +
        page +
        "&itemsPerPage=" +
        itemsPerPage +
        "&order[" +
        sortValue +
        "]=" +
        sortDirection;
    if (property) options += "&property=" + property;
    if (searchValue) options += "&search=" + searchValue;
    if (details) options += "&search=" + details;
    if (filters.isHanging) options += "&isHanging=true";
    if (filters.isNotTour) options += "&exists[tour]=false";
    if (filters.isReport) options += "&exists[reports]=true";
    if (filters.status !== "all") options += "&status=" + filters.status;
    if (filters.zone !== "") options += "&property.zone=" + filters.zone;
    return request({ url: API + options, method: "get" });
};

const fetchOneData = ({ queryKey }) => {
    const id = queryKey[1];
    return request({ url: API + "/" + id, method: "get" });
};

const getCurrentAccount = () => {
    return request({ url: API_ZONES, method: 'get' })
}

const fetchIRI = ({ queryKey }) => {
    const iri = queryKey[1];
    return requestIRI({ url: iri, method: "get" });
};

const postData = (form) => {
    return request({ url: API, method: "post", data: form });
};

const putData = (form) => {
    return request({ url: API + "/" + form.id, method: "put", data: form });
};

const deleteData = (iri) => {
    return requestIRI({ url: iri, method: "delete" });
};

/* HOOKS */
export const useGetAllDatas = (search = "", sortValue, sortDirection) => {
    return useQuery([queryKey], fetchAllDatas, {
        staleTime: 60000,
        cacheTime: 60000,
        select: (data) => {
            if (search === "")
                return _.orderBy(
                    data["hydra:member"],
                    sortValue,
                    sortDirection
                );
            else
                return _.orderBy(
                    data["hydra:member"].filter((f) =>
                        f.title.toLowerCase().includes(search.toLowerCase())
                    ),
                    sortValue,
                    sortDirection
                );
        },
    });
};

export const useGetFilteredDatas = (sortValue, sortDirection, searchValue) => {
    return useQuery({
        queryKey: [queryKey, sortValue, sortDirection, searchValue],
        queryFn: () =>
            fetchFilteredDatas(sortValue, sortDirection, searchValue),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        //select: data => {return data['hydra:member']}
    });
};

export const useGetPaginatedDatas = ({
    enabled = true,
    page,
    sortValue,
    sortDirection,
    searchValue,
    filters,
    property,
    details,
}) => {
    return useQuery({
        queryKey: [
            queryKey,
            page,
            sortValue,
            sortDirection,
            searchValue,
            filters,
            property,
            details,
        ],
        queryFn: () =>
            fetchPaginatedDatas({
                page,
                sortValue,
                sortDirection,
                searchValue,
                filters,
                property,
                details,
            }),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        enabled: enabled,
        //select: data => {return data['hydra:member']}
    });
};

export const useGetOneData = (id) => {
    return useQuery([queryKey, "/api" + API + "/" + id], fetchIRI, {
        staleTime: 60000,
        cacheTime: 60000,
        enabled: id ? true : false,
    });
};

export const useGetIRI = (iri) => {
    return useQuery([queryKey, iri], fetchIRI, {
        staleTime: 60000,
        cacheTime: 60000,
        enabled: iri ? true : false,
    });
};

export const useDeleteIRI = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteData, {
        onSuccess: () => {
            queryClient.invalidateQueries([queryKey]);
        },
    });
};

export const usePostData = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation(postData, {
        onSuccess: (data) => {
            if (data.customer) navigate(API + "/" + data.id);
        },
        onError: (error, _, context) => {
            console.log("error", error);
        },
        onSettled: () => {
            queryClient.invalidateQueries();
        },
    });
};

export const usePutData = () => {
    const queryClient = useQueryClient();
    return useMutation(putData, {
        onError: (error, _, context) => {
            console.log("error", error);
            queryClient.setQueryData([queryKey], context.previousDatas);
        },
        onSettled: () => {
            queryClient.invalidateQueries([queryKey]);
            // queryClient.invalidateQueries(["tours"]);
        },
    });
};

export const useGetOrdersToInvoiceNumber = () => {
    return useQuery({
        queryKey: [queryKey, "ToInvoiceNumber"],
        queryFn: () => fetchFilteredByStatus("DEFAULT - posé"),
        staleTime: 60000,
        cacheTime: 60000,
        select: (data) => data["hydra:totalItems"],
    });
};
export const useGetOrdersToDeliverNumber = () => {
    return useQuery({
        queryKey: [queryKey, "ToInvoiceNumber"],
        queryFn: () => fetchFilteredByStatus("DEFAULT -préparé"),
        staleTime: 60000,
        cacheTime: 60000,
        select: (data) => data["hydra:totalItems"],
    });
};

export const useGetCommandStats = ({ queryName, status, isHanging }) => {
    return useQuery({
        queryKey: [queryKey, queryName],
        queryFn: () => fetchStats({ status, isHanging }),
        staleTime: 60000,
        cacheTime: 60000,
        select: (data) => data["hydra:totalItems"],
    });
};

export const useGetCommandsZones = () => {
    return useQuery(["zones"], getCurrentAccount, {
        cacheTime: 6000,
        staleTime: 6000,
        retry: 2,
    })
}