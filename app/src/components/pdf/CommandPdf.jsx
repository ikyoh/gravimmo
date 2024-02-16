import {
    Document,
    PDFDownloadLink,
    Page,
    Text,
    View,
} from "@react-pdf/renderer";
import { commandDetails } from "config/translations.config";
import { MdOutlineFileDownload } from "react-icons/md";
import uuid from "react-uuid";
import { styles } from "./styles";

const CommandPdf = ({ commands = [] }) => {
    console.log("commands", commands);
    // Create Document Component
    const MyDoc = () => (
        <Document>
            {commands.map((order) => (
                <Page
                    key={order["@id"]}
                    size="A4"
                    orientation="portrait"
                    style={styles.page}
                    dpi="72"
                    wrap
                    debug={false}
                >
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.title}>
                            COMMANDE # {order.id} -{" "}
                            {order.trustee && order.trustee.title}{" "}
                            {order.customer && order.customer.title}
                        </Text>

                        <Text style={styles.subtitle}>Préparation</Text>

                        {order.customServices?.map((customService) => (
                            <View key={uuid()} style={styles.service}>
                                <Text key={uuid()}>
                                    {customService.propertyServices?.map(
                                        (propertyService) =>
                                            propertyService.service.title + " "
                                    )}
                                </Text>
                                <Text>
                                    {customService.details["nouveloccupant"]}
                                </Text>
                            </View>
                        ))}

                        {order.extraServices?.map((extraService) => (
                            <View key={uuid()} style={styles.service}>
                                <Text key={uuid()}>
                                    {extraService.service.title}
                                </Text>
                            </View>
                        ))}

                        {!order.isCustom &&
                            order.property &&
                            order.property.services?.map((service) => (
                                <View
                                    key={service["@id"]}
                                    style={styles.service}
                                >
                                    <Text style={styles.bold}>
                                        {service.service.title}
                                    </Text>
                                    {service.material && (
                                        <Text>
                                            Matière : {service.material}
                                        </Text>
                                    )}
                                    {service.color && (
                                        <Text>Couleur : {service.color}</Text>
                                    )}
                                    {service.size && (
                                        <Text>Dimensions : {service.size}</Text>
                                    )}
                                    {service.thickness && (
                                        <Text>
                                            Epaisseur : {service.thickness}
                                        </Text>
                                    )}
                                    {service.margin && (
                                        <Text>Marges : {service.margin}</Text>
                                    )}
                                    {service.font && (
                                        <Text>Police : {service.font}</Text>
                                    )}
                                    {service.configuration && (
                                        <Text>
                                            Configuration :{" "}
                                            {service.configuration}
                                        </Text>
                                    )}
                                    {service.finishing.length > 0 && (
                                        <Text>
                                            Façonnage :{" "}
                                            {service.finishing.map(
                                                (finishing) => finishing + ". "
                                            )}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        {order.details.nouveloccupant && (
                            <Text
                                style={{ ...styles.bold, ...styles.separator }}
                            >
                                Nouvel occupant : {order.details.nouveloccupant}
                            </Text>
                        )}
                        {Object.keys(order.details)
                            .filter(
                                (f) =>
                                    f !== "nouveloccupant" &&
                                    f !== "ancienoccupant" &&
                                    f !== "proprietaire" &&
                                    f !== "orderTags"
                            )
                            .map((key) => (
                                <Text key={uuid()}>
                                    {commandDetails[key]} : {order.details[key]}
                                </Text>
                            ))}
                        {order.property &&
                            order.property.params.includes(
                                "platineadefilement"
                            ) && <Text>Platine à défilement</Text>}
                        {order.property &&
                            order.property.params.includes(
                                "platineparlophoneelectricien"
                            ) && <Text>Platine parlophone électricien</Text>}
                        {order.property &&
                            order.property.params.includes("tableauptt") && (
                                <Text>Tableau PTT</Text>
                            )}
                    </View>
                    {order.property && (
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <Text style={{ ...styles.subtitle, marginTop: 70 }}>
                                Pose
                            </Text>
                            <Text style={styles.bold}>
                                Copropriété : {order.property.title}
                            </Text>
                            <Text style={styles.separator}>
                                Secteur : {order.property.zone}
                            </Text>
                            <Text style={styles.separator}>
                                {order.property.address}
                            </Text>
                            <Text>
                                {order.property.postcode} {order.property.city}
                            </Text>
                            {order.property.contactName && (
                                <Text style={styles.separator}>
                                    Contact : {order.property.contactName}{" "}
                                    {order.property.contactPhone}
                                </Text>
                            )}
                            {order.property.accessType && (
                                <>
                                    <Text style={styles.separator}>
                                        Type d'accès :{" "}
                                        {order.property.accessType}
                                    </Text>
                                    <Text>
                                        Code d'accès :{" "}
                                        {order.property.accessCode}
                                    </Text>
                                </>
                            )}
                            <Text
                                style={{ ...styles.separator, ...styles.bold }}
                            >
                                {order.details.ancienoccupant &&
                                    "Ancien occupant : " +
                                        order.details.ancienoccupant}
                            </Text>
                        </View>
                    )}
                    {order.customer && (
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <Text style={{ ...styles.subtitle, marginTop: 70 }}>
                                Pose
                            </Text>
                            <Text style={styles.bold}>
                                Client : {order.customer.title}
                            </Text>
                            <Text style={styles.separator}>
                                Secteur : {order.customer.zone}
                            </Text>
                            <Text style={styles.separator}>
                                {order.customer.address}
                            </Text>
                            <Text>
                                {order.customer.postcode} {order.customer.city}
                            </Text>
                        </View>
                    )}
                </Page>
            ))}
        </Document>
    );

    if (commands.length === 0)
        return (
            <button disabled={true}>
                <MdOutlineFileDownload size={30} /> Fiches PDF
            </button>
        );
    else
        return (
            <PDFDownloadLink document={<MyDoc />} fileName="Commande.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? (
                        <button disabled={true}>
                            <MdOutlineFileDownload size={30} />
                        </button>
                    ) : (
                        <>
                            <MdOutlineFileDownload size={30} />
                            Fiches PDF
                        </>
                    )
                }
            </PDFDownloadLink>
        );
};

export default CommandPdf;
