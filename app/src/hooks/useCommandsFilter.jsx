import Dropdown from "components/dropdown/Dropdown";
import { statusColor } from "config/translations.config";
import _ from "lodash";
import { useGetCommandsZones } from "queryHooks/useCommand";
import { useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import uuid from "react-uuid";

export const useCommandsFilter = () => {
    const defaultFilters = {
        status: "DEFAULT",
        isHanging: false,
        isReport: false,
        zone: "",
    };

    const [filters, setFilters] = useState(defaultFilters);

    const handleChangeInput = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleChangeCheckbox = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.checked });
    };

    const { data = [], isLoading, isError, error } = useGetCommandsZones()

    return {
        filters,
        filter: (
            <Dropdown type="button" icon={<LuSettings2 size={26} />}>
                <div className="w-64 dropdown-title">Filtres</div>
                <div className="form-control">
                    <span className="label-text">Secteur</span>
                    <label className="label cursor-pointer">
                        <select name="zone" id="zone-select" value={filters.zone}
                            onChange={handleChangeInput}>
                            <option value="">Tous</option>
                            {data.map((zone) => (
                                <option key={uuid()} value={zone}>{zone}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">A traiter</span>
                        <input
                            type="radio"
                            name="status"
                            value="à traiter"
                            className={`radio checked:bg-${statusColor["à traiter"]}`}
                            checked={filters.status === "à traiter"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Préparé</span>
                        <input
                            type="radio"
                            name="status"
                            value="préparé"
                            className={`radio checked:bg-${statusColor["préparé"]}`}
                            checked={filters.status === "préparé"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Posé</span>
                        <input
                            type="radio"
                            name="status"
                            value="posé"
                            className={`radio checked:bg-${statusColor["posé"]}`}
                            checked={filters.status === "posé"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Annulé</span>
                        <input
                            type="radio"
                            name="status"
                            value="annulé"
                            className={`radio checked:bg-${statusColor["annulé"]}`}
                            checked={filters.status === "annulé"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Facturé</span>
                        <input
                            type="radio"
                            name="status"
                            value="facturé"
                            className={`radio checked:bg-${statusColor["facturé"]}`}
                            checked={filters.status === "facturé"}
                            onChange={handleChangeInput}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
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
                    <label className="cursor-pointer label">
                        <span className="label-text">Bloqué</span>
                        <input
                            type="checkbox"
                            name="isHanging"
                            className="toggle toggle-warning"
                            checked={filters.isHanging}
                            onChange={handleChangeCheckbox}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="cursor-pointer label">
                        <span className="label-text">Avec incidents</span>
                        <input
                            type="checkbox"
                            name="isReport"
                            className="toggle toggle-info"
                            checked={filters.isReport}
                            onChange={handleChangeCheckbox}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="cursor-pointer label">
                        <span className="label-text">Non programmé</span>
                        <input
                            type="checkbox"
                            name="isNotTour"
                            className="toggle toggle-info"
                            checked={filters.isTour}
                            onChange={handleChangeCheckbox}
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
