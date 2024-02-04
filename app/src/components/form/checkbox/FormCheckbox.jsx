const FormCheckbox = ({ name, register, value, label }) => {
    return (
        <div className='flex gap-3 items-center py-2'>
            <div className='flex items-center justify-center h-[30px] w-[30px] bg-dark rounded'>
            <input {...register(name)}
                id={name}
                name={name}
                type="checkbox"
                value={value}
                className="appearance-none checkbox h-[30px] w-[30px] cursor-pointer flex items-center justify-center text-white text-4xl"
            />  
            </div>
            <div className="text-dark dark:text-accent">
                {label}
            </div>
        </div>
    )
}

export default FormCheckbox