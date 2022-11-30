import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { usePostData, usePutData, useGetOneData } from 'hooks/useProperty';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import FieldArray from "components/form/field-array/FieldArray";
import FormInputContact from 'components/form/input-contact/FormInputContact';
import FormCheckbox from 'components/form/checkbox/FormCheckbox';

export default function PropertyForm({ id, trusteeIRI, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useGetOneData(id)
    const { mutate: postData, isLoading: isPosting, isSuccess } = usePostData()
    const { mutate: putData } = usePutData()

    console.log('data', data)

    const validationSchema = yup.object({
        title: yup.string().required("Champ obligatoire"),
        address: yup.string().required("Champ obligatoire"),
        postcode: yup.string().required("Champ obligatoire"),
        city: yup.string().required("Champ obligatoire"),
        tva: yup.number().required("Champ obligatoire"),
    })

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: id ? data : { params: [] }
    })

    // Set form values
    useEffect(() => {
        if (!id) {
            reset({})
        }
        if (!id && trusteeIRI) {
            reset({ trustee: trusteeIRI })
        }
        if (!id && !trusteeIRI) {
            reset({})
        }
    }, [])

    useEffect(() => {
        if (id && data) {
            reset(data)
        }
    }, [isLoadingData, data])

    const onSubmit = form => {
        if (!id)
            postData(form)
        else {
            const updateForm = {...form}
            delete updateForm.trustee
            putData(updateForm)
        }
        handleCloseModal()
    }

    if (id) {
        if (isLoadingData) {
            return <h2>Loading...</h2>
        }

        if (isError) {
            return <h2 className='py-3'>Error : {error.message}</h2>
        }
    }

    return (

        <Form onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}>
            <FormInput
                type="text"
                name="title"
                label="Nom"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="address"
                label="Adresse"
                errors={errors}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="postcode"
                label="Code postal"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="city"
                label="Ville"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="zone"
                label="Secteur"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="contactName"
                label="Nom du contact"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="contactPhone"
                label="Téléphone du contact"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="accessType"
                label="Type d'accès"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="accessCode"
                label="Code d'accès"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="tva"
                label="Taux de TVA"
                errors={errors}
                register={register}
                required={true}
            />
            <div className="grid grid-cols-2">
                <FormCheckbox
                    name="params"
                    label="Entrée"
                    value="Entrée"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="N° de porte"
                    value="N° de porte"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="N° d'appartement"
                    value="N° d'appartement"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="N° d'étage"
                    value="N° d'étage"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="N° de boîte aux lettres"
                    value="N° de boîte aux lettres"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="N° de lot"
                    value="N° de lot"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="N° de villa"
                    value="N° de villa"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="Situation palière"
                    value="Situation palière"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="Tableau boîte aux lettres"
                    value="Tableau boîte aux lettres"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="Platine à défilement"
                    value="Platine à défilement"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="Platine parlophone électricien"
                    value="Platine parlophone électricien"
                    errors={errors}
                    register={register}
                    required={true}
                />
                <FormCheckbox
                    name="params"
                    label="Tableau PTT"
                    value="Tableau PTT"
                    errors={errors}
                    register={register}
                    required={true}
                />
            </div>
        </Form>
    );
}