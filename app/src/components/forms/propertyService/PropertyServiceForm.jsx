import { yupResolver } from "@hookform/resolvers/yup";
import FormCheckbox from "components/form/checkbox/FormCheckbox";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import { FormSelect } from "components/form/select/FormSelect";
import Loader from "components/loader/Loader";
import { commandDetails } from "config/translations.config";
import { useGetIRI as useGetProperty } from "queryHooks/useProperty";
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

    const { isLoading: isLoadingProperty, data: property } =
        useGetProperty(propertyIRI);

    const {
        isLoading: isLoadingData,
        data,
        isError,
        error,
    } = useGetOneData(iri ? iri : null);

    const validationSchema = yup.object({
        service: yup.string().required("Champ obligatoire"),
    });

    const defaultValues = {
        service: "",
        property: propertyIRI,
        finishing: [],
        params: [],
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

    useEffect(() => {
        if (dataService && dataService.configuration) {
            setValue("configuration", dataService.configuration);
        }
    }, [dataService]);

    const onSubmit = (form) => {
        if (!iri) postData(form);
        else {
            putData(form);
        }
        handleCloseModal();
    };

    if (isLoadingProperty) return <Loader />;

    if (iri) {
        if (isLoadingData) {
            return <Loader />;
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
                    dataServices.sort().map((data) => (
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
                    {dataService.material.sort().map((data) => (
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
                    {dataService.color.sort().map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}
            {dataService && dataService.size.length !== 0 && (
                <FormSelect
                    type="text"
                    name="size"
                    label="Dimensions"
                    error={errors["size"]}
                    register={register}
                    required={true}
                >
                    {dataService.size.sort().map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}
            {dataService && dataService.thickness.length !== 0 && (
                <FormSelect
                    type="text"
                    name="thickness"
                    label="Epaisseur"
                    error={errors["thickness"]}
                    register={register}
                    required={true}
                >
                    {dataService.thickness.sort().map((data) => (
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
                    {dataService.font.sort().map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}
            {dataService && dataService.height.length !== 0 && (
                <FormSelect
                    type="text"
                    name="height"
                    label="Hauteur de texte"
                    error={errors["height"]}
                    register={register}
                    required={true}
                >
                    {dataService.height.sort().map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}
            {dataService && dataService.ratio.length !== 0 && (
                <FormSelect
                    type="text"
                    name="ratio"
                    label="Ratio police"
                    error={errors["ratio"]}
                    register={register}
                    required={true}
                >
                    {dataService.ratio.sort().map((data) => (
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
                    {dataService.margin.sort().map((data) => (
                        <option key={data} value={data}>
                            {data}
                        </option>
                    ))}
                </FormSelect>
            )}

            {dataService && (
                <FormInput
                    type="text"
                    name="configuration"
                    label="Configuration machine"
                    error={errors["configuration"]}
                    register={register}
                    required={false}
                />
            )}

            {dataService && dataService.finishing.length !== 0 && (
                <>
                    <div className="divider uppercase">Façonnage</div>
                    <div className="grid grid-cols-2">
                        {dataService.finishing.sort().map((data) => (
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

            {Object.keys(commandDetails).length > 3 && (
                <div className="divider uppercase">A graver</div>
            )}
            <div className="grid grid-cols-2">
                {Object.keys(commandDetails)
                    .filter(
                        (f) =>
                            f !== "proprietaire" &&
                            f !== "nouveloccupant" &&
                            f !== "ancienoccupant" &&
                            property.params.includes(f)
                    )
                    .map((key, index) => (
                        <FormCheckbox
                            key={index}
                            name="params"
                            label={commandDetails[key]}
                            value={key}
                            error={errors["params"]}
                            register={register}
                            required={true}
                        />
                    ))}
            </div>
        </Form>
    );
}
