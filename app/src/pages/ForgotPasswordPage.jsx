import { useForm, SubmitHandler } from "react-hook-form"
import { FormSubmitButton } from "components/form/submit-button/FormSubmitButton"
import { FormInput } from 'components/form/input/FormInput'
import axios from 'axios'
import * as Yup from 'yup';
import ReactLogo from 'assets/logo-gravimmo.svg'
import { Link } from 'react-router-dom'

export const ForgotPasswordPage = () => {

	const { register, handleSubmit, watch, formState: { errors } } = useForm(
		{
			resolver: yupResolver(validationSchema),
			defaultValues: {
				email: ''
			}
		}
	)

	const onSubmit = data => {
		console.log(data);
		submitPassword(data)
	}

	const submitPassword = async (data) => {
		try {
			const response = await axios.post('https://localhost/api/forgot_password/', data)
			console.log('response', response)
			return response.data
		} catch (error) {
			console.log(error)
			throw error
		}
	}

	return (
		<div className="flex md:items-center md:justify-center md:h-screen">
			<div className='bg-gradient-login w-full md:w-[400px] p-8 md:rounded relative h-screen md:h-auto'>
				<Link to="/" className='h-[160px] flex items-center justify-center'>
					<img src={ReactLogo} alt="Logo" style={{ width: 120 }} />
				</Link>
				<div className='text-white text-center text-xl mb-12 uppercase'>
					<p>J'ai oublié</p>
					<p>mon mot de passe</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center">
					<FormInput
						type="text"
						name="email"
						label="Adresse email"
						errors={errors}
						register={register}
						validationSchema={{
							required: "Champ obligatoire"
						}}
						required
					/>
					<div className='mt-6'>
						<FormSubmitButton label='valider' />
					</div>
					<Link to="/" className='text-action mt-3 uppercase text-sm'>
						retour page d'accueil
					</Link>
				</form>
			</div >
		</div >
	);

}