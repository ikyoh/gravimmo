import { MdOutlineRadioButtonChecked } from "react-icons/md";
import classNames from "classnames";


export enum StatusColor {
    Action = 'action',
    Info = 'info',
    Mention = 'mention' ,
    Success = 'success',
    Waiting = 'waiting',
    Error = 'error',
    Accent = 'accent',
    Dark = 'dark',
    Primary = 'primary',
    Black = 'black',
  }

interface DotProps {
    color?: StatusColor;
}

export const Dot = (props: DotProps) => {

    const {
        color = StatusColor.Primary,
        ...otherProps
    } = props;

    const defineClassName = classNames({
        "text-primary": color === StatusColor.Primary,
        "text-dark": color === StatusColor.Dark,
        "text-action": color === StatusColor.Action,
        "text-accent": color === StatusColor.Accent,
        "text-info": color === StatusColor.Info,
        "text-mention": color === StatusColor.Mention,
        "text-success": color === StatusColor.Success,
        "text-waiting": color === StatusColor.Waiting,
        "text-error": color === StatusColor.Error,
    })

    return(
        <MdOutlineRadioButtonChecked size={24} className={defineClassName} />
    )

}