import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { usePostData, usePutData, useGetIRI } from 'queryHooks/useUser';
import { useGetAllDatas } from 'queryHooks/useTrustee'
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import Loader from 'components/loader/Loader';
import FormCheckbox from 'components/form/checkbox/FormCheckbox';

export default function UserForm({ iri, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useGetIRI(iri)
    const { mutate: postData, isLoading: isPostLoading, isSuccess: isPostSuccess } = usePostData()
    const { mutate: putData, isLoading: isPutLoading, isSuccess: isPutSuccess } = usePutData()

    const validationSchema = yup.object({
        title: yup.string().required("Champ obligatoire"),
        firstname: yup.string().required("Champ obligatoire"),
        lastname: yup.string().required("Champ obligatoire"),
        phone: yup.string().required("Champ obligatoire"),
        email: yup.string().email('Email non valide').required('Champ obligatoire'),
        isActive: yup.boolean().required('Champ obligatoire'),
        roles: yup.array().min(1, "Champ obligatoire").required("Champ obligatoire"),
    })

    const defaultValues = {
        roles: ["ROLE_INSTALLER"],
        title: "Poseur"
    }

    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues
    })


    // CASE UPDATE CONTACT
    useEffect(() => {
        if (iri && data) {
            reset({ ...data })
        }
    }, [isLoadingData, data])

    const onSubmit = form => {
        const _form = { ...form }
        if (!iri)
            postData(_form)
        else {
            delete _form.roles
            putData(_form)
        }
    }

    useEffect(() => {
        if (isPutSuccess || isPostSuccess)
            handleCloseModal()
    }, [isPutSuccess, isPostSuccess])

    if (iri) {
        if (isLoadingData) {
            return <Loader />
        }

        if (isError) {
            return <h2 className='py-3'>Error : {error.message}</h2>
        }
    }

    return (

        <Form onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting || isPutLoading || isPostLoading}
            isDisabled={isSubmitting || isPutLoading || isPostLoading}
        >
            <FormInput
                type="text"
                name="lastname"
                label="Nom"
                error={errors['lastname']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="firstname"
                label="Prénom"
                error={errors['firstname']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="email"
                label="Email"
                error={errors['email']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="phone"
                label="Numéro de téléphone"
                error={errors['phone']}
                register={register}
                required={true}
            />
            <FormCheckbox
                name="isActive"
                label="Compte actif"
                error={errors['params']}
                register={register}
                required={true}
            />
        </Form>
    );
}