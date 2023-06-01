import { useForm } from "react-hook-form";
import { useGetAllDatas } from 'queryHooks/useService';
import { usePutData } from 'queryHooks/useOrder';
import Form from "components/form/form/Form";
import Loader from 'components/loader/Loader';
import uuid from "react-uuid"
import { BsXCircle } from "react-icons/bs";

export const OrderServiceForm = ({ id, services = [], handleCloseModal }) => {

    const { isLoading: isLoadingServices, data: dataServices, isError, error } = useGetAllDatas('', 'category', 'asc')

    const { mutate: putData } = usePutData()

    const defaultValues = {
        id: id,
        services: services
    }

    const { handleSubmit, setValue, getValues, watch, formState: { errors, isSubmitting } } = useForm({
        defaultValues: defaultValues
    })

    const SelectedService = ({ iri, index }) => {
        let service = dataServices.find(f => f["@id"] === iri)
        return (
            <button className="btn flex justify-between"
                onClick={() => handleRemoveService(index)}
            >
                {service.title}
                <BsXCircle size={30} />
            </button>
        )
    }

    const handleAddService = (iri) => {
        let servicesValue = getValues("services")
        servicesValue.push(iri)
        setValue("services", servicesValue)
    }

    const handleRemoveService = (index) => {
        let servicesValue = getValues("services")
        servicesValue.splice(index,1)
        setValue("services", servicesValue)
    }

    // CASE UPDATE SERVICE
    // useEffect(() => {
    //     if (iri && data) {
    //         reset(data)
    //     }
    // }, [isLoadingData, data])

    const onSubmit = form => {
        console.log('form', form)
        // if (!iri)
        //     postData(form)
        // else {
        //     putData(form)
        // }
        putData(form)
        handleCloseModal()
    }

    if (isLoadingServices) return <Loader />
    else return (

        <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {watch("services").map((value, index) =>
                    <SelectedService iri={value} key={uuid()} index={index} />
                )}
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
            >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {dataServices.map(service =>
                        <button
                            type='button'
                            key={uuid()}
                            className='btn btn-primary btn-full flex justify-between'
                            onClick={() => handleAddService(service["@id"])}
                        >
                            {service.title}
                            <div className="text-accent bg-white text-sm px-3 py-1 rounded-full">
                                {service.category}
                            </div>
                        </button>
                    )}
                </div>
            </Form>
        </>
    );
}