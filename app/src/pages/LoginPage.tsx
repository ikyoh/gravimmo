import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormSubmitButton } from "components/form/submit-button/FormSubmitButton"
import { FormInput } from 'components/form/input/FormInput';
import axios from 'axios'
import ReactLogo from 'assets/logo-gravimmo.svg'
import { Link } from 'react-router-dom';

type Inputs = {
	username: string,
	password: string,
};


type Props = {}

export const LoginPage = (props: Props) => {

	const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>(
		{
			defaultValues: {
				username: 'user@domain.com',
				password: 'password'
			}
		}
	)

	const onSubmit: SubmitHandler<Inputs> = data => {
		console.log(data);
		checkToken(data)
		//  accountLogin(data)
	}


	const checkToken = async (data: {}) => {

		// try {
		//   const response = await axios.post('http://localhost:9000/api/login', data)
		//   console.log('response.data', response.data)
		//   return response.data
		// } catch (error) {
		//   console.log(error)
		//   throw error
		// }
	}


	return (
		<div className="flex flex-col md:items-center md:justify-center md:h-screen">
			<div className='bg-gradient-login w-full md:w-[400px] p-8 md:rounded relative h-screen md:h-auto'>
				<div className='h-[160px] flex items-center justify-center'>
					<img src={ReactLogo} alt="Logo" style={{ width: 120 }} />
				</div>
				<div className='text-white text-center text-xl mb-12'>GRAVIMMO</div>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center">
					<FormInput
						type="text"
						name="username"
						label="Identifiant"
						errors={errors}
						register={register}
						validationSchema={{
							required: "Champ obligatoire"
						}}
						required
					/>
					<FormInput
						type="password"
						name="password"
						label="Mot de passe"
						errors={errors}
						register={register}
						validationSchema={{
							required: "Champ obligatoire"
						}}
						required
					/>
					<div className='mt-6'>
						<Link to="/dashboard">
							<FormSubmitButton label='connexion' />
						</Link>
					</div>
					<Link to="/forgot-password" className='text-action mt-3 uppercase text-sm'>
						j'ai oublié mon mot de passe
					</Link>
				</form>
			</div >
		</div >
	);

}