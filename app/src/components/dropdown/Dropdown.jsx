import { BsThreeDotsVertical } from 'react-icons/bs'
import "./style.css"
import classNames from 'classnames'

const Dropdown = ({ type = "card", children }) => {

    const className = classNames({
        "absolute top-2 right-1": type === "card",
        "absolute -top-4 right-1": type === "table",
    })

    const classNameContent = classNames({
        "dropdown-content bg-slate-400 dark:bg-primary rounded -translate-x-1 translate-y-1": type === "card",
        "dropdown-content bg-slate-400 dark:bg-primary rounded -translate-x-1 -translate-y-2": type === "table",
    })

    return (
        <div className={className}>
            <div className="dropdown dropdown-left dropdown-end">
                <label
                    tabIndex={0}
                    className="btn btn-circle btn-sm bg-transparent border-none hover:bg-white dark:hover:bg-primary"
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <BsThreeDotsVertical className='dark:text-white/20 text-dark/20 text-3xl' />
                </label>
                <div tabIndex={0} className={classNameContent}
                onClick={(e) => { e.stopPropagation() }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Dropdown


