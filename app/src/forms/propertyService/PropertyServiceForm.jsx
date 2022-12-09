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

export default function PropertyServiceForm({ id, propertyIRI, handleCloseModal }) {

    const validationSchema = yup.object({
        service: yup.string().required("Champ obligatoire"),
        // address: yup.string().required("Champ obligatoire"),
        // postcode: yup.string().required("Champ obligatoire"),
        // city: yup.string().required("Champ obligatoire"),
        // tva: yup.number().required("Champ obligatoire"),
    })

    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: id ? data : {
            property: propertyIRI,
            margin: { top: '', bottom: '', left: '', right: '' }
        }
    })

    const watchService = watch("service", false)

    const { isLoading: isLoadingData, data, isError, error } = useGetOneData(id)
    const { data: dataServices = [], isLoading: isLoadingServices, error: errorServices } = useGetAllDatasServices()
    const { isLoading: isLoadingService, data: dataService, isError: isErrorService, error: errorService } = useGetOneDataService(watchService)
    const { mutate: postData, isLoading: isPosting, isSuccess } = usePostData()


    // Set form values
    useEffect(() => {
        if (!id) {
            reset({})
        }
        if (!id && propertyIRI) {
            reset({ property: propertyIRI })
        }
        if (!id && !propertyIRI) {
            reset({})
        }
    }, [])

    useEffect(() => {
        if (id && data) {
            reset(data)
        }
    }, [isLoadingData, data])

    const onSubmit = form => {
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
        </Form >
    )
}