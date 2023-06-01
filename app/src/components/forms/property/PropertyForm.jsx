import { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { usePostData, usePutData, useGetOneData } from 'queryHooks/useProperty'
import { useGetAllDatas } from 'queryHooks/useTrustee'
import Form from "components/form/form/Form"
import { FormInput } from "components/form/input/FormInput"
import FormCheckbox from 'components/form/checkbox/FormCheckbox'
import { FormSelect } from 'components/form/select/FormSelect'
import { orderDetails } from 'config/translations.config'

export default function PropertyForm({ id, trusteeIRI, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useGetOneData(id)
    const { isLoading: isLoadingTrustees, data: dataTrustees, isError: isErrorTrustees, error: errorTrustees } = useGetAllDatas("", "title", "ASC")
    const { mutate: postData, isLoading: isPosting, isSuccess } = usePostData()
    const { mutate: putData } = usePutData()

    const validationSchema = yup.object({
        trustee: yup.string().required("Champ obligatoire"),
        title: yup.string().required("Champ obligatoire"),
        address: yup.string().required("Champ obligatoire"),
        postcode: yup.string().required("Champ obligatoire"),
        city: yup.string().required("Champ obligatoire"),
        zone: yup.string().required("Champ obligatoire"),
        tva: yup.number().typeError("Champ obligatoire"),

    })

    const defaultValues = { params: [] }

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues
    })

    // CASE NEW PROPERTY FROM TRUSTEE
    useEffect(() => {
        if (trusteeIRI && !id) {
            reset({ ...defaultValues, trustee: trusteeIRI })
        }
    }, [isLoadingTrustees, dataTrustees])

    // CASE UPDATE PROPERTY
    useEffect(() => {
        if (id && data) {
            reset({ ...data, trustee: data.trustee["@id"] })
        }
    }, [isLoadingData, data])

    const onSubmit = form => {
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
            isDisabled={isSubmitting}
        >
            {!trusteeIRI &&
                <FormSelect
                    type="text"
                    name="trustee"
                    label="Syndic"
                    error={errors['title']}
                    register={register}
                    required={true}
                >
                    {isLoadingTrustees &&
                        <option value="">Chargement des syndics</option>
                    }
                    {!isLoadingTrustees && dataTrustees.length != 0 &&
                        < option value="">Choisir un syndic</option>
                    }
                    {!isLoadingTrustees && dataTrustees.length === 0 &&
                        < option value="">Aucun syndic trouvé</option>
                    }
                    {!isLoadingTrustees && dataTrustees.map(data =>
                        <option key={data["@id"]} value={data["@id"]}>{data.title}</option>
                    )}
                </FormSelect>
            }
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
                name="zone"
                label="Secteur"
                error={errors['zone']}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="contactName"
                label="Nom du contact"
                error={errors['contactName']}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="contactPhone"
                label="Téléphone du contact"
                error={errors['contactPhone']}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="accessType"
                label="Type d'accès"
                error={errors['accessType']}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="accessCode"
                label="Code d'accès"
                error={errors['accessCode']}
                register={register}
                required={false}
            />
            <FormInput
                type="text"
                name="tva"
                label="Taux de TVA %"
                error={errors['tva']}
                register={register}
                required={true}
            />
            <div className="grid grid-cols-2">
                {Object.keys(orderDetails)
                .filter(f => f !== 'proprietaire' &&  f !== 'nouveloccupant' &&  f !== 'ancienoccupant')
                .map((key, index) => (
                    <FormCheckbox
                        key={index}
                        name="params"
                        label={orderDetails[key]}
                        value={key}
                        error={errors['params']}
                        register={register}
                        required={true}
                    />
                ))}
            </div>
        </Form>
    )
}