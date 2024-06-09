import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import _ from "lodash";
import { API_PROPERTIES as API, itemsPerPage } from "../config/api.config";
import { request, requestIRI } from "../utils/axios.utils";

/* CONFIG */
const queryKey = "properties";

/* API REQUESTS */
const fetchAllDatas = () => {
    return request({ url: API, method: "get" });
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

const fetchPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
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

    return request({ url: API + options, method: "get" });
};

const fetchDatasByTrusteeIRI = (trusteeIRI) => {
    const trusteeID = trusteeIRI.replace("/api/trustees/", "");
    return request({
        url:
            API +
            "?pagination=false&trustee=" +
            trusteeID +
            "&order[title]=asc",
        method: "get",
    });
};

const fetchDatasByVigik = (vigik, id) => {
    return request({
        url:
            API +
            "?pagination=false&notequal=" +
            id +
            "&vigik=" +
            vigik +
            "&order[title]=asc",
        method: "get",
    });
};

const fetchDatasByTransmitter = (transmitter, id) => {
    return request({
        url:
            API +
            "?pagination=false&notequal=" +
            id +
            "&transmitter=" +
            transmitter +
            "&order[title]=asc",
        method: "get",
    });
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
    const _form = { ...form };
    _form.deliveredAt = dayjs.utc(form.deliveredAt).local().format();
    return request({ url: API, method: "post", data: _form });
};

const putData = (form) => {
    const _form = { ...form };
    _form.deliveredAt = dayjs.utc(form.deliveredAt).local().format();
    return request({ url: API + "/" + form.id, method: "put", data: _form });
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

export const useGetFilteredDatasByTrustee = (trusteeIRI) => {
    return useQuery({
        queryKey: [queryKey, trusteeIRI],
        queryFn: () => fetchDatasByTrusteeIRI(trusteeIRI),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        select: (data) => {
            return data["hydra:member"];
        },
    });
};

export const useGetFilteredDatasByVigik = ({ vigik, id }) => {
    return useQuery({
        queryKey: [queryKey, vigik, id],
        queryFn: () => fetchDatasByVigik(vigik, id),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        select: (data) => {
            return data["hydra:member"];
        },
    });
};

export const useGetFilteredDatasByTransmitter = ({ transmitter, id }) => {
    return useQuery({
        queryKey: [queryKey, transmitter, id],
        queryFn: () => fetchDatasByTransmitter(transmitter, id),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        select: (data) => {
            return data["hydra:member"];
        },
    });
};

export const useGetPaginatedDatas = (
    page,
    sortValue,
    sortDirection,
    searchValue
) => {
    return useQuery({
        queryKey: [queryKey, page, sortValue, sortDirection, searchValue],
        queryFn: () =>
            fetchPaginatedDatas(page, sortValue, sortDirection, searchValue),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        //select: data => {return data['hydra:member']}
    });
};

export const useGetOneData = (id) => {
    return useQuery([queryKey, id], fetchOneData, {
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
    return useMutation(postData, {
        onError: (error, _, context) => {
            console.log("error", error);
        },
        onSettled: () => {
            queryClient.invalidateQueries([queryKey]);
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
        },
    });
};
