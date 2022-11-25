import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { usePostData, usePutData, useGetOneData } from 'hooks/useContact';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import FieldArray from "components/form/field-array/FieldArray";
import FormInputContact from 'components/form/input-contact/FormInputContact';

export default function ContactForm({ id, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useGetOneData(id)
    const { mutate: postData, isLoading: isPosting, isSuccess } = usePostData()
    const { mutate: putData } = usePutData()

    const validationSchema = yup.object({
        title: yup.string().required("Champ obligatoire"),
        firstname: yup.string().required("Champ obligatoire"),
        lastname: yup.string().required("Champ obligatoire"),
        phone: yup.string().required("Champ obligatoire"),
        email: yup.string().email('Email non valide').required('Champ obligatoire'),
    })

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting } } = useForm({
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

    const onSubmit = form => {
        console.log('form', form)
        if (!id)
            postData(form)
        else {
            putData(form)
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
                label="Fonction"
                errors={errors}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="lastname"
                label="Nom"
                errors={errors}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="firstname"
                label="Prénom"
                errors={errors}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="email"
                label="Email"
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
        </Form>
    );
}