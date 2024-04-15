import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import {
    MdAccountCircle,
    MdGroups,
    MdOutlineDriveFileRenameOutline,
    MdOutlineHomeWork,
    MdSupervisedUserCircle,
    MdWarning,
} from "react-icons/md";
import { Link } from "react-router-dom";

export const SettingsPage = ({ title }) => {
    return (
        <>
            <Header title={title}></Header>
            <Content>
                <div className="flex flex-col gap-5 justify-start items-start">
                    <Link
                        to="/customers"
                        className="btn bg-gradient-to-br from-purple-500 to-accent text-white !inline-flex"
                    >
                        <MdAccountCircle size={32} />
                        Clients
                    </Link>
                    <Link
                        to="/trustees"
                        className="btn bg-gradient-to-br from-purple-500 to-accent text-white"
                    >
                        <MdSupervisedUserCircle size={32} />
                        Syndics
                    </Link>
                    <Link
                        to="/properties"
                        className="btn bg-gradient-to-br from-purple-500 to-accent text-white"
                    >
                        <MdOutlineHomeWork size={32} />
                        Copropriétés
                    </Link>
                    <Link
                        to="/contacts"
                        className="btn bg-gradient-to-br from-purple-500 to-accent text-white"
                    >
                        <MdGroups size={32} />
                        Contacts
                    </Link>
                    <Link
                        to="/services"
                        className="btn bg-gradient-to-br from-purple-500 to-accent text-white"
                    >
                        <MdOutlineDriveFileRenameOutline size={32} />
                        Prestations
                    </Link>
                    <Link
                        to="/reports"
                        className="btn bg-gradient-to-br from-purple-500 to-accent text-white"
                    >
                        <MdWarning size={32} />
                        Incidents
                    </Link>
                </div>
            </Content>
        </>
    );
};
