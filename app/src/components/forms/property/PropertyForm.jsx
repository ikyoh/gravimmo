import { yupResolver } from "@hookform/resolvers/yup";
import FormCheckbox from "components/form/checkbox/FormCheckbox";
import FieldArray from "components/form/field-array/FieldArray";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import { FormSelect } from "components/form/select/FormSelect";
import Loader from "components/loader/Loader";
import { commandDetails } from "config/translations.config";
import { useGetOneData, usePostData, usePutData } from "queryHooks/useProperty";
import { useGetAllDatas } from "queryHooks/useTrustee";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function PropertyForm({
    id,
    trusteeIRI,
    handleCloseModal,
    duplicate = false,
}) {
    const {
        isLoading: isLoadingData,
        data,
        isError,
        error,
    } = useGetOneData(id);
    const {
        isLoading: isLoadingTrustees,
        data: dataTrustees,
        isError: isErrorTrustees,
        error: errorTrustees,
    } = useGetAllDatas("", "title", "ASC");
    const {
        mutate: postData,
        isLoading: isPostLoading,
        isSuccess: isPostSuccess,
    } = usePostData();
    const {
        mutate: putData,
        isLoading: isPutLoading,
        isSuccess: isPutSuccess,
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
            {!trusteeIRI && (
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
                    {!isLoadingTrustees && dataTrustees.length != 0 && (
                        <option disabled>Choisir un syndic</option>
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
                label="Entrées"
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
                label="Digicode"
                error={errors["digicode"]}
                register={register}
                required={false}
            />
            <FieldArray
                name="accesses"
                label="Accès"
                placeholder="ex : VIGIK-123456"
                error={errors["accesses"]}
                control={control}
                required={false}
            />
            <FormInput
                type="date"
                name="deliveredAt"
                label="Date de livraison"
                error={errors["deliveredAt"]}
                register={register}
                required={true}
            />
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
        </Form>
    );
}
