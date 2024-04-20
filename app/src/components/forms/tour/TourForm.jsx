import { yupResolver } from "@hookform/resolvers/yup";
import Form from "components/form/form/Form";
import Loader from "components/loader/Loader";
import { useGetAllDatas } from "queryHooks/useInstaller";
import { useGetDate, usePostData, usePutData } from "queryHooks/useTour";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { arrayOfIris, deepClone } from "utils/functions.utils";
import * as yup from "yup";

import FormError from "components/form/error/FormError";
import Calendar from "react-calendar";
import uuid from "react-uuid";
import "./style.css";

const TourForm = ({ id, commands = [], handleCloseModal }) => {
    const { data: installers, isLoading: isLoadingInstallers } =
        useGetAllDatas();
    const { mutate: postData, isLoading: isPostLoading } = usePostData();
    const { mutate: putData, isLoading: isPutLoading } = usePutData();

    const validationSchema = yup.object({
        scheduledAt: yup.date().required("Champ obligatoire"),
        user: yup.string().required("Choix obligatoire"),
    });

    const defaultValues = {
        scheduledAt: new Date(),
        commands: arrayOfIris(commands),
        positions: [],
    };

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    const watchDate = watch("scheduledAt");
    const watchUser = watch("user");

    // if a tour exist for the selected date
    const { data: tour, isLoading: isLoadingTour } = useGetDate(
        watchDate,
        watchUser
    );

    const onSubmit = (form) => {
        if (tour["hydra:totalItems"] !== 0) {
            if (commands.length === 0) {
                let _form = deepClone(form);
                delete _form.commands;
                putData({
                    ...form,
                    id: tour["hydra:member"][0].id,
                });
            }
            if (commands.length !== 0) {
                putData({
                    ...form,
                    commands: [
                        ...arrayOfIris(tour["hydra:member"][0].commands),
                        ...arrayOfIris(commands),
                    ],
                    id: tour["hydra:member"][0].id,
                });
            }
        }
        if (tour["hydra:totalItems"] === 0) {
            postData(form);
        }
    };

    useEffect(() => {
        if (isSubmitSuccessful) handleCloseModal();
    }, [isSubmitSuccessful, handleCloseModal]);

    if (isLoadingInstallers) return <Loader />;

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            isLoading={
                isSubmitting || isPutLoading || isPostLoading || isLoadingTour
            }
            isDisabled={
                isSubmitting || isPutLoading || isPostLoading | isLoadingTour
            }
        >
            <div className="mb-3">
                <div className="divider uppercase">Poseur</div>
                <div className="grid grid-cols-2 gap-3">
                    {installers["hydra:member"]?.map((installer) => (
                        <button
                            key={uuid()}
                            type="button"
                            className={`btn ${
                                watchUser === installer["@id"] && "btn-primary"
                            }`}
                            onClick={() => setValue("user", installer["@id"])}
                        >
                            {installer.firstname}
                        </button>
                    ))}
                </div>
                <div>
                    <FormError error={errors["user"]} />
                </div>
            </div>

            <div className="divider mt-10 uppercase">Date</div>
            <Calendar
                onChange={(date) => setValue("scheduledAt", date)}
                value={watchDate}
                maxDetail="month"
                minDetail="month"
                view="month"
                locale="fr-FR"
            />
        </Form>
    );
};

export default TourForm;
