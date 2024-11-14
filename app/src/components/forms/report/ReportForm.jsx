import { yupResolver } from "@hookform/resolvers/yup";
import FormCheckbox from 'components/form/checkbox/FormCheckbox';
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import Label from "components/form/label/FormLabel";
import Loader from "components/loader/Loader";
import { useGetIRI, usePostData, usePutData } from "queryHooks/useReport";
import { useGetAllDatas } from "queryHooks/useService";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
import { deepClone } from "utils/functions.utils";
import * as yup from "yup";


export default function ReportForm({ iri, handleCloseModal }) {
    const { isLoading: isLoadingData, data } = useGetIRI(iri);
    const { isLoading: isLoadingServices, data: services } = useGetAllDatas();
    const {
        mutate: postData,
        isLoading: isPostLoading,
        isSuccess: isPostSuccess,
    } = usePostData();
    const {
        mutate: putData,
        isLoading: isPutLoading,
        isSuccess: isPutSuccess,
    } = usePutData();

    const validationSchema = yup.object({
        title: yup.string().required("Champ obligatoire"),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // CASE UPDATE SERVICE
    useEffect(() => {
        if (iri && data && services) {
            reset(data);
        }
    }, [isLoadingData, isLoadingServices, data, services]);

    const onSubmit = (form) => {
        const _form = deepClone(form);
        _form.service = _form.service ? _form.service : null;
        if (!iri) postData(_form);
        else {
            putData(_form);
        }
    };

    useEffect(() => {
        if (isPostSuccess || isPutSuccess) handleCloseModal();
    }, [isPostLoading, isPutLoading]);

    if ((iri && isLoadingData) || isLoadingServices) return <Loader />;

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting || isPutLoading || isPostLoading}
            isDisabled={isSubmitting || isPutLoading || isPostLoading}
        >
            <FormInput
                type="text"
                name="title"
                placeholder="Intitulé de l'incident"
                label="Intitulé"
                error={errors["title"]}
                register={register}
                required={true}
            />
            <div className="w-full mb-2">
                <Label name="service" label="Prestation associée" />
                <select name="service" {...register("service")}>
                    <option value="">Aucune</option>
                    {services?.map((item) => (
                        <option key={uuid()} value={item["@id"]}>
                            {item.title}
                        </option>
                    ))}
                </select>
            </div>
            <FormCheckbox
                name="toDeliver"
                label="Implique une remise en tournée"
                error={errors['toDeliver']}
                register={register}
                required={true}
            />
        </Form>
    );
}
