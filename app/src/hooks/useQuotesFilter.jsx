import Dropdown from "components/dropdown/Dropdown";
import { statusColor } from "config/translations.config";
import _ from "lodash";
import { useState } from "react";
import { LuSettings2 } from "react-icons/lu";

export const useQuotesFilter = () => {
    const defaultFilters = {
        status: "all",
        isSend: false,
        beginAt: "",
        endAt: "",
    };

    const [filters, setFilters] = useState(defaultFilters);

    const handleChangeInput = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleChangeCheckbox = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.checked });
    };

    return {
        filters,
        filter: (
            <Dropdown type="button" icon={<LuSettings2 size={26} />}>
                <div className="w-52 dropdown-title">Filtres</div>
                <div className="form-control">
                    <label className="label cursor-pointer m-0 p-0">
                        <span className="label-text">Tous</span>
                        <input
                            type="radio"
                            name="status"
                            value="all"
                            className="radio checked:bg-white"
                            checked={filters.status === "all"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer m-0 p-0">
                        <span className="label-text">Edité</span>
                        <input
                            type="radio"
                            name="status"
                            value="édité"
                            className={`radio checked:bg-${statusColor["édité"]}`}
                            checked={filters.status === "édité"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer m-0 p-0">
                        <span className="label-text">Validé</span>
                        <input
                            type="radio"
                            name="status"
                            value="validé"
                            className={`radio checked:bg-${statusColor["validé"]}`}
                            checked={filters.status === "validé"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="label cursor-pointer m-0 p-0">
                        <span className="label-text">Non envoyé</span>
                        <input
                            type="checkbox"
                            name="isSend"
                            className="toggle toggle-info"
                            checked={filters.isSend}
                            onChange={handleChangeCheckbox}
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="label cursor-pointer m-0 p-0">
                        <span className="label-text pt-2">Début</span>
                        <input
                            type="date"
                            name="beginAt"
                            value={filters.beginAt}
                            className="!input !input-bordered !input-sm !max-w-sm !w-auto"
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer m-0 p-0">
                        <span className="label-text pt-2">Fin</span>
                        <input
                            type="date"
                            name="endAt"
                            value={filters.endAt}
                            className="!input !input-bordered !input-sm !max-w-sm !w-auto"
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>

                <div className="form-control mb-3 h-6">
                    <label className="label cursor-pointer m-0 p-0">
                        <span className="label-text">
                            {_.isEqual(filters, defaultFilters)
                                ? "Aucun filtre"
                                : "Réinitialiser"}
                        </span>
                        {!_.isEqual(filters, defaultFilters) && (
                            <button
                                className="bg-secondary rounded-full h-6 w-6 flex items-center justify-center"
                                style={{}}
                                onClick={() => setFilters(defaultFilters)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </label>
                </div>
            </Dropdown>
        ),
    };
};
