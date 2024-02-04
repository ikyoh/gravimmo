import { yupResolver } from "@hookform/resolvers/yup";
import FieldArray from "components/form/field-array/FieldArray";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import { SelectInput } from "components/form/select-input/SelectInput";
import Loader from "components/loader/Loader";
import { useGetOneData, usePostData, usePutData } from "queryHooks/useService";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function ServiceForm({ iri, handleCloseModal }) {
    const {
        isLoading: isLoadingData,
        data,
        isError,
        error,
    } = useGetOneData(iri);
    const {
        mutate: postData,
        isLoading: isPostLoading,
        error: postError,
    } = usePostData();
    const {
        mutate: putData,
        isLoading: isPutLoading,
        error: putError,
    } = usePutData();

    const validationSchema = yup.object({
        reference: yup.string().required("Champ obligatoire"),
        title: yup.string().required("Champ obligatoire"),
        category: yup.string().required("Champ obligatoire"),
        price: yup.number().required().typeError("Champ obligatoire"),
    });

    const defaultValues = {
        material: [],
        size: [],
        color: [],
        font: [],
        margin: [],
        finishing: [],
    };

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        reset,
        setFocus,
        control,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    // CASE UPDATE SERVICE
    useEffect(() => {
        if (iri && data) {
            reset(data);
        }
    }, [isLoadingData, data]);

    const onSubmit = (form) => {
        if (!iri) postData(form);
        else {
            putData(form);
        }
    };

    useEffect(() => {
        if (iri && !isPutLoading && isSubmitted && !putError)
            handleCloseModal();
    }, [isPutLoading]);

    useEffect(() => {
        if (isPostLoading && isSubmitted && !postError) handleCloseModal();
    }, [isPostLoading]);

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
            setFocus(putError.response.data.violations[0].propertyPath);
        }
    }, [putError, postError]);

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
            isLoading={isSubmitting || isPutLoading || isPostLoading}
            isDisabled={isSubmitting || isPutLoading || isPostLoading}
        >
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
                label="Intitulé"
                error={errors["title"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="invoiceTitle"
                label="Intitulé Facture"
                error={errors["invoiceTitle"]}
                register={register}
                required={false}
            />
            <SelectInput
                name="category"
                label="Catégorie"
                error={errors["category"]}
                register={register}
                setValue={setValue}
                required={true}
            />
            <FieldArray
                name="material"
                label="Matières"
                placeholder="ex : Gravoply 2 mm"
                error={errors["material"]}
                control={control}
                required={false}
            />
            <FieldArray
                name="size"
                label="Dimensions"
                placeholder="ex : 45 x 30 mm"
                error={errors["title"]}
                control={control}
                required={false}
            />
            <FieldArray
                name="color"
                label="Couleurs"
                placeholder="ex : Blanc / Noir"
                error={errors["color"]}
                control={control}
                required={false}
            />
            {/* <FieldArray
                name="font"
                label="Polices"
                placeholder="ex : Arial rounded bold - 10 pts - spacing 90%"
                error={errors['title']}
                control={control}
                required={false}
            />
            <FormInputMargin
                type="text"
                name="margin"
                label="Marges (mm)"
                placeholder="ex : 2 mm"
                error={errors['title']}
                setValue={setValue}
                control={control}
                required={false}
            /> */}
            <FieldArray
                name="finishing"
                label="Finitions"
                placeholder="ex : Chanfrein"
                error={errors["finishing"]}
                control={control}
                required={false}
            />
            <FormInput
                type="text"
                name="configuration"
                label="Configuration machine"
                error={errors["configuration"]}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="price"
                label="Tarif H.T."
                error={errors["price"]}
                register={register}
                required={true}
            />
        </Form>
    );
}
