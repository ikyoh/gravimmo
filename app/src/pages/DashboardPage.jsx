import Loader from "components/loader/Loader";
import { NoDataFound } from "components/noDataFound/NoDataFound";
import dayjs from "dayjs";
import { useGetCommandStats } from "queryHooks/useCommand";
import { useGetPaginatedDatas } from "queryHooks/useTour";
import { MdOutlineAssignment } from "react-icons/md";
import uuid from "react-uuid";
import Content from "../components/templates/content/Content";
import Header from "../components/templates/header/Header";
import Tour from "../components/tour/Tour";
import { useGetCurrentAccount } from "../queryHooks/useAccount";

export const DashboardPage = ({ title }) => {
    const card = "bg-dark/60 rounded p-5 md:p-10 flex flex-col gap-3";
    const card2 = "bg-dark/60 rounded p-5 flex items-center gap-5";
    const cardtitle = "text-3xl font-bold";
    const text = "text-white/50";

    const { data: totalCommands, isLoading: isLoadingTotalCommands } =
        useGetCommandStats({ queryName: "totalCommands" });
    const { data: toPrepareCommand, isLoading: isLoadingToPrepareCommand } =
        useGetCommandStats({
            queryName: "toPrepareCommands",
            status: "DEFAULT - à traiter",
        });
    const { data: toDeliverCommand, isLoading: isLoadingToDeliverCommand } =
        useGetCommandStats({
            queryName: "toDeliverCommands",
            status: "DEFAULT - préparé",
        });
    const { data: toInvoiceCommand, isLoading: isLoadingToInvoiceCommand } =
        useGetCommandStats({
            queryName: "toInvoiceCommands",
            status: "DEFAULT - posé",
        });
    const { data: isHangingCommands, isLoading: isLoadingIsHangingCommands } =
        useGetCommandStats({ queryName: "IsHangingCommands", isHanging: true });

    const { data: account } = useGetCurrentAccount();
    const { data: tours, isLoading: isLoadingTours } = useGetPaginatedDatas({
        page: 1,
        sortValue: "id",
        sortDirection: "ASC",
        searchValue: "",
        filters: { scheduledAt: dayjs().format("YYYY-MM-DD"), status: "all" },
    });

    return (
        <>
            <Header
                title={title}
                subtitle={dayjs().format("dddd D MMMM YYYY")}
            />
            <Content>
                {account.roles.includes("ROLE_WORKSHOP") && (
                    <section>
                        <div className="p-3">
                            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                                <div className={card2}>
                                    <div className="rounded-full flex items-center justify-center p-3 bg-accent">
                                        <MdOutlineAssignment
                                            size={30}
                                            className="text-white"
                                        />
                                    </div>
                                    <div>
                                        <div className={cardtitle}>
                                            {isLoadingToPrepareCommand
                                                ? "..."
                                                : toPrepareCommand}
                                        </div>
                                        <div className={text}>
                                            Commandes à préparer
                                        </div>
                                    </div>
                                </div>
                                <div className={card2}>
                                    <div className="rounded-full flex items-center justify-center p-3 bg-mention">
                                        <MdOutlineAssignment
                                            size={30}
                                            className="text-white"
                                        />
                                    </div>
                                    <div>
                                        <div className={cardtitle}>
                                            {isLoadingToDeliverCommand
                                                ? "..."
                                                : toDeliverCommand}
                                        </div>
                                        <div className={text}>
                                            Commandes à poser
                                        </div>
                                    </div>
                                </div>
                                <div className={card2}>
                                    <div className="rounded-full flex items-center justify-center p-3 bg-waiting">
                                        <MdOutlineAssignment
                                            size={30}
                                            className="text-white"
                                        />
                                    </div>
                                    <div>
                                        <div className={cardtitle}>
                                            {isLoadingToInvoiceCommand
                                                ? "..."
                                                : toInvoiceCommand}
                                        </div>
                                        <div className={text}>
                                            Commandes à facturer
                                        </div>
                                    </div>
                                </div>
                                <div className={card2}>
                                    <div className="rounded-full flex items-center justify-center p-3 bg-warning">
                                        <MdOutlineAssignment
                                            size={30}
                                            className="text-white"
                                        />
                                    </div>
                                    <div>
                                        <div className={cardtitle}>
                                            {isLoadingIsHangingCommands
                                                ? "..."
                                                : isHangingCommands}
                                        </div>
                                        <div className={text}>
                                            Commandes en attente
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
                <section>
                    {isLoadingTours ? (
                        <Loader />
                    ) : (
                        <>
                            <div className="section-title">
                                Tournées du jour
                            </div>
                            {tours["hydra:member"].length === 0 && (
                                <NoDataFound />
                            )}
                            {tours["hydra:member"]?.map((tour) =>
                                tour.commands.length === 0 ? (
                                    <NoDataFound />
                                ) : (
                                    <div key={uuid()} className="_card">
                                        <Tour id={tour.id} />
                                    </div>
                                )
                            )}
                        </>
                    )}
                </section>
            </Content>
        </>
    );
};
