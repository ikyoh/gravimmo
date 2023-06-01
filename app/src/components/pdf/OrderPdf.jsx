import React from 'react'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Button, ButtonSize } from 'components/button/Button'
import { MdOutlineFileDownload } from 'react-icons/md'
import { styles } from './styles';
import uuid from "react-uuid"
import { orderDetails } from 'config/translations.config';

const OrderPdf = ({ orders = [] }) => {

    // Create Document Component
    const MyDoc = () => (
        <Document>

            {orders.map(order =>
                <Page key={order["@id"]} size="A4" orientation='landscape' style={styles.page} dpi='72' wrap debug={false}>

                    <View style={styles.row}>
                        <View style={{ ...styles.column, marginRight: 20 }}>
                            <Text style={{ ...styles.subtitle, marginTop: 70 }}>Pose</Text>
                            <Text style={styles.bold}>Copropriété : {order.property.title}</Text>
                            <Text style={styles.separator}>Secteur : {order.property.zone}</Text>
                            <Text style={styles.separator}>{order.property.address}</Text>
                            <Text>{order.property.postcode} {order.property.city}</Text>
                            {order.property.contactName &&
                                <Text style={styles.separator}>Contact : {order.property.contactName} {order.property.contactPhone}</Text>
                            }
                            {order.property.accessType &&
                                <>
                                    <Text style={styles.separator}>Type d'accès : {order.property.accessType}</Text>
                                    <Text>Code d'accès : {order.property.accessCode}</Text>
                                </>
                            }
                            <Text style={{ ...styles.separator, ...styles.bold }}>Ancien occupant : {order.details.ancienoccupant}</Text>
                        </View>
                        <View style={{ ...styles.column, marginLeft: 20 }}>
                            <Text style={styles.title}>
                                COMMANDE # {order.id} - {order.trustee.title}
                            </Text>
                            <Text style={styles.subtitle}>Préparation</Text>
                            {order.property.services.map(service =>
                                <View key={service["@id"]} style={styles.service}>
                                    <Text style={styles.bold}>{service.service.title}</Text>
                                    <Text>Catégorie : {service.service.category}</Text>
                                    {service.material &&
                                        <Text>Matière : {service.material}</Text>
                                    }
                                    {service.color &&
                                        <Text>Couleur : {service.color}</Text>
                                    }
                                    {service.configuration &&
                                        <Text>Configuration : {service.configuration}</Text>
                                    }
                                    {service.finishing.length > 0 &&
                                        <Text>Façonnage : {service.finishing.map(finishing => finishing + ". ")}</Text>
                                    }
                                </View>
                            )}
                            <Text style={{ ...styles.bold, ...styles.separator }}>
                                Nouvel occupant : {order.details.nouveloccupant}
                            </Text>
                            {Object.keys(order.details)
                                .filter(f => f !== 'nouveloccupant' && f !== 'ancienoccupant' && f !== 'proprietaire')
                                .map(key =>
                                    <Text key={uuid()}>
                                        {orderDetails[key]} : {order.details[key]}
                                    </Text>
                                )}
                            {order.property.params.includes("platineadefilement") &&
                                <Text>Platine à défilement</Text>
                            }
                            {order.property.params.includes("platineparlophoneelectricien") &&
                                <Text>Platine parlophone électricien</Text>
                            }
                            {order.property.params.includes("tableauptt") &&
                                <Text>Tableau PTT</Text>
                            }
                        </View>
                    </View>

                </Page>
            )}

        </Document>
    );

    if (orders.length === 0)
        return (
            <Button
                disabled={true}
                size={ButtonSize.Big}
            >
                <MdOutlineFileDownload />
            </Button>)
    else return (
        <PDFDownloadLink document={<MyDoc />} fileName="Commande.pdf">
            {({ blob, url, loading, error }) =>
                loading ?
                    <Button
                        disabled={true}
                        size={ButtonSize.Big}
                    >
                        <MdOutlineFileDownload />
                    </Button>
                    :
                    <Button
                        size={ButtonSize.Big}
                    >
                        <MdOutlineFileDownload />
                    </Button>
            }
        </PDFDownloadLink>

    )
}

export default OrderPdf