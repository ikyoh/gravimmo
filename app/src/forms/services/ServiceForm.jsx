import { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { usePostService, usePutService, useService } from 'hooks/useService'
import { SelectInput } from "components/forms/select-input/SelectInput";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Form from "components/forms/form/Form";
import { FormInput } from "components/forms/input/FormInput";
import FormInputMargin from "components/forms/input-margin/FormInputMargin";
import FieldArray from "components/forms/field-array/FieldArray";

export default function ServiceForm({ id = false, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useService(id)
    const { mutate: postService, isLoading: isPosting, isSuccess } = usePostService()
    const { mutate: putService } = usePutService()

    // Set form values
    useEffect(() => {
        if (id && data) {
            reset(data)
        }
    }, [isLoadingData, data])

    console.log('data', data)


    const onSubmit = form => {
        if (!id)
            postService(form)
        else {
            putService(form)
        }
        handleCloseModal()
    }

    const validationSchema = yup.object({
        title: yup.string().required("Champ obligatoire"),
        category: yup.string().required("Champ obligatoire"),
        price: yup.number().required().typeError("Champ obligatoire"),
    })

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: id ? data : {}
    })

    if (isLoadingData) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2 className='py-3'>Error : {error.message}</h2>
    }

    return (

        <Form onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}>
            <FormInput
                type="text"
                name="title"
                label="Intitulé"
                errors={errors}
                register={register}
                required={true}
            />
            <SelectInput
                name="category"
                label="Catégorie"
                errors={errors}
                register={register}
                setValue={setValue}
                required={true}
            />
            <FieldArray
                name="material"
                label="Matières"
                placeholder="ex : Gravoply 2 mm"
                errors={errors}
                control={control}
                required={false}
            />
            <FieldArray
                name="size"
                label="Dimensions"
                placeholder="ex : 45 x 30 mm"
                errors={errors}
                control={control}
                required={false}
            />
            <FieldArray
                name="color"
                label="Couleurs"
                placeholder="ex : Blanc / Noir"
                errors={errors}
                control={control}
                required={false}
            />
            <FieldArray
                name="font"
                label="Polices"
                placeholder="ex : Arial rounded bold - 10 pts - spacing 90%"
                errors={errors}
                control={control}
                required={false}
            />
            <FormInputMargin
                type="text"
                name="margin"
                label="Marges (mm)"
                placeholder="ex : 2 mm"
                errors={errors}
                setValue={setValue}
                control={control}
                required={false}
            />
            <FormInput
                type="text"
                name="configuration"
                label="Configuration machine"
                errors={errors}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="price"
                label="Tarif H.T."
                errors={errors}
                register={register}
                required={true}
            />
        </Form>
    );
}