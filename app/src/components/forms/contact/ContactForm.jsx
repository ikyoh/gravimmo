import { yupResolver } from "@hookform/resolvers/yup";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import { FormSelect } from "components/form/select/FormSelect";
import Loader from "components/loader/Loader";
import { useGetIRI, usePostData, usePutData } from "queryHooks/useContact";
import { useGetAllDatas } from "queryHooks/useTrustee";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function ContactForm({ iri, trusteeIRI, handleCloseModal }) {
    const { isLoading: isLoadingData, data, isError, error } = useGetIRI(iri);
    const {
        isLoading: isLoadingTrustees,
        data: dataTrustees,
        isError: isErrorTrustees,
        error: errorTrustees,
    } = useGetAllDatas("", "title", "ASC");
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
        trustee: yup.string().required("Champ obligatoire"),
        title: yup.string().required("Champ obligatoire"),
        firstname: yup.string().required("Champ obligatoire"),
        lastname: yup.string().required("Champ obligatoire"),
        //phone: yup.string().required("Champ obligatoire"),
        email: yup
            .string()
            .email("Email non valide")
            .required("Champ obligatoire"),
    });

    const defaultValues = {};

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    // CASE NEW CONTACT FROM TRUSTEE
    useEffect(() => {
        if (trusteeIRI && !iri) {
            reset({ ...defaultValues, trustee: trusteeIRI });
        }
    }, [isLoadingTrustees, dataTrustees]);

    // CASE UPDATE CONTACT
    useEffect(() => {
        if (iri && data) {
            reset({ ...data, trustee: data.trustee });
        }
    }, [isLoadingData, data]);

    const onSubmit = (form) => {
        const submitDatas = { ...form };
        if (!iri) postData(submitDatas);
        else {
            if (form.trustee !== data.trustee) submitDatas.properties = [];
            putData(submitDatas);
        }
    };

    useEffect(() => {
        if (isPutSuccess || isPostSuccess) handleCloseModal();
    }, [isPutSuccess, isPostSuccess]);

    if (iri) {
        if (isLoadingData) {
            return <Loader />;
        }

        if (isError) {
            return <h2 className="py-3">Error : {error.message}</h2>;
        }
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting || isPutLoading || isPostLoading}
            isDisabled={isSubmitting || isPutLoading || isPostLoading}
        >
            {!trusteeIRI && (
                <FormSelect
                    type="text"
                    name="trustee"
                    label="Syndic"
                    error={errors["trustee"]}
                    register={register}
                    required={true}
                >
                    {isLoadingTrustees && (
                        <option value="">Chargement des syndics</option>
                    )}
                    {!isLoadingTrustees && dataTrustees.length != 0 && (
                        <option value="">Choisir un syndic</option>
                    )}
                    {!isLoadingTrustees && dataTrustees.length === 0 && (
                        <option value="">Aucun syndic trouvé</option>
                    )}
                    {!isLoadingTrustees &&
                        dataTrustees.map((trustee) => (
                            <option key={trustee["@id"]} value={trustee["@id"]}>
                                {trustee.title}
                            </option>
                        ))}
                </FormSelect>
            )}
            <FormInput
                type="text"
                name="title"
                label="Fonction"
                error={errors["title"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="lastname"
                label="Nom"
                error={errors["lastname"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="firstname"
                label="Prénom"
                error={errors["firstname"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="email"
                label="Email"
                error={errors["email"]}
                register={register}
                required={true}
            />
            <FormInput
                type="text"
                name="phone"
                label="Numéro de téléphone"
                error={errors["phone"]}
                register={register}
                required={false}
            />
        </Form>
    );
}
