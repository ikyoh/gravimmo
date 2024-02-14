import { yupResolver } from "@hookform/resolvers/yup";
import FormCheckbox from "components/form/checkbox/FormCheckbox";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import FormLabel from "components/form/label/FormLabel";
import { FormSelect } from "components/form/select/FormSelect";
import {
    useGetOneData,
    usePostData,
    usePutData,
} from "queryHooks/usePropertyService";
import {
    useGetAllDatas as useGetAllDatasServices,
    useGetOneData as useGetOneDataService,
} from "queryHooks/useService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function PropertyServiceForm({
    iri,
    propertyIRI,
    handleCloseModal,
}) {
    const [firstLoad, setFirstLoad] = useState(true);

    const {
        isLoading: isLoadingData,
        data,
        isError,
        error,
        isFetched,
    } = useGetOneData(iri);

    const validationSchema = yup.object({
        service: yup.string().required("Champ obligatoire"),
    });

    const defaultValues = {
        service: "",
        property: propertyIRI,
        finishing: [],
    };

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    const watchService = watch("service", data ? data.service["@id"] : false);

    const {
        data: dataServices,
        isLoading: isLoadingServices,
        error: errorServices,
    } = useGetAllDatasServices();
    const {
        isLoading: isLoadingService,
        data: dataService,
        isError: isErrorService,
        error: errorService,
    } = useGetOneDataService(watchService);
    const { mutate: postData, isLoading: isPosting, isSuccess } = usePostData();
    const { mutate: putData } = usePutData();

    useEffect(() => {
        if (!firstLoad) reset({ ...defaultValues, service: watchService });
    }, [watchService]);

    // CASE UPDATE
    useEffect(() => {
        if (iri && data) {
            reset({ ...data, service: watchService });
        }
    }, [isLoadingData, data]);

    useEffect(() => {
        setFirstLoad(false);
    }, []);

    // useEffect(() => {
    //     if (dataService && dataService.configuration) {
    //         setValue('configuration', dataService.configuration)
    //     }
    // }, [dataService])

    const onSubmit = (form) => {
        if (!iri) postData(form);
        else {
            putData(form);
        }
        handleCloseModal();
    };

    if (iri) {
        if (isLoadingData) {
            return <h2>Loading...</h2>;
        }
        if (isError) {
            return <h2 className="py-3">Error : {error.message}</h2>;
        }
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
        >
            <FormSelect
                type="text"
                name="service"
                label="Prestation"
                error={errors["service"]}
                register={register}
                required={true}
            >
                {isLoadingServices && (
                    <option value="">Chargement des prestations</option>
                )}
                {!isLoadingServices && dataServices.length !== 0 && (
                    <option value="">Choisir une prestation</option>
                )}
                {!isLoadingServices && dataServices.length === 0 && (
                    <option value="">Aucune prestation trouvée</option>
                )}
                {!isLoadingServices &&
                    dataServices.map((data) => (
                        <option key={data["@id"]} value={data["@id"]}>
                            {data.title} - {data.price} € H.T.
                        </option>
                    ))}
            </FormSelect>
            {dataService && dataService.material.length !== 0 && (
                <FormSelect
                    type="text"
                    name="material"
                    label="Matière"
                    error={errors["material"]}
                    register={register}
                    required={true}
                >
                    {dataService.material.map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}
            {dataService && dataService.color.length !== 0 && (
                <FormSelect
                    type="text"
                    name="color"
                    label="Couleur"
                    error={errors["color"]}
                    register={register}
                    required={true}
                >
                    {dataService.color.map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}

            {dataService && dataService.font.length !== 0 && (
                <FormSelect
                    type="text"
                    name="font"
                    label="Police"
                    error={errors["font"]}
                    register={register}
                    required={true}
                >
                    {dataService.font.map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}

            {dataService && dataService.margin.length !== 0 && (
                <FormSelect
                    type="text"
                    name="margin"
                    label="Marges"
                    error={errors["margin"]}
                    register={register}
                    required={true}
                >
                    {dataService.margin.map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}

            {dataService && dataService.finishing.length !== 0 && (
                <>
                    <FormLabel name="finishing" label="Façonnages" />
                    <div className="grid grid-cols-2">
                        {dataService.finishing.map((data) => (
                            <FormCheckbox
                                key={data}
                                name="finishing"
                                label={data}
                                value={data}
                                error={errors["finishing"]}
                                register={register}
                            />
                        ))}
                    </div>
                </>
            )}
            {dataService && dataService.configuration && (
                <FormInput
                    type="text"
                    name="configuration"
                    label="Configuration machine"
                    error={errors["configuration"]}
                    register={register}
                    required={false}
                />
            )}
        </Form>
    );
}
