import Loader from "components/loader/Loader";
import { NoDataFound } from "components/noDataFound/NoDataFound";
import dayjs from "dayjs";
import {
    useGetOrdersToDeliverNumber,
    useGetOrdersToInvoiceNumber,
} from "queryHooks/useCommand";
import { useGetPaginatedDatas } from "queryHooks/useTour";
import { AiOutlineSlack } from "react-icons/ai";
import { MdPendingActions } from "react-icons/md";
import uuid from "react-uuid";
import Content from "../components/templates/content/Content";
import Header from "../components/templates/header/Header";
import Tour from "../components/tour/Tour";

export const DashboardPage = ({ title }) => {
    const card = "bg-dark/60 rounded p-5 md:p-10 flex gap-20 items-center";
    const card2 = "bg-dark/60 rounded p-10 flex justify-between items-center";
    const cardtitle = "text-3xl font-bold";
    const text = "text-white/50";

    const { data: toInvoiceNumber } = useGetOrdersToInvoiceNumber();
    const { data: toDeliverNumber } = useGetOrdersToDeliverNumber();
    const {
        data: tours,
        isLoading: isLoadingTours,
        error: errorTours,
    } = useGetPaginatedDatas(1, "id", "ASC", "", {
        scheduledAt: dayjs().format("YYYY-MM-DD"),
    });

    console.log("tours", tours);

    return (
        <>
            <Header title={title}></Header>
            <Content>
                <section>
                    <div className="px-4 py-6">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className={card}>
                                <AiOutlineSlack
                                    size={70}
                                    className="bg-accent rounded-full p-3 text-dark"
                                />
                                <div>
                                    <div className={text}>
                                        Commandes traitées
                                    </div>
                                    <div className={cardtitle}>12365656</div>
                                </div>
                            </div>
                            <div className={card}>
                                <AiOutlineSlack
                                    size={70}
                                    className="bg-green-500 rounded-full p-3 text-dark"
                                />
                                <div>
                                    <div className={text}>
                                        Commandes prêtes à poser
                                    </div>
                                    <div className={cardtitle}>
                                        {toDeliverNumber}
                                    </div>
                                </div>
                            </div>
                            <div className={card}>
                                <MdPendingActions
                                    size={70}
                                    className="bg-red-500 rounded-full p-3 text-dark"
                                />
                                <div>
                                    <div className={text}>
                                        Commandes à facturer
                                    </div>
                                    <div className={cardtitle}>
                                        {toInvoiceNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-10">
                            <div className={card2}>
                                <AiOutlineSlack
                                    size={70}
                                    className="text-violet-800 rounded-full"
                                />
                                <div>
                                    <div className={cardtitle}>123</div>
                                    <div className={text}>Lorem Ipsum</div>
                                </div>
                            </div>
                            <div className={card2}>
                                <AiOutlineSlack
                                    size={70}
                                    className="text-violet-800 rounded-full"
                                />
                                <div>
                                    <div className={cardtitle}>456</div>
                                    <div className={text}>Lorem Ipsum</div>
                                </div>
                            </div>
                            <div className={card2}>
                                <AiOutlineSlack
                                    size={70}
                                    className="text-violet-800 rounded-full"
                                />
                                <div>
                                    <div className={cardtitle}>789</div>
                                    <div className={text}>Lorem Ipsum</div>
                                </div>
                            </div>
                            <div className={card2}>
                                <AiOutlineSlack
                                    size={70}
                                    className="text-violet-800 rounded-full"
                                />
                                <div>
                                    <div className={cardtitle}>333</div>
                                    <div className={text}>Lorem Ipsum</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    {isLoadingTours ? (
                        <Loader />
                    ) : (
                        <>
                            <div className="section-title">Tournée du jour</div>
                            {tours["hydra:member"].length === 0 && (
                                <NoDataFound />
                            )}
                            {tours["hydra:member"]?.map((tour) => (
                                <div key={uuid()} className="_card">
                                    <Tour id={tour.id} />
                                </div>
                            ))}
                        </>
                    )}
                </section>
            </Content>
        </>
    );
};
