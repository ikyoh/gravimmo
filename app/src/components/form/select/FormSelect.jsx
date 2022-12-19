import React from 'react';
import Error from '../error/FormError'
import Label from '../label/FormLabel'


export const FormSelect = ({ name, label, register, errors, required, type, placeholder, validationSchema, children, defaultValue }) => (
  <div className="w-full mb-2">
    <Label name={name} label={label} required={required} />
    <select
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      {...register(name, validationSchema)}
      className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent arrow"
    >
      {children}
    </select>
    <Error errors={errors[name]} />
  </div>
);
