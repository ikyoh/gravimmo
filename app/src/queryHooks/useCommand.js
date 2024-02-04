import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { API_COMMANDS as API, itemsPerPage } from "../config/api.config";
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
        url: API + "?pagination=false" + "&status=" + status,
        method: "get",
    });
};

const fetchPaginatedDatas = (
    page = 1,
    sortValue = "id",
    sortDirection = "ASC",
    searchValue,
    filters
) => {
    let options =
        "?page=" +
        page +
        "&itemsPerPage=" +
        itemsPerPage +
        "&order[" +
        sortValue +
        "]=" +
        sortDirection;
    if (searchValue) options += "&search=" + searchValue;
    if (filters.isHanging) options += "&isHanging=true";
    if (filters.isNotTour) options += "&exists[tour]=false";
    if (filters.status !== "all") options += "&status=" + filters.status;
    return request({ url: API + options, method: "get" });
};

const fetchOneData = ({ queryKey }) => {
    const id = queryKey[1];
    return request({ url: API + "/" + id, method: "get" });
};

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

export const useGetPaginatedDatas = (
    page,
    sortValue,
    sortDirection,
    searchValue,
    filters
) => {
    return useQuery({
        queryKey: [
            queryKey,
            page,
            sortValue,
            sortDirection,
            searchValue,
            filters,
        ],
        queryFn: () =>
            fetchPaginatedDatas(
                page,
                sortValue,
                sortDirection,
                searchValue,
                filters
            ),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
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

export const usePostData = () => {
    const queryClient = useQueryClient();
    //const navigate = useNavigate();
    return useMutation(postData, {
        // onSuccess: (data) => {
        //     if (data.isCustom) navigate(API + "/" + data.id)
        // },
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
            queryClient.invalidateQueries(["tours"]);
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
