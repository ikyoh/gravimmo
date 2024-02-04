import { yupResolver } from "@hookform/resolvers/yup";
import ReactLogo from "assets/logo-gravimmo.svg";
import axios from "axios";
import { FormInput } from "components/form/input/FormInput";
import { FormSubmitButton } from "components/form/submit-button/FormSubmitButton";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

export const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [userToken, setUserToken] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            const tokenContent = await axios.get(
                "https://localhost/api/forgot_password/" + token
            );
            setUserToken(tokenContent.data);
        };
        fetchToken();
    }, []);

    const validationSchema = yup.object({
        password: yup
            .string()
            .required("Mot de passe obligatoire")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
                "Doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial ! @ # % & *"
            ),
        passwordConfirmation: yup
            .string()
            .oneOf(
                [yup.ref("password"), null],
                "Le mots de passe ne correspondent pas"
            ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        setSubmitting(true);
        submitPassword(data);
    };

    const submitPassword = async (data) => {
        try {
            const response = await axios.post(
                "https://localhost/api/forgot_password/" + token,
                data
            );
            if (response.status === 204) {
                navigate("/", {
                    state: {
                        login: userToken.user.email,
                        password: data.password,
                    },
                });
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="flex md:items-center md:justify-center md:h-screen">
            <div className="bg-gradient-login w-full md:w-[400px] p-8 md:rounded relative h-screen md:h-auto">
                <div className="h-[160px] flex items-center justify-center">
                    <img src={ReactLogo} alt="Logo" style={{ width: 120 }} />
                </div>
                <div className="text-white text-center text-xl mb-12 uppercase">
                    <p>réinitialiser</p>
                    <p>mon mot de passe</p>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 items-center"
                >
                    <FormInput
                        type="password"
                        name="password"
                        placeholder="8 caracères minimum"
                        label="Mot de passe"
                        errors={errors}
                        register={register}
                        required
                    />
                    <FormInput
                        type="password"
                        name="passwordConfirmation"
                        placeholder="Confirmation"
                        label="Confirmation du mot de passe"
                        errors={errors}
                        register={register}
                        required
                    />
                    <div className="text-sm text-medium">
                        Pour la sécurité de vos données le mot de passe doit
                        contenir 8 caractères, une majuscule, une minuscule, un
                        chiffre et un caractère spécial ! @ # % & *
                    </div>
                    <div className="mt-6">
                        <FormSubmitButton
                            label="valider"
                            isLoading={submitting || !userToken}
                            isDisabled={submitting || !userToken}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
