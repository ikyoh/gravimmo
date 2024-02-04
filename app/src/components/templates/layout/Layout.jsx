import { Link } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import Menu from "../menu/Menu";
import MenuMobile from "../menu/MenuMobile";

import { useGetCurrentAccount } from "../../../queryHooks/useAccount";

export const Layout = ({ children, roles = [] }) => {
    const {
        data: account,
        isLoading: isLoadingAccount,
        error,
    } = useGetCurrentAccount();

    if (isLoadingAccount)
        return (
            <div className="flex flex-col-reverse md:flex-row min-h-screen items-center justify-center">
                <Loader />
            </div>
        );
    if (!isLoadingAccount && !account) return <NotAuthorized />;
    return (
        <>
            <div className="flex flex-col-reverse md:flex-row min-h-screen">
                <ProtectedContent account={account} roles={roles}>
                    <div className="fixed bottom-0 w-full md:w-[110px] md:h-screen md:sticky md:top-0 z-10">
                        <MenuMobile />
                        <Menu />
                    </div>
                    <div className="grow flex flex-col mb-[70px]">
                        {children}
                    </div>
                </ProtectedContent>
            </div>
        </>
    );
};

const ProtectedContent = ({ children, account, roles }) => {
    if (roles.length === 0) return children;
    if (roles.includes(account.roles[0])) return children;
    return <NotAuthorized />;
};

const NotAuthorized = () => {
    return (
        <div className="grow flex flex-col gap-3 items-center justify-center m-5">
            <h1 className="text-xl text-center">
                Vous n'êtes pas authorisé à consulter cette page
            </h1>
            <Link to="/" className="btn btn-primary">
                Retour
            </Link>
        </div>
    );
};
