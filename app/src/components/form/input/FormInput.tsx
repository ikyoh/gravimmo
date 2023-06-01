import React from 'react';
import Error from '../error/FormError'
import Label from '../label/FormLabel'

interface FormInputProps {
  name?: any,
  label?: string,
  type?: string,
  placeholder?: string,
  required?: boolean,
  error?: any,
  register?: any,
}

export const FormInput = ({ name, label, register, error, required, type, placeholder }: FormInputProps) => (
  <div className="w-full mb-2">
    <Label name={name} label={label} required={required} />
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      {...register(name)}
      className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent"
    />
    <Error error={error} />
  </div>
);
