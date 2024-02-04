import Dropdown from "components/dropdown/Dropdown";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import Loader from "components/loader/Loader";
import { useGetIRI, usePutData } from "queryHooks/useCommand";
import { useGetAllDatas as useGetAllServices } from "queryHooks/useService";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import uuid from "react-uuid";

export const ExtraServiceForm = ({ commandIRI, handleCloseModal }) => {
    const { isLoading: isLoadingCommand, data: dataCommand } =
        useGetIRI(commandIRI);
    const { isLoading: isLoadingServices, data: dataServices } =
        useGetAllServices("", "category", "asc");
    const { mutate: putData, isLoading: isUpdating, isSuccess } = usePutData();

    const defaultValues = {
        id: dataCommand ? dataCommand.id : "",
        extraServices: [],
    };

    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "extraServices",
    });

    const Service = ({ iri, index }) => {
        let service = dataServices.find((f) => f["@id"] === iri);
        if (!service) return null;
        return <h1 className="subtitle mb-3">{service.title}</h1>;
    };

    //CASE UPDATE
    useEffect(() => {
        if (!isLoadingCommand && dataCommand) {
            const _defaultValues = { ...defaultValues };
            dataCommand.extraServices.forEach((element) => {
                _defaultValues.extraServices.push({
                    details: element.details,
                    service: element.service["@id"],
                });
            });
            reset(_defaultValues);
        }
    }, [isLoadingCommand]);

    const onSubmit = (form) => {
        putData(form);
    };

    useEffect(() => {
        if (isSuccess) handleCloseModal();
    }, [isSuccess]);

    if (isLoadingServices || isLoadingCommand) return <Loader />;
    else
        return (
            <>
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    isLoading={isSubmitting || isUpdating}
                    isDisabled={isSubmitting || isUpdating}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dataServices.map((service) => (
                            <button
                                type="button"
                                key={uuid()}
                                className="btn btn-primary btn-full flex justify-between"
                                onClick={() => {
                                    append({
                                        details: { quantity: 1 },
                                        service: service["@id"],
                                    });
                                }}
                                onMouseUp={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                {service.title}
                                <div className="text-accent bg-white text-sm px-3 py-1 rounded-full">
                                    {service.category}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                        {fields.map((item, index) => {
                            return (
                                <div key={item.id} className="_card">
                                    <Service iri={item.service} />
                                    <div>
                                        <FormInput
                                            type="text"
                                            name={`extraServices.${index}.details.quantity`}
                                            label="Quantité"
                                            register={register}
                                            required={true}
                                        />
                                        <FormInput
                                            type="text"
                                            name={`extraServices.${index}.details.comment`}
                                            label="Commentaire"
                                            register={register}
                                            required={false}
                                        />
                                    </div>
                                    <div className="absolute top-2 right-1">
                                        <Dropdown>
                                            <button
                                                onClick={() => {
                                                    remove(index);
                                                }}
                                                onMouseUp={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                Retirer la prestation
                                            </button>
                                        </Dropdown>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Form>
            </>
        );
};
