import { yupResolver } from "@hookform/resolvers/yup";
import Form from "components/form/form/Form";
import { FormInput } from "components/form/input/FormInput";
import Loader from "components/loader/Loader";
import { useGetIRI as getCommand } from "queryHooks/useCommand";
import {
    useGetIRI as getReport,
    usePostData,
    usePutData,
} from "queryHooks/useCommandReport";
import { useGetIRI as getProperty } from "queryHooks/useProperty";
import { useGetOneData as getPropertyService } from "queryHooks/usePropertyService";
import { useGetAllDatas } from "queryHooks/useReport";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
import * as yup from "yup";

export default function CommandReportForm({
    iri,
    commandIRI,
    handleCloseModal,
}) {
    const { data: reports, isLoading: isLoadingReports } = useGetAllDatas();

    const { data: report, isLoading: isLoadingReport } = getReport(
        iri ? iri : null
    );

    const { data: command, isLoading: isLoadingCommand } = getCommand(
        iri && report ? report.command : commandIRI
    );

    const { data: property, isLoading: isLoadingProperty } = getProperty(
        command && command.property ? command.property["@id"] : null
    );

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
        command: yup.string().required("Champ obligatoire"),
        report: yup.string().required("Champ obligatoire"),
        service: yup.string().required("Champ obligatoire"),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { command: commandIRI },
        resolver: yupResolver(validationSchema),
    });

    //CASE UPDATE
    useEffect(() => {
        if (iri && report) {
            reset({
                ...report,
                service: report.service["@id"],
                report: report.report["@id"],
            });
        }
    }, [isLoadingReport]);

    const watchService = watch("service");
    const watchReport = watch("report");

    const onSubmit = (form) => {
        if (!iri) postData(form);
        else {
            putData(form);
        }
    };

    useEffect(() => {
        if (isPostSuccess || isPutSuccess) {
            handleCloseModal();
        }
    }, [isPostSuccess, isPutSuccess]);

    if (isLoadingCommand || isLoadingReports || isLoadingProperty)
        return <Loader />;

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting || isPostLoading || isPutLoading}
            isDisabled={isSubmitting || isPostLoading || isPutLoading}
        >
            <div className="w-full mb-2">
                <p>Concerne la prestation</p>
                <div className="flex gap-3 flex-wrap">
                    {property.services.map((iri) => (
                        <PropertyService
                            iri={iri}
                            key={uuid()}
                            setValue={setValue}
                            watchService={watchService}
                        />
                    ))}
                </div>
                <p className="mt-5">Rapport</p>
                <div className="flex gap-3 flex-wrap">
                    {reports?.map((report) => (
                        <button
                            type="button"
                            key={uuid()}
                            className={`btn ${watchReport === report["@id"]
                                    ? "btn-primary"
                                    : "btn-secondary"
                                }`}
                            onClick={() => setValue("report", report["@id"])}
                        >
                            {report.title}
                        </button>
                    ))}
                </div>
            </div>
            <FormInput
                type="text"
                name="comment"
                label="Commentaire"
                required={false}
                register={register}
            />
        </Form>
    );
}

const PropertyService = ({ iri, setValue, watchService }) => {
    const { data, isLoading } = getPropertyService(iri);
    if (isLoading) return <Loader />;
    return (
        <button
            type="button"
            className={`btn ${watchService === data.service["@id"]
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
            onClick={() => setValue("service", data.service["@id"])}
        >
            {data.service.title}
        </button>
    );
};
