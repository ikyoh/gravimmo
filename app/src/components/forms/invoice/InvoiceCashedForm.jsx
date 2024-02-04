import { yupResolver } from "@hookform/resolvers/yup";
import Form from "components/form/form/Form";
import dayjs from "dayjs";
import { usePutData } from "queryHooks/useInvoice";
import { useEffect } from "react";
import Calendar from "react-calendar";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function InvoiceCashedForm({ id, handleCloseModal }) {
    const { mutate, isLoading, isSuccess } = usePutData();

    const defaultValues = {
        id: id,
        cashedAt: dayjs().format("YYYY-MM-DD"),
        status: "lettré",
    };

    const validationSchema = yup.object({
        id: yup.string().required("Champ obligatoire"),
        cashedAt: yup.string().required("Champ obligatoire"),
    });

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    const watchDate = watch("cashedAt");

    const onSubmit = (form) => {
        mutate(form);
    };

    useEffect(() => {
        if (isSuccess) handleCloseModal();
    }, [isSuccess]);

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            isDisabled={isLoading}
        >
            <Calendar
                onChange={(date) =>
                    setValue("cashedAt", dayjs(date).format("YYYY-MM-DD"))
                }
                value={watchDate}
                maxDetail="month"
                minDetail="month"
                view="month"
                locale="fr-FR"
            />
        </Form>
    );
}
