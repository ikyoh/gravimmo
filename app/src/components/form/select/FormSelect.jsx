import React from 'react';
import Error from '../error/FormError'
import Label from '../label/FormLabel'


export const FormSelect = ({ name, label, register, error, required, placeholder, validationSchema, children, defaultValue }) => (
  <div className="w-full mb-2">
    <Label name={name} label={label} required={required} />
    <select
      id={name}
      name={name}
      placeholder={placeholder}
      {...register(name, validationSchema)}
      className="appearance-none select bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent font-normal text-base"
    >
      {children}
    </select>
    <Error error={error} />
  </div>
);
