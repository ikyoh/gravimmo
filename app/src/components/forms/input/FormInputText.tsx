import React from 'react';


interface FormInputTextProps {
  name?: any,
  label?: string,
  type?: string,
  required?: boolean,
  errors?: any,
  register?: any,
  validationSchema?: any,
}

export const FormInputText = ({ name, label, register, errors, required, type, validationSchema }:FormInputTextProps) => (
  <div className="w-full">
    <label htmlFor={name}
    className="text-white text-sm">
      {label}
      {required && "*"}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      {...register(name, validationSchema)}
      className = "appearance-none bg-primary text-white h-[50px] rounded px-2 my-2 w-full leading-tight focus:outline focus:outline-primary"
    />
    {errors && errors[name]?.type === "required" && (
      <span className="text-error text-sm">{errors[name]?.message}</span>
    )}
    {errors && errors[name]?.type === "minLength" && (
      <span className="text-error text-sm">{errors[name]?.message}</span>
    )}
  </div>
);
