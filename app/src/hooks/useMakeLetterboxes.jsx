import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_LETTERBOXES } from "../config/api.config";
import { request } from "../utils/axios.utils";

const useMakeLetterboxes = () => {
    const [data, setData] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const makeQueries = useQueries({
        queries: data
            ? data.entrances.map((entrance) => {
                  return {
                      queryKey: ["makeEntrance", entrance],
                      queryFn: () =>
                          request({
                              url: API_LETTERBOXES,
                              method: "post",
                              data: {
                                  property: data.propertyIRI,
                                  content: [],
                                  columns: 1,
                                  entrance: entrance,
                              },
                          }),
                      staleTime: Infinity,
                  };
              })
            : [],
    });

    const isPending = makeQueries.some((result) => result.isLoading);
    const isSuccess =
        makeQueries.length === 0
            ? false
            : makeQueries.every((result) => result.isSuccess);

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            navigate(API_LETTERBOXES + "/" + makeQueries[0].data.id);
        }
    }, [isSuccess]);

    return {
        setData,
        isSuccess,
        isPending,
    };
};

export default useMakeLetterboxes;
