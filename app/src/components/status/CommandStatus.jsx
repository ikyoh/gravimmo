import { Dot, StatusColor } from "components/dot/Dot";
import {
    statusColor,
    status as translateStatus,
} from "config/translations.config";
import dayjs from "dayjs";

const CommandStatus = ({ status, isHanging, date }) => {
    if (status)
        return (
            <div className="flex gap-1 justify-between items-center">
                {isHanging ? (
                    <Dot color={statusColor["bloqué"]} />
                ) : (
                    <Dot color={statusColor[status]} />
                )}
                <div>{translateStatus[status]}</div>
            </div>
        );
    else {
        if (dayjs().diff(dayjs(date), "day") > 7)
            return (
                <div className="flex gap-1">
                    <Dot color={StatusColor.Error} />
                    En retard
                </div>
            );
        else
            return (
                <div className="flex gap-1">
                    <Dot color={StatusColor.Action} />
                    En cours
                </div>
            );
    }
};

export default CommandStatus;
