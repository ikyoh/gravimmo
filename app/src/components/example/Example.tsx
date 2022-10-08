import React from 'react';


interface ExampleProps {
    label?: string;
}


export const Example = ({
    label = "Valider",
}: ExampleProps) => {
    return (
        <button
            type="button"
            className='p-3 rounded-lg bg-fuchsia-600 text-white font-medium uppercase'
        >
            {label}
        </button>
    )
}