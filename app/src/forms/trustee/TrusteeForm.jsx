import { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { usePostTrustee, usePutTrustee, useTrustee } from 'hooks/useTrustee'
import { SelectInput } from "components/forms/select-input/SelectInput";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Form from "components/forms/form/Form";
import { FormInput } from "components/forms/input/FormInput";
import FormInputMargin from "components/forms/input-margin/FormInputMargin";
import FieldArray from "components/forms/field-array/FieldArray";

export default function TrusteeForm({ id, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useTrustee(id)
    const { mutate: postTrustee, isLoading: isPosting, isSuccess } = usePostTrustee()
    const { mutate: putTrustee } = usePutTrustee()

    // Set form values
    useEffect(() => {
        if (!id) {
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
            postTrustee(form)
        else {
            putTrustee(form)
        }
        handleCloseModal()
    }

    const validationSchema = yup.object({
        title: yup.string().required("Champ obligatoire"),
        address: yup.string().required("Champ obligatoire"),
        postcode: yup.string().required("Champ obligatoire"),
        city: yup.string().required("Champ obligatoire"),
        email: yup.string().required("Champ obligatoire"),
        billingEmail: yup.string().required("Champ obligatoire"),
    })

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: id ? data : {}
    })

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
                name="email"
                label="Email de contact"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="billingEmail"
                label="Email de facturation"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="phone"
                label="Numéro de téléphone"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="mobile"
                label="Numéro de mobile"
                errors={errors}
                register={register}
                required={true}
            />
        </Form>
    );
}