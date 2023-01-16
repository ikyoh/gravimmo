import classNames from 'classnames'

interface TitleProps {
    title?: string,
    isLoading?: boolean
}

export const Title = ({
    title = "syndics",
    isLoading = false
}: TitleProps) => {

    const className = classNames("text-dark dark:text-white text-2xl uppercase font-bold ",
        {
            "animate-pulse": isLoading,
        })

    return (
        <div className={className}>
            {isLoading ? "Chargement" : title}
        </div>
    )
}