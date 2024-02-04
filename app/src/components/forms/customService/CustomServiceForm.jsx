import React, { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useGetIRI, usePutData } from 'queryHooks/useCommand';
import { useGetIRI as useProperty } from "queryHooks/useProperty"
import { useGetIRI as usePropertyService } from "queryHooks/usePropertyService"
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput"
import FormCheckbox from 'components/form/checkbox/FormCheckbox'
import Loader from "components/loader/Loader"
import { commandDetails } from "config/translations.config"
import Dropdown from 'components/dropdown/Dropdown'
import { Button, ButtonSize } from 'components/button/Button'


export const CustomServiceForm = ({ commandIRI, handleCloseModal }) => {

    const { isLoading: isLoadingCommand, data: dataCommand } = useGetIRI(commandIRI)
    const { data: property, isLoading: isLoadingProperty } = useProperty(dataCommand && dataCommand.property ? dataCommand.property : '')
    //const { mutate: postData, isLoading: isPostLoading, isSuccess: isPostSuccess } = usePostData()
    const { mutate: putData, isLoading: isPutLoading, isSuccess: isPutSuccess } = usePutData()

    const defaultValues = {
        id: dataCommand ? dataCommand.id : "",
        customServices: []
    }

    const { handleSubmit, register, reset, control, formState: { isSubmitting } } = useForm({
        defaultValues: defaultValues
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "customServices"
    })


    const ServiceCheckbox = ({ serviceIRI, name }) => {

        const { data: propertyService, isLoading: isLoadingService } = usePropertyService(serviceIRI)

        if (isLoadingService) return (<Loader />)
        return (
            <FormCheckbox
                name={name}
                label={propertyService.service.title}
                value={serviceIRI}
                register={register}
            />
        )

    }

    const onSubmit = form => {
        putData(form)
    }

    useEffect(() => {
        if (isPutSuccess)
            handleCloseModal()
    }, [isPutSuccess])

    if (isLoadingCommand || isLoadingProperty) return <Loader />

    return (
        <Form onSubmit={handleSubmit(onSubmit)}
        isLoading={isPutLoading}
        isDisabled={isPutLoading}
        >
            <ul>
                {fields.map((item, index) => {
                    return (
                        <li key={item.id} className="mb-3 rounded p-3 pr-10 bg-black/10 md:grid md:grid-cols-2 gap-10 relative">
                            <div>
                                <FormInput
                                    type="text"
                                    name={`customServices.${index}.details.nouveloccupant`}
                                    label="Nouvel occupant"
                                    register={register}
                                    required={true}
                                />
                                <FormInput
                                    type="text"
                                    name={`customServices.${index}.details.ancienoccupant`}
                                    label="Ancien occupant"
                                    register={register}
                                    required={false}
                                />
                                {property && property.params
                                    .filter(f => f !== 'tableauptt' && f !== 'platineparlophoneelectricien' && f !== 'platineadefilement')
                                    .map((item) => (
                                        <FormInput
                                            type="text"
                                            key={`customServices.${index}.details.${item}`}
                                            name={`customServices.${index}.details.${item}`}
                                            label={commandDetails[item]}
                                            register={register}
                                            required={false}
                                        />
                                    ))
                                }
                            </div>
                            <div className="">
                                {property.services.map(IRI =>
                                    <ServiceCheckbox
                                        key={`${index}.${IRI}`}
                                        serviceIRI={IRI}
                                        name={`customServices.${index}.propertyServices`}
                                    />
                                )}
                            </div>
                            <div className="absolute top-2 right-1">
                                <Dropdown>
                                    <button
                                        onClick={() => remove(index)}
                                    >
                                        Retirer la prestation
                                    </button>
                                </Dropdown>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className="card-button">
                <Button size={ButtonSize.Big}
                    onClick={() => {
                        append({
                            details: { nouveloccupant: "" },
                            propertyServices: property.services
                        },
                            { focusName: `services.${fields.length}.details.nouveloccupant` })
                    }} />
                <div className="text-dark dark:text-white">
                    ajouter <br /> une prestation
                </div>
            </div>
        </Form>
    )
}
