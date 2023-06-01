import { useState, useEffect } from 'react';
import { FormProvider, useForm } from "react-hook-form"
import { ErrorMessage } from '@hookform/error-message';
import { usePostData, usePutData, useGetOneData } from 'queryHooks/useOrder';
import Form from "components/form/form/Form";
import { useGetAllDatas as useTrustee } from 'queryHooks/useTrustee';
import { useGetFilteredDatasByTrustee, useGetIRI as getProperty } from 'queryHooks/useProperty';
import classNames from 'classnames';
import { orderDetails } from 'config/translations.config';
import Label from 'components/form/label/FormLabel'
import uuid from 'react-uuid';
import Loader from 'components/loader/Loader';
import { useSearch } from 'hooks/useSearch';

export default function OrderForm({ id, handleCloseModal }) {

    const { isLoading: isLoadingData, data, isError, error } = useGetOneData(id)
    const { mutate: postData, isLoading: isPosting, isSuccess } = usePostData()
    const { mutate: putData } = usePutData()

    const [currentStep, setCurrentStep] = useState(null)
    const steps = 3

    const handleNextStep = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            setCurrentStep(cur => cur + 1)
        }
    }

    const handlePrevStep = () => {
        setCurrentStep(cur => cur - 1)
    }

    const methods = useForm({
        defaultValues: id ? data : {},
        shouldUnregister: false,
        shouldFocusError: true,
        reValidateMode: 'onSubmit',
        mode: 'onChange'
    });

    const { register, handleSubmit, setValue, reset, watch, trigger, setFocus, formState: { errors, isSubmitting } } = methods

    // Set form values
    useEffect(() => {
        if (!id) {
            reset({})
            setCurrentStep(1)
        }
    }, [])

    useEffect(() => {
        if (id && data) {
            reset(data)
            setCurrentStep(3)
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


    const Button = ({ data, value }) => {

        const className = classNames("p-3 flex justify-between cursor-pointer hover:bg-accent",
            {
                "bg-accent": watch(value) === data['@id']
            })

        return (
            <div className={className}
                onClick={() => setValue(value, data['@id'])}>
                <div>
                    {data.title}
                </div>
                <div>
                    {data.postcode} - {data.city}
                </div>
            </div>
        )
    }



    const Step1 = () => {
        const { data = [], isLoading, error } = useTrustee('', 'title', 'asc')
        const { searchValue, searchbar } = useSearch("")
        return (
            isLoading
                ? <Loader />
                : <>
                    <input
                        type='hidden'
                        {...register("trustee", {
                            required: true
                        })}
                    />
                    <div className='text-xl font-bold leading-8 text-white mb-3'>Syndic</div>
                    {searchbar}
                    <div className='card mt-3 divide-y divide-slate-500/20'>
                        {data
                            .filter(f => f.title.toLowerCase().includes(searchValue.toLowerCase()))
                            .map(data =>
                                <Button key={data.id} data={data} value="trustee" />
                            )}
                        {data.filter(f => f.title.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && "Aucun résultat"}
                    </div>
                </>
        )
    }

    const Step2 = () => {
        const { data = [], isLoading, error } = useGetFilteredDatasByTrustee(watch("trustee"))
        const { searchValue, searchbar } = useSearch("")
        return (
            isLoading
                ? <Loader />
                : <>
                    <input
                        type='hidden'
                        {...register("property", {
                            required: true
                        })}
                    />
                    <div className='text-xl font-bold leading-8 text-white mb-3'>Copropriété</div>
                    {searchbar}
                    <div className='card mt-3 divide-y divide-slate-500/20'>
                        {data
                            .filter(f => f.title.toLowerCase().includes(searchValue.toLowerCase()))
                            .map(data =>
                                <Button key={data.id} data={data} value="property" />
                            )}
                    </div>
                    {data.filter(f => f.title.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && "Aucun résultat"}
                </>
        )
    }

    const RequiredInput = ({ name, label, placeholder }) => {
        return (<div key={uuid()} className="w-full mb-2">
            <Label name={name} label={label} required={true} />
            <input
                id={name}
                {...register(name, { required: "Champ obligatoire." })}
                className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent"
                placeholder={placeholder}
            />
            <ErrorMessage
                errors={errors}
                name={name}
                render={({ message }) => <span className="text-error text-sm">{message}</span>}
            />
        </div>
        )
    }

    const Input = ({ name, label, placeholder }) => {
        return (<div className="w-full mb-2">
            <Label name={name} label={label} required={true} />
            <input
                id={name}
                {...register(name)}
                className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent"
                placeholder={placeholder}
            />
            <ErrorMessage
                errors={errors}
                name={name}
                render={({ message }) => <span className="text-error text-sm">{message}</span>}
            />
        </div>
        )
    }

    const Step3 = () => {

        useEffect(() => {
            if (errors.details)
                setFocus("details." + Object.keys(errors.details)[0])
        }, [errors, setFocus]);

        const { data, isLoading, error } = getProperty(watch("property"))

        return (
            isLoading
                ? <Loader />
                :
                <div>
                    <Input
                        name="details.proprietaire"
                        label="Propriétaire"
                        placeholder="Nom de l'ancien occupant"
                    />
                    <RequiredInput
                        name="details.ancienoccupant"
                        label="Ancien occupant"
                        placeholder="Nom de l'ancien occupant"
                    />
                    <RequiredInput
                        name="details.nouveloccupant"
                        label="Nouvel occupant"
                        placeholder="Nom du nouvel occupant"
                    />
                    {data && data.params
                        .filter(f => f !== 'tableauptt' && f !== 'platineparlophoneelectricien' && f !== 'platineadefilement')
                        .map((item) => (
                            <div key={uuid()} className="w-full mb-2">
                                <Label name={`details.${item}`} label={orderDetails[item]} required={true} />
                                <input {...register(`details.${item}`, { required: "Champ obligatoire." })}
                                    className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent"
                                    placeholder={orderDetails[item]}
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name={`details.${item}`}
                                    render={({ message }) => <span className="text-error text-sm">{message}</span>}
                                />
                            </div>
                        ))
                    }
                </div>
        )
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} steps={steps} currentStep={currentStep}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
            >
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
            </Form>
        </FormProvider>
    );
}