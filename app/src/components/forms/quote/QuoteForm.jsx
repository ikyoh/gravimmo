import { yupResolver } from "@hookform/resolvers/yup";
import Form from "components/form/form/Form";
import { NoDataFound } from "components/noDataFound/NoDataFound";
import { useSearch } from "hooks/useSearch";
import { usePostData } from "queryHooks/useQuote";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useGetPaginatedDatas as useGetCustomers } from "queryHooks/useCustomer";
import { useGetPaginatedDatas as useGetProperties } from "queryHooks/useProperty";

import Loader from "components/loader/Loader";

export default function QuoteForm({ handleCloseModal }) {
    const { mutate, isLoading, isSuccess } = usePostData();

    const defaultValues = {
        status: "édité",
        amountHT: 0,
        amountTTC: 0,
    };

    const validationSchema = {
        trustee: yup.object({
            trustee: yup.string().required("Champ obligatoire"),
            property: yup.string().required("Champ obligatoire"),
        }),
        customer: yup.object({
            customer: yup.string().required("Champ obligatoire"),
        }),
    };

    const [choice, setChoice] = useState("trustee");

    const { handleSubmit, setValue, watch, reset } = useForm({
        resolver: yupResolver(validationSchema[choice]),
        defaultValues: defaultValues,
    });

    const onSubmit = (form) => {
        console.log(form);
        mutate(form);
    };

    useEffect(() => {
        if (isSuccess) handleCloseModal();
    }, [isSuccess, handleCloseModal]);

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            isDisabled={isLoading}
        >
            <div className="btn-group w-full mb-10">
                <button
                    type="button"
                    className={`btn w-1/2 ${
                        choice === "trustee" && "btn-active"
                    }`}
                    onClick={() => {
                        setChoice("trustee");
                        reset(defaultValues);
                    }}
                >
                    Syndic
                </button>
                <button
                    type="button"
                    className={`btn w-1/2 ${
                        choice === "customer" && "btn-active"
                    }`}
                    onClick={() => {
                        setChoice("customer");
                        reset(defaultValues);
                    }}
                >
                    Client
                </button>
            </div>
            {choice === "trustee" && (
                <SelectTrustee watch={watch} setValue={setValue} />
            )}
            {choice === "customer" && (
                <SelectCustomer watch={watch} setValue={setValue} />
            )}
        </Form>
    );
}

const SelectTrustee = ({ watch, setValue }) => {
    const { searchValue, searchbar } = useSearch("");
    const { data, isLoading } = useGetProperties(
        1,
        "title",
        "ASC",
        searchValue
    );

    const property = watch("property");

    if (isLoading) return <Loader />;
    return (
        <>
            {searchbar}
            <div className="flex flex-col gap-3 mt-3">
                {data["hydra:totalItems"] === 0 && <NoDataFound />}
                {data["hydra:member"]?.map((data) => (
                    <button
                        key={data["@id"]}
                        type="button"
                        className={`btn flex justify-between ${
                            data["@id"] === property
                                ? "btn-primary"
                                : "btn-neutral"
                        }`}
                        onClick={() => {
                            setValue("property", data["@id"]);
                            setValue("trustee", data.trustee["@id"]);
                        }}
                    >
                        <div>Copro : {data.title}</div>
                        <div>Syndic : {data.trustee.title}</div>
                    </button>
                ))}
            </div>
        </>
    );
};

const SelectCustomer = ({ watch, setValue }) => {
    const { searchValue, searchbar } = useSearch("");
    const { data, isLoading } = useGetCustomers(1, "title", "ASC", searchValue);

    const customer = watch("customer");

    if (isLoading) return <Loader />;
    return (
        <>
            {searchbar}
            <div className="flex flex-col gap-3 mt-3">
                {data["hydra:totalItems"] === 0 && <NoDataFound />}
                {data["hydra:member"]?.map((data) => (
                    <button
                        key={data["@id"]}
                        type="button"
                        className={`btn flex justify-between ${
                            data["@id"] === customer
                                ? "btn-primary"
                                : "btn-neutral"
                        }`}
                        onClick={() => setValue("customer", data["@id"])}
                    >
                        <div>{data.title}</div>
                    </button>
                ))}
            </div>
        </>
    );
};
