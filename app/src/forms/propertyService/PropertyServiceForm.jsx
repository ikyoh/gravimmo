import { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { usePostData, usePutData, useGetOneData } from 'hooks/usePropertyService'
import { useGetAllDatas as useGetAllDatasServices, useGetOneData as useGetOneDataService } from 'hooks/useService'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import Form from "components/form/form/Form"
import FormCheckbox from 'components/form/checkbox/FormCheckbox'
import { FormSelect } from 'components/form/select/FormSelect'
import { API_URL, API_SERVICES } from 'config/api.config'
import FormLabel from 'components/form/label/FormLabel'


export default function PropertyServiceForm({ id, propertyIRI, handleCloseModal }) {

    const { isLoading: isLoadingData, data = false, isError, error, isFetched, is } = useGetOneData(id)

    const validationSchema = yup.object({
        service: yup.string().required("Champ obligatoire")
    })

    const { register, handleSubmit, watch, reset, getValues, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: id
            ? {
                ...data,
                service: data.service.id,
                margin: JSON.stringify(data.margin)
            }
            : {
                service: "",
                property: propertyIRI,
                finishing: []
            }
    })

    const watchService = watch("service", false)

    const { data: dataServices = [], isLoading: isLoadingServices, error: errorServices } = useGetAllDatasServices()
    const { isLoading: isLoadingService, data: dataService, isError: isErrorService, error: errorService } = useGetOneDataService(watchService)
    const { mutate: postData, isLoading: isPosting, isSuccess } = usePostData()
    const { mutate: putData } = usePutData()

    // Set form values
    useEffect(() => {
        // if (!id) {
        //     reset({})
        // }
        // if (!id && propertyIRI) {
        //     reset({ property: propertyIRI })
        // }
        // if (!id && !propertyIRI) {
        //     reset({})
        // }
        // if (id && !propertyIRI) {
        //     reset({})
        // }
    }, [])

    useEffect(() => {
        if (!id)
            reset({ property: propertyIRI, service: watchService })
    }, [watchService])

    const onSubmit = form => {
        console.log('form', form)
        const formDatas = { ...form }
        if (form.margin) formDatas.margin = JSON.parse(form.margin)
        formDatas.service = API_URL + API_SERVICES + '/' + form.service
        if (!id)
            postData(formDatas)
        else {
            putData(formDatas)
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
            <FormSelect
                type="text"
                name="service"
                label="Prestation"
                errors={errors}
                register={register}
                required={true}
            >
                {isLoadingServices &&
                    <option value="">Chargement des prestations</option>
                }
                {!isLoadingServices && dataServices.length != 0 &&
                    < option value="">Choisir une prestation</option>
                }
                {!isLoadingServices && dataServices.length === 0 &&
                    < option value="">Aucune prestation trouvée</option>
                }
                {!isLoadingServices && dataServices.map(data =>
                    <option key={data.id} value={data.id}>{data.title} - {data.price} € H.T.</option>
                )}
            </FormSelect>
            {dataService && dataService.material.length != 0 &&
                <FormSelect
                    type="text"
                    name="material"
                    label="Matière"
                    errors={errors}
                    register={register}
                    required={true}
                >
                    {dataService.material.map(data =>
                        <option key={data.data} value={data.data}>{data.data}</option>
                    )}
                </FormSelect>
            }
            {dataService && dataService.size.length != 0 &&
                <FormSelect
                    type="text"
                    name="size"
                    label="Dimensions"
                    errors={errors}
                    register={register}
                    required={true}
                >
                    {dataService.size.map(data =>
                        <option key={data.data} value={data.data}>{data.data}</option>
                    )}
                </FormSelect>
            }
            {dataService && dataService.color.length != 0 &&
                <FormSelect
                    type="text"
                    name="color"
                    label="Couleurs"
                    errors={errors}
                    register={register}
                    required={true}
                >
                    {dataService.color.map(data =>
                        <option key={data.data} value={data.data}>{data.data}</option>
                    )}
                </FormSelect>
            }
            {dataService && dataService.font.length != 0 &&
                <FormSelect
                    type="text"
                    name="font"
                    label="Police"
                    errors={errors}
                    register={register}
                    required={true}
                >
                    {dataService.font.map(data =>
                        <option key={data.data} value={data.data}>{data.data}</option>
                    )}
                </FormSelect>
            }
            {dataService && dataService.margin.length != 0 &&
                <FormSelect
                    type="text"
                    name="margin"
                    label="Marges"
                    errors={errors}
                    register={register}
                    required={true}
                    onChange={(e) => console.log('e.value', e.target.value)}
                >
                    {dataService.margin.map(data =>
                        <option key={JSON.stringify(data.data)} value={JSON.stringify(data.data)}>
                            Haut : {data.data.top} -
                            Bas : {data.data.bottom} -
                            Gauche : {data.data.left} -
                            Droite : {data.data.right}
                        </option>
                    )}
                </FormSelect>
            }

            {dataService && dataService.finishing.length != 0 &&
                <>
                    <FormLabel name="finishing" label="Façonnages" />
                    <div className='grid grid-cols-2'>
                        {dataService.finishing.map(data =>
                            <FormCheckbox
                                key={data.data}
                                name="finishing"
                                label={data.data}
                                value={data.data}
                                errors={errors}
                                register={register}
                            />
                        )}
                    </div>
                </>
            }
        </Form >
    )
}