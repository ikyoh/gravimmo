import { yupResolver } from "@hookform/resolvers/yup";
import FormCheckbox from "components/form/checkbox/FormCheckbox";
import FieldArray from "components/form/field-array/FieldArray";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import FormLabel from "components/form/label/FormLabel";
import { FormSelect } from "components/form/select/FormSelect";
import Loader from "components/loader/Loader";
import { commandDetails } from "config/translations.config";
import {
    useGetFilteredDatasByTransmitter,
    useGetFilteredDatasByVigik,
    useGetOneData,
    usePostData,
    usePutData
} from "queryHooks/useProperty";
import { useGetAllDatas } from "queryHooks/useTrustee";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function PropertyForm({
    id,
    trusteeIRI = "",
    handleCloseModal,
    duplicate = false,
}) {
    const {
        isLoading: isLoadingData,
        data,
        isError,
        error,
    } = useGetOneData(id);
    const { isLoading: isLoadingTrustees, data: dataTrustees } = useGetAllDatas(
        "",
        "title",
        "ASC"
    );
    const {
        mutate: postData,
        isLoading: isPostLoading,
        isSuccess: isPostSuccess,
        error: postError,
    } = usePostData();
    const {
        mutate: putData,
        isLoading: isPutLoading,
        isSuccess: isPutSuccess,
        error: putError,
    } = usePutData();

    const validationSchema = yup.object({
        trustee: yup.string().required("Champ obligatoire"),
        reference: yup.string().required("Champ obligatoire"),
        title: yup.string().required("Champ obligatoire"),
        address: yup.string().required("Champ obligatoire"),
        postcode: yup.string().required("Champ obligatoire"),
        city: yup.string().required("Champ obligatoire"),
        zone: yup.string().required("Champ obligatoire"),
        deliveredAt: yup.date().typeError("Champ obligatoire"),
    });

    const defaultValues = {
        trustee: "",
        deliveredAt: "2000-01-01",
        params: [],
        accesses: [],
        entrances: [],
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        setFocus,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    // CASE NEW PROPERTY FROM TRUSTEE
    useEffect(() => {
        if (trusteeIRI && !id) {
            reset({ ...defaultValues, trustee: trusteeIRI });
        }
    }, [isLoadingTrustees, dataTrustees]);

    // CASE UPDATE || DUPLICATE PROPERTY
    useEffect(() => {
        if (id && data) {
            reset({ ...data, trustee: data.trustee["@id"] });
        }
    }, [isLoadingData, data]);

    const onSubmit = (form) => {
        if (!id) postData(form);
        if (id && duplicate) {
            const _form = { ...form };
            delete _form.id;
            delete _form.services;
            postData(_form);
        }
        if (id && !duplicate) putData(form);
    };

    useEffect(() => {
        if (putError) {
            putError.response.data.violations.forEach(
                ({ propertyPath, message }) => {
                    setError(propertyPath, {
                        type: "custom",
                        message: message,
                    });
                }
            );
            setFocus(putError.response.data.violations[0].propertyPath);
        }
        if (postError) {
            postError.response.data.violations.forEach(
                ({ propertyPath, message }) => {
                    setError(propertyPath, {
                        type: "custom",
                        message: message,
                    });
                }
            );
            setFocus(postError.response.data.violations[0].propertyPath);
        }
    }, [putError, postError]);

    useEffect(() => {
        if (isPutSuccess || isPostSuccess) handleCloseModal();
    }, [isPutSuccess, isPostSuccess]);

    if (id) {
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
            isLoading={isSubmitting || isPutLoading || isPostLoading}
            isDisabled={isSubmitting || isPutLoading || isPostLoading}
        >
            {!id && (
                <FormSelect
                    type="text"
                    name="trustee"
                    label="Syndic"
                    error={errors["title"]}
                    register={register}
                    required={true}
                >
                    {isLoadingTrustees && (
                        <option disabled>Chargement des syndics</option>
                    )}
                    {!isLoadingTrustees && dataTrustees.length !== 0 && (
                        <option value="">Choisir un syndic</option>
                    )}
                    {!isLoadingTrustees && dataTrustees.length === 0 && (
                        <option disabled>Aucun syndic trouvé</option>
                    )}
                    {!isLoadingTrustees &&
                        dataTrustees.map((data) => (
                            <option key={data["@id"]} value={data["@id"]}>
                                {data.title}
                            </option>
                        ))}
                </FormSelect>
            )}
            <FormInput
                type="text"
                name="reference"
                label="Référence"
                error={errors["reference"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="title"
                label="Nom"
                error={errors["title"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="address"
                label="Adresse"
                error={errors["address"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="postcode"
                label="Code postal"
                error={errors["postcode"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="city"
                label="Ville"
                error={errors["city"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="zone"
                label="Secteur"
                error={errors["zone"]}
                register={register}
                required={true}
            />
            <FieldArray
                name="entrances"
                label="Entrées / Villas / Bâtiments"
                placeholder="ex : A"
                error={errors["entrances"]}
                control={control}
                required={false}
            />
            <FormInput
                type="text"
                name="contactName"
                label="Nom du contact ou gardien"
                error={errors["contactName"]}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="contactPhone"
                label="Téléphone du contact ou gardien"
                error={errors["contactPhone"]}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="digicode"
                label="Accès Digicode"
                error={errors["digicode"]}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="vigik"
                label="Accès Vigik"
                error={errors["vigik"]}
                register={register}
                required={false}
            />
            <SearchVigik watch={watch} propertyId={id} />
            <FormInput
                type="text"
                name="transmitter"
                label="Accès émetteur"
                error={errors["transmitter"]}
                register={register}
                required={false}
            />
            <SearchTransmitter watch={watch} propertyId={id} />
            <FieldArray
                name="accesses"
                label="Autres accès"
                placeholder="ex : Pass PTT"
                error={errors["accesses"]}
                control={control}
                required={false}
            />
            <div className="mb-3">
                <FormLabel label={"Elements à graver"} />
                <div className="grid grid-cols-2">
                    {Object.keys(commandDetails)
                        .filter(
                            (f) =>
                                f !== "proprietaire" &&
                                f !== "nouveloccupant" &&
                                f !== "ancienoccupant"
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
            </div>
            <FormInput
                type="date"
                name="deliveredAt"
                label="Date de livraison"
                error={errors["deliveredAt"]}
                register={register}
                required={true}
            />
        </Form>
    );
}
const SearchVigik = ({ watch, propertyId }) => {
    const watchVigik = watch("vigik", false);
    const { isLoading, isFetching, isRefetching, data } =
        useGetFilteredDatasByVigik({ vigik: watchVigik, id: propertyId });
    if (isLoading || isFetching || isRefetching)
        return <p className="mb-2">Recherche de doublon</p>;
    if (data.length !== 0)
        return <p className="mb-2 text-error">Attention doublon</p>;
    return null;
};


const SearchTransmitter = ({ watch, propertyId }) => {
    const watchTransmitter = watch("transmitter", false);
    const { isLoading, isFetching, isRefetching, data } =
        useGetFilteredDatasByTransmitter({
            transmitter: watchTransmitter,
            id: propertyId,
        });
    if (isLoading || isFetching || isRefetching)
        return <p className="mb-2">Recherche de doublon</p>;
    if (data.length !== 0)
        return <p className="mb-2 text-error">Attention doublon</p>;
    return null;
};
