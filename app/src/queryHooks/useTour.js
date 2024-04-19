import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { API_TOURS as API, itemsPerPage } from "../config/api.config";
import { request, requestIRI } from "../utils/axios.utils";

/* CONFIG */
const queryKey = "tours";

/* API REQUESTS */
const fetchAllDatas = () => {
    return request({ url: API, method: "get" });
};

const fetchPaginatedDatas = ({
    page = 1,
    sortValue = "id",
    sortDirection = "ASC",
    filters = "DEFAULT",
    searchValue,
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
    if (searchValue) options += "&search=" + searchValue;
    if (filters.status !== "all") options += "&status=" + filters.status;
    if (filters.scheduledAt !== "")
        options +=
            "&scheduledAt[after]=" +
            filters.scheduledAt +
            "&scheduledAt[before]=" +
            dayjs(filters.scheduledAt).add(1, "day").format("YYYY-MM-DD");
    return request({ url: API + options, method: "get" });
};

const fetchOneData = ({ queryKey }) => {
    const id = queryKey[1];
    return request({ url: API + "/" + id, method: "get" });
};

const fetchDate = ({ queryKey }) => {
    const date = queryKey[1];
    const user = queryKey[2];
    return request({
        url:
            API +
            "?scheduledAt[strictly_before]=" +
            dayjs(date).add(1, "day").format("YYYY-MM-DD") +
            "&scheduledAt[strictly_after]=" +
            dayjs(date).subtract(1, "day").format("YYYY-MM-DD") +
            "&user=" +
            user,
        method: "get",
    });
};

const fetchIRI = ({ queryKey }) => {
    const iri = queryKey[1];
    return requestIRI({ url: iri, method: "get" });
};

const postData = (form) => {
    const _form = { ...form };
    _form.scheduledAt = dayjs.utc(form.scheduledAt).local().format();
    return request({ url: API, method: "post", data: _form });
};

const putData = (form) => {
    const _form = { ...form };
    if (form.scheduledAt)
        _form.scheduledAt = dayjs.utc(form.scheduledAt).local().format();
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

export const useGetPaginatedDatas = (
    page,
    sortValue,
    sortDirection,
    searchValue,
    filters
) => {
    console.log("filters", filters);
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
            fetchPaginatedDatas({
                page,
                sortValue,
                sortDirection,
                searchValue,
                filters,
            }),
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

export const useGetDate = (date, user) => {
    return useQuery([queryKey, date, user], fetchDate, {
        staleTime: 60000,
        cacheTime: 60000,
        enabled: date ? true : false,
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
            queryClient.invalidateQueries();
        },
    });
};

export const usePutData = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation(putData, {
        onError: (error, _, context) => {
            console.log("error", error);
            queryClient.setQueryData([queryKey], context.previousDatas);
        },
        onSettled: () => {
            queryClient.invalidateQueries([queryKey]);
        },
        onSuccess: () => {
            navigate(-1);
        },
    });
};
