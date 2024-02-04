import React from 'react'
import { useForm } from "react-hook-form";
import { Navigate } from "react-router"
import { FormSubmitButton } from "components/form/submit-button/FormSubmitButton"
import { FormInput } from 'components/form/input/FormInput'
import ReactLogo from 'assets/logo-gravimmo.svg'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { useGetCurrentAccount, useLoginAccount } from '../queryHooks/useAccount';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from 'components/loader/Loader';


export const LoginPage = () => {

	const location = useLocation()

	const { data: account, isLoading: isLoadingAccount, error } = useGetCurrentAccount()

	const { mutate: loginAccount, isLoading: isPosting, isSuccess, error: loginError } = useLoginAccount()

	const validationSchema = Yup.object({
		username: Yup.string().required('Champ obligatoire'),
		password: Yup.string().required('Champ obligatoire')
	})

	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm(
		{
			resolver: yupResolver(validationSchema),
			defaultValues: {
				username: location.state ? location.state.login : '',
				password: location.state ? location.state.password : ''
			}
		}
	)

	const onSubmit = (data) => {
		loginAccount(data)
	}

	console.log('account', account)

	if (account && account.roles.includes("ROLE_ADMINISTRATOR"))
		return <Navigate to="/users" />

	if (account && account.roles.includes("ROLE_WORKSHOP"))
		return <Navigate to="/dashboard" />

	return (
		<div className="flex flex-col md:items-center md:justify-center md:h-screen">
			<div className='flex flex-col bg-gradient-login w-full md:w-[400px] p-8 md:rounded relative h-screen md:h-[650px]'>
				<div className='h-[160px] flex items-center justify-center'>
					<svg className="fill-dark dark:fill-white" width="60%" height="60%" viewBox="0 0 89 89" xmlns="http://www.w3.org/2000/svg">
						<path d="M87.1407 32.1028C86.3561 32.0642 85.5132 32.0194 85.0705 32.0194C79.1437 32.0194 74.5299 33.7295 71.2292 37.1505C69.0167 39.4315 67.4795 42.3171 66.5816 45.7908C66.5124 46.0817 66.4857 46.4937 66.4252 46.8113V36.2353C66.4252 35.1244 66.1901 34.1958 66.1209 33.1375C67.6989 30.2904 69.4397 28.0826 71.3495 26.6272C74.7925 24.0491 78.7624 22.8029 83.1552 22.615C81.2139 19.1869 78.966 15.8877 76.0435 12.966C60.1429 -2.93454 35.3168 -4.14774 17.8438 8.97965C22.5519 5.83933 27.9094 4.21649 33.9519 4.21649C39.3424 4.21649 44.3706 5.59873 49.07 8.32862C55.1769 11.8739 59.1082 17.1292 61.3098 23.7425C61.938 25.6263 62.4451 27.6061 62.7565 29.74C62.9153 30.8353 63.0159 31.9777 63.0906 33.1375C63.1606 34.1966 63.3957 35.1251 63.3957 36.2353V60.7894C63.3957 63.4069 63.1559 65.8184 62.7565 68.093C61.8837 73.0582 59.9731 77.1248 57.1953 80.4357C56.5725 81.1787 56.0277 81.9886 55.309 82.6483C51.8314 85.7862 47.7326 87.8203 43.1361 88.9784C55.0055 89.3425 66.9842 85.1037 76.0427 76.046C87.9529 64.1358 91.5163 47.2139 87.1392 32.1028H87.1407ZM65.7867 80.4365H60.2263C63.0034 77.1248 64.914 73.0582 65.7867 68.0922V80.4365Z" />
						<path d="M49.5558 74.0762C51.2022 72.0885 52.1952 69.5733 52.7692 66.6956C52.8093 66.4951 52.9595 66.385 52.9941 66.1806C53.2701 64.4689 53.4084 62.0684 53.4092 59.0099V37.5316C53.4084 35.6989 52.9768 34.3103 52.7692 32.693C52.1245 27.6711 50.8075 23.3428 48.1554 20.3904C44.3201 16.1918 39.5325 14.083 33.8306 14.083C28.4054 14.083 23.8608 16.018 20.2314 19.8887C16.5171 23.8114 14.6678 28.5117 14.6686 33.9722C14.6678 39.1207 16.4133 43.5961 19.9389 47.3811C23.6886 51.4248 28.3354 53.4455 33.884 53.4463C37.478 53.4463 40.8125 52.513 43.8711 50.6291C45.218 49.765 47.0326 48.3482 49.3144 46.344V56.8154C46.4626 58.9753 44.1133 60.4613 42.2813 61.2735C39.343 62.6212 36.1823 63.295 32.7943 63.295C28.9927 63.295 25.2957 62.5009 21.6671 60.9111C18.0558 59.3212 14.9108 57.0922 12.2155 54.242C6.9106 48.6085 4.26641 41.904 4.2672 34.0941C4.2672 28.01 5.8523 22.5825 9.00677 17.813C-4.14893 35.2876 -2.94595 60.1358 12.9656 76.0466C13.8352 76.9154 14.8369 77.5444 15.7576 78.3275C22.0964 80.1697 27.7268 81.1109 32.6056 81.1109C40.0703 81.1109 45.7204 78.7607 49.5565 74.0778L49.5558 74.0762Z" />
					</svg>
				</div>
				<div className='text-white text-center text-xl mb-12'>GRAVIMMO</div>

				{isLoadingAccount ?
					<Loader />
					:
					<>

						<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center grow">

							<FormInput
								type="text"
								name="username"
								label="Identifiant"
								error={errors['username']}
								register={register}
								required
							/>
							<FormInput
								type="password"
								name="password"
								label="Mot de passe"
								error={errors['password']}
								register={register}
								required
							/>
							{loginError &&
								<p className='text-error'> Problème de connection</p>
							}
							<div className='mt-6'>
								<FormSubmitButton
									label='connexion'
									isLoading={isSubmitting || isPosting}
									isDisabled={isSubmitting || isPosting}
								/>
							</div>
						</form>
						<Link to="/forgot-password" className='text-action mt-3 uppercase text-sm text-center'>
							j'ai oublié mon mot de passe
						</Link>
					</>
				}
			</div >
		</div >
	);

}