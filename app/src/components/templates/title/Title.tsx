import classNames from 'classnames'

interface TitleProps {
    title?: string,
    isLoading?: boolean
}

export const Title = ({
    title = "syndics",
    isLoading = false
}: TitleProps) => {

    const className = classNames("ext-dark dark:text-white text-2xl uppercase font-bold ",
        {
            "animate-bounce": isLoading,
        })

    return (
        <div className={className}>
            {title}
        </div>
    )
}