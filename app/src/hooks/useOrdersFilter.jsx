import { useState, useCallback } from 'react';
import { Button, ButtonSize } from 'components/button/Button';
import { GoSettings } from 'react-icons/go';
import { Dot } from 'components/dot/Dot';
import { orderStatusColor } from 'config/translations.config';

export const useOrdersFilter = () => {

    const [filters, setFilters] = useState({
        status: "all",
        isHanging : false
    })

    const handleChangeInput = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleChangeCheckbox = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.checked })
    }

    return {
        filters,
        filter:
            <div className="dropdown dropdown-hover dropdown-left">
                <label tabIndex={0}>
                    <Button
                        size={ButtonSize.Big}
                    >
                        <GoSettings />
                    </Button>
                </label>
                <div tabIndex={0} className="dropdown-content card card-compact p-2 bg-slate-400 dark:bg-primary rounded w-52">
                    <div className="card-body">
                        <h4 className="card-title">Filtres</h4>
                        <p className="">Statut</p>

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
                            <label className="label cursor-pointer">
                                <span className="label-text">A traiter</span>
                                <input
                                    type="radio"
                                    name="status"
                                    value="à traiter"
                                    className={`radio checked:bg-${orderStatusColor["à traiter"]}`}
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
                                    className={`radio checked:bg-${orderStatusColor["préparé"]}`}
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
                                    className={`radio checked:bg-${orderStatusColor["posé"]}`}
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
                                    className={`radio checked:bg-${orderStatusColor["annulé"]}`}
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
                                    className={`radio checked:bg-${orderStatusColor["facturé"]}`}
                                    checked={filters.status === "facturé"}
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
                    </div>
                </div>
            </div>

    }
}