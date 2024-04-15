import { StatusColor } from "components/dot/Dot";

export const statusColor = {
    true: StatusColor.Info,
    false: StatusColor.Error,
    "à traiter": StatusColor.Info,
    "DEFAULT - à traiter": StatusColor.Info,
    édité: StatusColor.Info,
    préparé: StatusColor.Mention,
    "DEFAULT - préparé": StatusColor.Mention,
    validé: StatusColor.Mention,
    posé: StatusColor.Waiting,
    "DEFAULT - posé": StatusColor.Waiting,
    comptabilisé: StatusColor.Success,
    lettré: StatusColor.Success,
    facturé: StatusColor.Success,
    bloqué: StatusColor.Warning,
    annulé: StatusColor.Error,
    avoir: StatusColor.Waiting,
    programmé: StatusColor.Info,
    irrécouvrable: StatusColor.Error,
};

export const userStatus = {
    true: "Actif",
    false: "Inactif",
};

export const status = {
    "DEFAULT - à traiter": "à traiter",
    édité: "édité",
    "DEFAULT - préparé": "préparé",
    "DEFAULT - posé": "posé / livré",
    posé: "posé / livré",
    comptabilisé: "comptabilisé",
    facturé: "facturé",
    lettré: "lettré",
    irrécouvrable: "irrécouvrable",
    bloqué: "bloqué",
    annulé: "annulé",
    programmé: "programmé",
};

export const commandDetails = {
    proprietaire: "Nom du propriétaire",
    nouveloccupant: "Nouvel occupant",
    ancienoccupant: "Ancien occupant",
    entree: "Entrée",
    numerodeporte: "N° de porte",
    numeroappartement: "N° d'appartement",
    numeroetage: "N° d'étage",
    numeroboiteauxlettres: "N° de boîte aux lettres",
    numerodelot: "N° de lot",
    numerodevilla: "N° de villa",
    situationpaliere: "Situation palière",
    tableauboiteauxlettres: "Tableau boîte aux lettres",
    platineadefilement: "Platine à défilement",
    platineparlophoneelectricien: "Platine parlophone électricien",
    tableauptt: "Tableau PTT",
};
