import { useState } from 'react';
import { useForm } from "react-hook-form"
import { FormSubmitButton } from "components/form/submit-button/FormSubmitButton"
import { FormInput } from 'components/form/input/FormInput'
import axios from 'axios'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import ReactLogo from 'assets/logo-gravimmo.svg'
import { Link } from 'react-router-dom'


export const ForgotPasswordPage = () => {

	const [submitted, setSubmitted] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const validationSchema = yup.object({
		email: yup.string().email('Email non valide').required('Champ obligatoire')
	});

	const { register, handleSubmit, watch, formState: { errors, isSubmitting, isSubmitted, } } = useForm(
		{
			resolver: yupResolver(validationSchema)
		}
	)

	const onSubmit = data => {
		setSubmitting(true)
		submitPassword(data)
	}

	const submitPassword = async (data) => {
		try {
			await axios.post('https://localhost/api/forgot_password/', data)
			setSubmitted(true)
		} catch (error) {
			console.log(error)
			throw error
		}
	}

	return (
		<div className="flex md:items-center md:justify-center md:h-screen">
			<div className='flex flex-col bg-gradient-login w-full md:w-[400px] p-8 md:rounded relative h-screen md:h-[650px]'>
				<Link to="/" className='h-[160px] flex items-center justify-center'>
					<img src={ReactLogo} alt="Logo" style={{ width: 120 }} />
				</Link>
				<div className='text-white text-center text-xl mb-12 uppercase'>
					<p>réinitialiser</p>
					<p>mon mot de passe</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center grow">
					{!submitted ?
						<>
							<FormInput
								type="text"
								name="email"
								label="Adresse email"
								placeholder='Adresse email'
								errors={errors}
								register={register}
								required
							/>
							<div className='text-sm text-medium'>
								Veuillez renseigner l'adresse email  associée à votre compte pour réinitialiser votre mot de passe.
							</div>
							<div className='mt-6'>
								<FormSubmitButton label='valider' isLoading={submitting} isDisabled={submitting} />
							</div>
						</>
						:
						<div className='text-sm text-medium text-center py-16'>
							Veuillez consulter votre boîte mail.
						</div>
					}
				</form>
				<Link to="/" className='text-action mt-3 uppercase text-sm text-center'>
					connexion
				</Link>
			</div >
		</div >
	);

}