import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormSubmitButton } from "../components/forms/FormSubmitButton"
import { FormInputText } from '../components/forms/input/FormInputText';
import axios from 'axios'
import ReactLogo from '../logo-gravimmo.svg'

type Inputs = {
  username: string,
  password: string,
};


type Props = {}

export const LoginPage = (props: Props) => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data);
    checkToken(data)
    //  accountLogin(data)
  }


  const checkToken = async (data: {}) => {

    try {
      const response = await axios.post('http://localhost:9000/api/login', data)
      console.log('response.data', response.data)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }


  return (
    <div className="flex md:items-center md:justify-center md:h-screen">
      <div className='background-gradient-login w-full md:w-[460px] p-8 md:rounded relative h-screen md:h-auto'>
        <div className='h-[160px] flex items-center justify-center'>
          <img src={ReactLogo} alt="Logo" style={{ width: 120 }} />
        </div>
        <div className='text-white text-center text-xl mb-12'>GRAVIMMO</div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center">
          <FormInputText
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
          <FormInputText
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
            <FormSubmitButton label='connexion' />
          </div>
        </form>
      </div>
    </div>
  );

}