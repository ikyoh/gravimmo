import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { usePostData, usePutData, useGetID } from 'queryHooks/useTrustee';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import FieldArray from "components/form/field-array/FieldArray";
import Loader from 'components/loader/Loader';


export default function TrusteeForm({ id, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useGetID(id)
    const { mutate: postData, isLoading: isLoadingPost, isSuccess: isSuccessPost, error: errorPost } = usePostData()
    const { mutate: putData, isLoading: isLoadingPut, isSuccess: isSuccessPut, error: errorPut } = usePutData()

    const validationSchema = yup.object({
        title: yup.string().required("Champ obligatoire"),
        color: yup.string().required("Champ obligatoire"),
        address: yup.string().required("Champ obligatoire"),
        postcode: yup.string().required("Champ obligatoire"),
        city: yup.string().required("Champ obligatoire"),
        reference: yup.string().required("Champ obligatoire").max(5, '5 caractères maximum autorisé'),
        email: yup.string().email('Email non valide').required('Champ obligatoire'),
        billingEmail: yup.string().email('Email non valide').required('Champ obligatoire'),
    })

    const { register, handleSubmit, setValue, setError, setFocus, reset, control, formState: { errors, isSubmitting, isSubmitted } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: id ? data : {}
    })

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

    useEffect(() => {
        if (errorPut) {
            errorPut.response.data.violations.forEach(({ propertyPath, message }) => {
                setError(propertyPath, { type: 'custom', message: message })
            })
            setFocus(errorPut.response.data.violations[0].propertyPath)
        }
        if (errorPost) {
            errorPost.response.data.violations.forEach(({ propertyPath, message }) => {
                setError(propertyPath, { type: 'custom', message: message })
            })
            setFocus(errorPut.response.data.violations[0].propertyPath)
        }
    }, [errorPut, errorPost])

    useEffect(() => {
        if (isSuccessPost || isSuccessPut) handleCloseModal()
    }, [isSuccessPost, isSuccessPut])


    const onSubmit = form => {
        console.log('form', form)
        if (!id)
            postData(form)
        else {
            putData(form)
        }
    }

    if (id) {
        if (isLoadingData) {
            return <Loader />
        }

        if (isError) {
            return <h2 className='py-3'>Error : {error.message}</h2>
        }
    }

    return (

        <Form onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting || isLoadingPost || isLoadingPut}
            isDisabled={isSubmitting || isLoadingPost || isLoadingPut}>
            <FormInput
                type="text"
                name="title"
                label="Nom"
                error={errors['title']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="reference"
                label="Référence"
                error={errors['reference']}
                register={register}
                required={true}
            />
            <FormInput
                type="color"
                name="color"
                label="Couleur"
                error={errors['color']}
                register={register}
                required={true}
            />
            <FormInput
                type="color"
                name="color2"
                label="Couleur secondaire"
                error={errors['color2']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="address"
                label="Adresse"
                error={errors['address']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="postcode"
                label="Code postal"
                error={errors['postcode']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="city"
                label="Ville"
                error={errors['city']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="email"
                label="Email de contact"
                error={errors['email']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="billingEmail"
                label="Email de facturation"
                error={errors['billingEmail']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="phone"
                label="Numéro de téléphone"
                error={errors['phone']}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="mobile"
                label="Numéro de mobile"
                error={errors['mobile']}
                register={register}
                required={false}
            />
            <FieldArray
                name="orderTag"
                label="Code de facturation"
                placeholder="E234321"
                error={errors['orderTag']}
                control={control}
                required={false}
            />
        </Form>
    );
}