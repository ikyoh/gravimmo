import { ErrorMessage } from "@hookform/error-message";
import classNames from "classnames";
import { Button, ButtonSize } from "components/button/Button";
import { CardService } from "components/cards/service/CardService";
import Dropdown from "components/dropdown/Dropdown";
import FormCheckbox from "components/form/checkbox/FormCheckbox";
import Form from "components/form/form/Form";
import Label from "components/form/label/FormLabel";
import { FormSelect } from "components/form/select/FormSelect";
import Loader from "components/loader/Loader";
import { NoDataFound } from "components/noDataFound/NoDataFound";
import { commandDetails } from "config/translations.config";
import { useCheckDuplicateCommand } from "hooks/useCheckDuplicateCommand";
import { useSearch } from "hooks/useSearch";
import {
    useGetOneData,
    useGetPaginatedDatas,
    usePostData,
    usePutData,
} from "queryHooks/useCommand";
import { useGetPaginatedDatas as useGetCustomers } from "queryHooks/useCustomer";
import {
    useGetIRI as getProperty,
    useGetPaginatedDatas as useGetProperties,
} from "queryHooks/useProperty";
import { useGetIRI as usePropertyService } from "queryHooks/usePropertyService";
import { useEffect, useRef, useState } from "react";
import {
    FormProvider,
    useFieldArray,
    useForm,
    useWatch,
} from "react-hook-form";
import uuid from "react-uuid";

export const CommandForm = ({ id, handleCloseModal }) => {
    const {
        isLoading: isLoadingData,
        data,
        isError,
        error,
    } = useGetOneData(id);
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

    const [currentStep, setCurrentStep] = useState(null);
    const [steps, setSteps] = useState(2);
    const [choice, setChoice] = useState("property");
    const [isCustom, setIsCustom] = useState(false);

    const ref = useRef(null);

    const handleNextStep = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            setCurrentStep((cur) => cur + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep((cur) => cur - 1);
    };

    const methods = useForm({
        defaultValues: id
            ? data
            : { isCustom: false, property: "", trustee: "", isUpdate: false },
        shouldUnregister: false,
        shouldFocusError: true,
        reValidateMode: "onSubmit",
        mode: "onChange",
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        resetField,
        getValues,
        watch,
        trigger,
        setFocus,
        control,
        formState: { errors, isSubmitting },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "customServices",
    });

    useEffect(() => {
        if (fields.length > 0) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [fields]);

    // Set form values
    useEffect(() => {
        if (!id) {
            reset({ details: {} });
            setCurrentStep(1);
        }
    }, []);

    useEffect(() => {
        if (id && data) {
            reset(data);
            setCurrentStep(2);
        }
        if (data && data.isCustom) {
            setIsCustom(true);
        }
    }, [isLoadingData, data]);

    const transformForm = (customServices) => {
        const output = [];

        if (customServices && customServices.length !== 0)
            customServices.forEach((customService) => {
                const details = customService.details;
                const nouveloccupantLines = details.nouveloccupant.split("\n");
                const propertyServices = customService.propertyServices;
                for (let i = 0; i < nouveloccupantLines.length; i++) {
                    const textareas = Object.entries(
                        customService.details
                    ).reduce((acc, value) => {
                        return { ...acc, [value[0]]: value[1].split("\n")[i] };
                    }, {});

                    const newCustomService = {
                        details: textareas,
                        propertyServices: propertyServices,
                    };

                    output.push(newCustomService);
                }
            });

        return output;
    };

    const {
        isChecked,
        isDuplicate,
        isLoading: isChecking,
        setProperty,
        setSearchTerm,
        DuplicateCommandCard,
    } = useCheckDuplicateCommand();

    useEffect(() => {
        if (isChecked && !isDuplicate) handleSubmit(onSubmit)();
    }, [isChecked, isDuplicate, isChecking]);

    const onSubmit = (form) => {
        let _form = { ...form };
        _form.isHanging = false;

        console.log(_form);

        if (!form.customer) {
            if (_form.entrance === "" && !_form.isCustom) {
                _form.isHanging = true;
            }
            if (!_form.isHanging && !_form.isCustom) {
                _form.isHanging = Object.keys(_form.details).some((key) => {
                    return (
                        key !== "proprietaire" &&
                        key !== "ancienoccupant" &&
                        key !== "orderDetails" &&
                        _form.details[key] === ""
                    );
                });
            }

            if (
                !_form.isHanging &&
                _form.details.orderTags &&
                !_form.isCustom
            ) {
                _form.isHanging = Object.values(_form.details.orderTags).some(
                    (value) => value === ""
                );
            }
        }
        // case update
        if (id) {
            delete _form.service;
            delete _form.extraServices;
            delete _form.tour;
            delete _form.images;
            delete _form.trustee;
            putData(_form);
        } else {
            // case custom
            if (isCustom) {
                //_form.customServices = transformForm(form.customServices);
                postData(_form);
            } else {
                if (_form.customer) {
                    postData(_form);
                }
                // case property not customer and not duplicate checked
                if (_form.property && isChecked === false) {
                    setSearchTerm(form.details.nouveloccupant);
                    setProperty(form.propertyId);
                }
                // case property not customer and already duplicate checked
                if (_form.property && isChecked === true) {
                    postData(_form);
                }
            }
        }
    };

    useEffect(() => {
        if (isPostSuccess || isPutSuccess) handleCloseModal();
    }, [isPostSuccess, isPutSuccess]);

    const PropertyButton = ({ data, control }) => {
        const _property = useWatch({
            control,
            name: "property",
        });

        const className = classNames(
            "p-3 flex justify-between cursor-pointer hover:bg-accent",
            {
                "bg-accent": _property === data["@id"],
            }
        );

        return (
            <div
                className={className}
                onClick={() => {
                    if (_property !== data["@id"]) {
                        setValue("property", data["@id"]);
                        setValue("propertyId", data.id);
                        setValue("trustee", data.trustee["@id"]);
                    } else handleNextStep();
                }}
            >
                <div>
                    <span className="font-semibold">{data.title}</span>
                    {data.trustee && (
                        <span className="text-white/50">
                            {" "}
                            - {data.trustee.title}
                        </span>
                    )}
                </div>
                <div>
                    {data.postcode} - {data.city}
                </div>
            </div>
        );
    };

    const Step1 = () => {
        const Property = () => {
            const { searchValue, searchbar } = useSearch("");
            const {
                data: properties = [],
                isLoading,
                error,
            } = useGetProperties(1, "title", "ASC", searchValue);
            return isLoading ? (
                <Loader />
            ) : (
                <>
                    <input
                        type="hidden"
                        {...register("property", {
                            required: true,
                        })}
                    />
                    {searchbar}
                    {properties["hydra:totalItems"] === 0 && (
                        <NoDataFound withBackground={false} />
                    )}
                    <div className="card mt-3 divide-y divide-slate-500/20">
                        {properties["hydra:member"].map((property) => (
                            <PropertyButton
                                key={uuid()}
                                data={property}
                                control={control}
                            />
                        ))}
                    </div>
                </>
            );
        };

        const Customer = () => {
            const { searchValue, searchbar } = useSearch("");
            const { data, isLoading, isSuccess, error } = useGetCustomers(
                1,
                "title",
                "ASC",
                searchValue
            );

            const customer = watch("customer");

            if (isLoading) return <Loader />;
            return (
                <>
                    {searchbar}
                    <div className="flex flex-col gap-3 mt-3">
                        {data["hydra:totalItems"] === 0 && <NoDataFound />}
                        {data["hydra:member"]?.map((data) => (
                            <button
                                key={data["@id"]}
                                type="button"
                                className={`btn flex justify-between ${data["@id"] === customer
                                    ? "btn-primary"
                                    : "btn-neutral"
                                    }`}
                                onClick={() =>
                                    setValue("customer", data["@id"])
                                }
                            >
                                <div>{data.title}</div>
                            </button>
                        ))}
                    </div>
                </>
            );
        };

        return (
            <>
                <div className="btn-group w-full mb-10">
                    <button
                        type="button"
                        className={`btn w-1/2 ${choice === "property" && "btn-active"
                            }`}
                        onClick={() => {
                            setChoice("property");
                            reset({});
                        }}
                    >
                        Copropriété
                    </button>
                    <button
                        type="button"
                        className={`btn w-1/2 ${choice === "customer" && "btn-active"
                            }`}
                        onClick={() => {
                            setChoice("customer");
                            setSteps(1);
                            reset({ isCustom: true });
                        }}
                    >
                        Autre Client
                    </button>
                </div>
                {choice === "property" && <Property />}
                {choice === "customer" && <Customer />}
            </>
        );
    };

    const Step2 = () => {
        useEffect(() => {
            if (!isCustom && errors.details)
                setFocus("details." + Object.keys(errors.details)[0]);
        }, [errors, setFocus]);

        const {
            data: property,
            isLoading,
            error,
        } = getProperty(watch("property"));

        const handleChangeEntrance = (value) => {
            const details = getValues("details");
            if (details.entree || details.entree === "")
                setValue("details[entree]", value);
            if (details.numerodevilla || details.numerodevilla === "")
                setValue("details[numerodevilla]", value);
        };

        const ServiceCheckbox = ({ serviceIRI, name }) => {
            const { data: propertyService, isLoading: isLoadingService } =
                usePropertyService(serviceIRI);
            if (isLoadingService) return <Loader />;
            return (
                <div className="flex gap-3 items-center py-2">
                    <input
                        type="checkbox"
                        {...register(name)}
                        className="appearance-none checkbox h-[20px] w-[20px] cursor-pointer flex items-center justify-center text-white text-2xl"
                        value={serviceIRI}
                    />
                    {propertyService.service.title}
                </div>
            );
        };

        return isLoading ? (
            <Loader />
        ) : (
            <div>
                <div className="btn-group w-full mb-10">
                    <button
                        type="button"
                        className={`btn w-1/2 ${!isCustom && "btn-active btn-disabled"
                            }`}
                        onClick={() => {
                            setValue("isCustom", false);
                            setIsCustom(false);
                        }}
                        disabled={id}
                    >
                        Commande standard
                    </button>
                    <button
                        type="button"
                        className={`btn w-1/2 ${isCustom && "btn-active btn-disabled"
                            }`}
                        onClick={() => {
                            resetField("details");
                            setValue("isCustom", true);
                            setIsCustom(true);
                            append(
                                {
                                    details: { nouveloccupant: "" },
                                    propertyServices: property.services,
                                },
                                {
                                    focusName: `services.${fields.length}.details.nouveloccupant`,
                                }
                            );
                        }}
                    >
                        Commande multiple
                    </button>
                </div>

                <div className="subtitle mb-3 text-dark dark:text-white">
                    {property.title}
                </div>

                {property && property.services.length !== 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                        {property.services.map((service) => (
                            <CardService
                                key={uuid()}
                                iri={service}
                                size="mini"
                                editable={false}
                            />
                        ))}
                    </div>
                )}

                {!isCustom && (
                    <>
                        {property &&
                            property.trustee.orderTag.length !== 0 &&
                            property.trustee.orderTag.map((orderTag) => (
                                <Input
                                    key={uuid()}
                                    name={`details.orderTags.${orderTag}`}
                                    label={orderTag}
                                    placeholder="Code de facturation"
                                />
                            ))}
                        <Input
                            name="trackingEmail"
                            label="Email de suivi"
                            placeholder="url de l'email"
                        />
                        <Input
                            name="contractorEmail"
                            label="Email du donneur d'ordre"
                            placeholder="adresse email"
                        />

                        <div className="flex gap-3 items-end">
                            <Input
                                name="details.proprietaire"
                                label="Propriétaire"
                                placeholder="Nom du propriétaire"
                            />
                            <button
                                type="button"
                                className="btn btn-neutral btn-outline mb-2 h-[50px]"
                                onClick={() => {
                                    setValue(
                                        "details.nouveloccupant",
                                        getValues("details.proprietaire")
                                    );
                                }}
                            >
                                Propriétaire occupant
                            </button>
                        </div>

                        <div className="divider uppercase">Infos pose</div>

                        {property.entrances.length !== 0 && (
                            <FormSelect
                                type="text"
                                name="entrance"
                                label="Entrée / Villa"
                                error={errors["entrance"]}
                                register={register}
                                required={false}
                                onChange={(e) => {
                                    handleChangeEntrance(e.target.value);
                                }}
                            >
                                <option value="">Choisir</option>
                                {property.entrances.map((entrance) => (
                                    <option key={uuid()} value={entrance}>
                                        {entrance}
                                    </option>
                                ))}
                            </FormSelect>
                        )}
                        <Input
                            name="details.ancienoccupant"
                            label="Ancien occupant"
                            placeholder="Nom de l'ancien occupant"
                        />
                        <Input name="commentDeliver" label="Commentaire pose" />
                        <div className="divider uppercase">Infos gravure</div>

                        <RequiredInput
                            name="details.nouveloccupant"
                            label="Nouvel occupant"
                            placeholder="Nom du nouvel occupant"
                        />
                        {property &&
                            property.params
                                .filter(
                                    (f) =>
                                        f !== "tableauptt" &&
                                        f !== "platineparlophoneelectricien" &&
                                        f !== "platineadefilement"
                                )
                                .map((item) => (
                                    <div key={uuid()} className="w-full mb-2">
                                        <Label
                                            name={`details.${item}`}
                                            label={commandDetails[item]}
                                            required={false}
                                        />
                                        <input
                                            {...register(`details.${item}`, {
                                                //required: "Champ obligatoire.",
                                            })}
                                            className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent"
                                            placeholder={commandDetails[item]}
                                        />
                                        <ErrorMessage
                                            errors={errors}
                                            name={`details.${item}`}
                                            render={({ message }) => (
                                                <span className="text-error text-sm">
                                                    {message}
                                                </span>
                                            )}
                                        />
                                    </div>
                                ))}
                        <Input
                            name="commentMake"
                            label="Commentaire fabrication"
                        />
                        <DuplicateCommandCard />

                        <div className="divider uppercase">Infos facture</div>
                        <Input name="commentInvoice" label="Commentaire facture" />
                    </>
                )}
                {isCustom && (
                    <div>
                        <FormCheckbox
                            name="isUpdate"
                            label="Cette commande est une mise à jour"
                            error={errors["isUpdate"]}
                            register={register}
                        />
                        {property &&
                            property.trustee.orderTag.length !== 0 &&
                            property.trustee.orderTag.map((orderTag) => (
                                <Input
                                    key={uuid()}
                                    name={`details.orderTags.${orderTag}`}
                                    label={orderTag}
                                    placeholder=""
                                />
                            ))}

                        <Input
                            name="trackingEmail"
                            label="Email de suivi"
                            placeholder="url de l'email"
                        />
                        <Input
                            name="commentMake"
                            label="Commentaire fabrication"
                        />
                        <Input
                            name="commentDeliver"
                            label="Commentaire pose"
                        />
                        <Input
                            name="commentInvoice"
                            label="Commentaire facture"
                        />

                        <div className="">
                            {fields.map((item, index) => {
                                return (
                                    <div
                                        key={item.id}
                                        className="mb-3 rounded py-3 pr-10 gap-1 relative w-full"
                                    >
                                        <div className="flex flex-nowrap gap-3 pr-2 pb-2 overflow-x-auto thinscrollbar">
                                            <div className="flex-none w-64">
                                                Propriétaire
                                                <input
                                                    type="text"
                                                    {...register(
                                                        `customServices.${index}.details.proprietaire`
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-none w-96">
                                                <div className="flex gap-3 items-center">
                                                    Nouvel occupant
                                                    <CheckIfExist
                                                        field={`customServices.${index}.details.nouveloccupant`}
                                                        property={id}
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    name={`customServices.${index}.details.nouveloccupant`}
                                                    {...register(
                                                        `customServices.${index}.details.nouveloccupant`
                                                    )}
                                                />
                                            </div>

                                            <div className="flex-none w-64">
                                                Ancien occupant
                                                <input
                                                    type="text"
                                                    name={`customServices.${index}.details.ancienoccupant`}
                                                    {...register(
                                                        `customServices.${index}.details.ancienoccupant`
                                                    )}
                                                />
                                            </div>
                                            {property.entrances.length !==
                                                0 && (
                                                    <div>
                                                        Entrée / Villa
                                                        <select
                                                            {...register(
                                                                `customServices.${index}.entrance`,
                                                                {
                                                                    onChange: (
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            `customServices.${index}.details.entree` ||
                                                                            `customServices.${index}.details.entree` ===
                                                                            ""
                                                                        )
                                                                            setValue(
                                                                                `customServices.${index}.details.entree`,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        if (
                                                                            `customServices.${index}.details.numerodevilla` ||
                                                                            `customServices.${index}.details.numerodevilla` ===
                                                                            ""
                                                                        )
                                                                            setValue(
                                                                                `customServices.${index}.details.numerodevilla`,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                    },
                                                                }
                                                            )}
                                                            className="w-auto min-w-32"
                                                        >
                                                            <option value="">
                                                                Choisir
                                                            </option>
                                                            {property.entrances.map(
                                                                (entrance) => (
                                                                    <option
                                                                        key={uuid()}
                                                                        value={
                                                                            entrance
                                                                        }
                                                                    >
                                                                        {
                                                                            entrance
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                )}
                                            {property &&
                                                property.params
                                                    .filter(
                                                        (f) =>
                                                            f !==
                                                            "tableauptt" &&
                                                            f !==
                                                            "platineparlophoneelectricien" &&
                                                            f !==
                                                            "platineadefilement"
                                                    )
                                                    .map((item) => (
                                                        <div
                                                            className="flex-none w-32"
                                                            key={uuid()}
                                                        >
                                                            {
                                                                commandDetails[
                                                                item
                                                                ]
                                                            }
                                                            <input
                                                                type="text"
                                                                {...register(
                                                                    `customServices.${index}.details.${item}`
                                                                )}
                                                            />
                                                        </div>
                                                    ))}
                                        </div>
                                        <div className="absolute top-[2.5rem] right-1">
                                            <Dropdown>
                                                <button
                                                    onClick={() => {
                                                        append(
                                                            {
                                                                details: {
                                                                    nouveloccupant:
                                                                        "",
                                                                },
                                                                propertyServices:
                                                                    property.services,
                                                            },
                                                            {
                                                                focusName: `customServices.${fields.length}.details.nouveloccupant`,
                                                            }
                                                        );
                                                    }}
                                                >
                                                    Ajouter une ligne
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                >
                                                    Retirer la ligne
                                                </button>
                                            </Dropdown>
                                        </div>
                                        <div className="flex gap-5 flex-wrap">
                                            {property.services.map(
                                                (IRI) => (
                                                    <ServiceCheckbox
                                                        key={`${index}.${IRI}`}
                                                        serviceIRI={IRI}
                                                        name={`customServices.${index}.propertyServices`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Button
                            size={ButtonSize.Big}
                            onClick={() => {
                                append(
                                    {
                                        details: {
                                            nouveloccupant:
                                                "",
                                        },
                                        propertyServices:
                                            property.services,
                                    },
                                    {
                                        focusName: `customServices.${fields.length}.details.nouveloccupant`,
                                    }
                                );
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

    const Step3 = ({ register }) => {
        const { searchValue, searchbar } = useSearch("");
        return (
            <>
                <input
                    type="hidden"
                    {...register("property", {
                        required: true,
                    })}
                />
                <div className="btn-group w-full mb-5">
                    <button className="btn btn-active btn-disabled w-full mb-5">
                        Copropriété
                    </button>
                </div>
                {searchbar}
                <div className="card mt-3 divide-y divide-slate-500/20">
                    {data
                        .filter((f) =>
                            f.title
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                        )
                        .map((data) => (
                            <Button
                                key={data.id}
                                data={data}
                                value="property"
                            />
                        ))}
                </div>
                {data.filter((f) =>
                    f.title.toLowerCase().includes(searchValue.toLowerCase())
                ).length === 0 && "Aucun résultat"}
            </>
        );
    };

    const RequiredInput = ({ name, label, placeholder }) => {
        return (
            <div key={uuid()} className="w-full mb-2">
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
                    render={({ message }) => (
                        <span className="text-error text-sm">{message}</span>
                    )}
                />
            </div>
        );
    };

    const Input = ({ name, label, placeholder }) => {
        return (
            <div className="w-full mb-2">
                <Label name={name} label={label} required={false} />
                <input
                    id={name}
                    {...register(name)}
                    className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent"
                    placeholder={placeholder}
                />
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({ message }) => (
                        <span className="text-error text-sm">{message}</span>
                    )}
                />
            </div>
        );
    };

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                handleNextStep={handleNextStep}
                handlePrevStep={handlePrevStep}
                steps={steps}
                currentStep={currentStep}
                isLoading={isSubmitting || isPostLoading || isPutLoading}
                isDisabled={isSubmitting || isPostLoading || isPutLoading}
            >
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 register={register} />}
                <div ref={ref}>
                </div>
            </Form>
        </FormProvider>
    );
};

const CheckIfExist = ({ field, property }) => {
    const searchTerm = useWatch({ name: field });

    const [search, setSearch] = useState("");

    useEffect(() => {
        setSearch("");
        const timeoutId = setTimeout(() => setSearch(searchTerm), 750);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const {
        data = null,
        isLoading,
        isFetching,
        isSuccess,
        error,
    } = useGetPaginatedDatas({
        enabled: searchTerm ? true : false,
        page: 1,
        sortValue: "id",
        sortDirection: "DESC",
        details: search,
        filters: { status: "all" },
        property: property,
    });

    if (
        search &&
        !isLoading &&
        !isFetching &&
        data &&
        data["hydra:totalItems"] !== 0
    )
        return (
            <div
                role="button"
                className="text-error"
                onClick={() => {
                    console.log(data["hydra:member"][0]);
                }}
            >
                soupçon de doublon
            </div>
        );
    return null;
};
