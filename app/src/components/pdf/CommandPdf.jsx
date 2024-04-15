import {
    Circle,
    Document,
    PDFDownloadLink,
    Page,
    Path,
    Svg,
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
                        <View style={styles.row}>
                            <Svg
                                style={{ width: 60, height: 60 }}
                                viewBox="0 0 89 89"
                            >
                                <Path
                                    fill="#000"
                                    d="M87.1407 32.1028C86.3561 32.0642 85.5132 32.0194 85.0705 32.0194C79.1437 32.0194 74.5299 33.7295 71.2292 37.1505C69.0167 39.4315 67.4795 42.3171 66.5816 45.7908C66.5124 46.0817 66.4857 46.4937 66.4252 46.8113V36.2353C66.4252 35.1244 66.1901 34.1958 66.1209 33.1375C67.6989 30.2904 69.4397 28.0826 71.3495 26.6272C74.7925 24.0491 78.7624 22.8029 83.1552 22.615C81.2139 19.1869 78.966 15.8877 76.0435 12.966C60.1429 -2.93454 35.3168 -4.14774 17.8438 8.97965C22.5519 5.83933 27.9094 4.21649 33.9519 4.21649C39.3424 4.21649 44.3706 5.59873 49.07 8.32862C55.1769 11.8739 59.1082 17.1292 61.3098 23.7425C61.938 25.6263 62.4451 27.6061 62.7565 29.74C62.9153 30.8353 63.0159 31.9777 63.0906 33.1375C63.1606 34.1966 63.3957 35.1251 63.3957 36.2353V60.7894C63.3957 63.4069 63.1559 65.8184 62.7565 68.093C61.8837 73.0582 59.9731 77.1248 57.1953 80.4357C56.5725 81.1787 56.0277 81.9886 55.309 82.6483C51.8314 85.7862 47.7326 87.8203 43.1361 88.9784C55.0055 89.3425 66.9842 85.1037 76.0427 76.046C87.9529 64.1358 91.5163 47.2139 87.1392 32.1028H87.1407ZM65.7867 80.4365H60.2263C63.0034 77.1248 64.914 73.0582 65.7867 68.0922V80.4365Z"
                                />
                                <Path
                                    fill="#000"
                                    d="M49.5558 74.0762C51.2022 72.0885 52.1952 69.5733 52.7692 66.6956C52.8093 66.4951 52.9595 66.385 52.9941 66.1806C53.2701 64.4689 53.4084 62.0684 53.4092 59.0099V37.5316C53.4084 35.6989 52.9768 34.3103 52.7692 32.693C52.1245 27.6711 50.8075 23.3428 48.1554 20.3904C44.3201 16.1918 39.5325 14.083 33.8306 14.083C28.4054 14.083 23.8608 16.018 20.2314 19.8887C16.5171 23.8114 14.6678 28.5117 14.6686 33.9722C14.6678 39.1207 16.4133 43.5961 19.9389 47.3811C23.6886 51.4248 28.3354 53.4455 33.884 53.4463C37.478 53.4463 40.8125 52.513 43.8711 50.6291C45.218 49.765 47.0326 48.3482 49.3144 46.344V56.8154C46.4626 58.9753 44.1133 60.4613 42.2813 61.2735C39.343 62.6212 36.1823 63.295 32.7943 63.295C28.9927 63.295 25.2957 62.5009 21.6671 60.9111C18.0558 59.3212 14.9108 57.0922 12.2155 54.242C6.9106 48.6085 4.26641 41.904 4.2672 34.0941C4.2672 28.01 5.8523 22.5825 9.00677 17.813C-4.14893 35.2876 -2.94595 60.1358 12.9656 76.0466C13.8352 76.9154 14.8369 77.5444 15.7576 78.3275C22.0964 80.1697 27.7268 81.1109 32.6056 81.1109C40.0703 81.1109 45.7204 78.7607 49.5565 74.0778L49.5558 74.0762Z"
                                />
                            </Svg>
                            <Text style={styles.title}>
                                COMMANDE # {order.id + " - "}
                                Secteur :{" "}
                                {order.property
                                    ? order.property.zone
                                    : order.customer.zone}
                            </Text>
                            {order.trustee && (
                                <View
                                    style={{
                                        ...styles.row,
                                        flex: 1,
                                        justifyContent: "flex-end",
                                        marginTop: 20,
                                        marginLeft: 20,
                                    }}
                                >
                                    <Svg
                                        viewBox="0 0 100 100"
                                        width={26}
                                        height={26}
                                    >
                                        <Circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill={order.trustee.color}
                                        />
                                    </Svg>
                                    <Svg
                                        viewBox="0 0 100 100"
                                        width={26}
                                        height={26}
                                    >
                                        <Circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill={order.trustee.color2}
                                        />
                                    </Svg>
                                </View>
                            )}
                        </View>

                        <View>
                            <View style={styles.row}>
                                <Text style={styles.subtitle}>
                                    {order.property && "Copropriété"}
                                    {order.customer && "Client"}
                                </Text>
                            </View>
                            {order.commentDeliver && (
                                <Text
                                    style={{
                                        marginBottom: 5,
                                        ...styles.bold,
                                    }}
                                >
                                    Commentaire : {order.commentDeliver}
                                </Text>
                            )}
                            <View style={styles.row}>
                                <Text style={styles.bold}>
                                    {order.property && order.property.title}
                                    {order.customer && order.customer.title}
                                </Text>
                                {order.property && order.entrance && (
                                    <Text style={styles.bold}>
                                        {" "}
                                        - Entrée : {order.entrance}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.row}>
                                {order.property && (
                                    <Text>
                                        {order.property.address}{" "}
                                        {order.property.postcode}{" "}
                                        {order.property.city}
                                    </Text>
                                )}
                                {order.customer && (
                                    <Text>
                                        {order.customer.address}{" "}
                                        {order.customer.postcode}{" "}
                                        {order.customer.city}
                                    </Text>
                                )}
                            </View>
                            {order.property && (
                                <>
                                    <View>
                                        {order.property.contactName && (
                                            <Text style={styles.separator}>
                                                Contact :{" "}
                                                {order.property.contactName}{" "}
                                                {order.property.contactPhone}
                                            </Text>
                                        )}
                                    </View>
                                    <View
                                        style={{
                                            ...styles.row,
                                            ...styles.separator,
                                        }}
                                    >
                                        {order.property.digicode && (
                                            <Text
                                                style={{
                                                    ...styles.bold,
                                                    marginRight: 8,
                                                }}
                                            >
                                                Digicode :{" "}
                                                {order.property.digicode}
                                            </Text>
                                        )}
                                        {order.property.accesses.length !== 0 &&
                                            order.property.accesses.map(
                                                (access) => (
                                                    <Text
                                                        key={uuid()}
                                                        style={{
                                                            ...styles.bold,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        {access}
                                                    </Text>
                                                )
                                            )}
                                    </View>
                                    {order.details.ancienoccupant && (
                                        <View
                                            style={{
                                                ...styles.row,
                                                ...styles.separator,
                                            }}
                                        >
                                            <Text>Ancien occupant :</Text>
                                            <Text style={styles.bold}>
                                                {" "}
                                                {order.details.ancienoccupant}
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>

                        {order.commentMake && (
                            <Text
                                style={{
                                    marginBottom: 5,
                                    ...styles.bold,
                                }}
                            >
                                Commentaire : {order.commentDeliver}
                            </Text>
                        )}
                        {order.property &&
                            order.property.services?.map(
                                (service) =>
                                    service.service.category !== "Pose" && (
                                        <View key={uuid()}>
                                            <View style={styles.row}>
                                                <Text style={styles.subtitle}>
                                                    {service.service.title}
                                                </Text>
                                            </View>

                                            <View style={styles.row}>
                                                {service.size && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>
                                                            Dimensions :
                                                        </Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.size}
                                                        </Text>
                                                    </View>
                                                )}
                                                {service.thickness && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>Epaisseur :</Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.thickness}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            <View style={styles.row}>
                                                {service.material && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>Matière :</Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.material}
                                                        </Text>
                                                    </View>
                                                )}
                                                {service.color && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>Couleur :</Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.color}
                                                        </Text>
                                                    </View>
                                                )}
                                                {service.margin && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>Marges :</Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.margin}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            <View style={styles.row}>
                                                {service.font && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>Police :</Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.font}
                                                        </Text>
                                                    </View>
                                                )}
                                                {service.height && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>Hauteur :</Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.height}
                                                        </Text>
                                                    </View>
                                                )}
                                                {service.ratio && (
                                                    <View
                                                        style={{
                                                            ...styles.row,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        <Text>Ratio :</Text>
                                                        <Text
                                                            style={styles.bold}
                                                        >
                                                            {" "}
                                                            {service.ratio}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            {service.finishing.length > 0 && (
                                                <View style={styles.row}>
                                                    <Text>Façonnage :</Text>
                                                    {service.finishing.map(
                                                        (finishing) => (
                                                            <Text
                                                                key={uuid()}
                                                                style={{
                                                                    ...styles.bold,
                                                                    marginRight: 8,
                                                                }}
                                                            >
                                                                {" "}
                                                                {finishing}
                                                            </Text>
                                                        )
                                                    )}
                                                </View>
                                            )}
                                            {service.params.length > 0 && (
                                                <View style={styles.row}>
                                                    <Text>Gravure :</Text>
                                                    {service.params.map(
                                                        (param) => (
                                                            <Text
                                                                key={uuid}
                                                                style={{
                                                                    ...styles.bold,
                                                                    marginRight: 8,
                                                                }}
                                                            >
                                                                {" "}
                                                                {
                                                                    commandDetails[
                                                                        param
                                                                    ]
                                                                }
                                                            </Text>
                                                        )
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    )
                            )}

                        {order.property && (
                            <>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>
                                        Infos gravure
                                    </Text>
                                </View>

                                <View>
                                    {order.details.nouveloccupant && (
                                        <View style={styles.row}>
                                            <Text>Nouvel occupant{" : "}</Text>
                                            <Text style={styles.bold}>
                                                {order.details.nouveloccupant}
                                            </Text>
                                        </View>
                                    )}

                                    <OrderDetails
                                        orderdetails={order.details}
                                    />

                                    {order.property &&
                                        order.property.params.includes(
                                            "platineadefilement"
                                        ) && <Text>Platine à défilement</Text>}
                                    {order.property &&
                                        order.property.params.includes(
                                            "platineparlophoneelectricien"
                                        ) && (
                                            <Text>
                                                Platine parlophone électricien
                                            </Text>
                                        )}
                                    {order.property &&
                                        order.property.params.includes(
                                            "tableauptt"
                                        ) && <Text>Tableau PTT</Text>}
                                </View>
                                {order.customServices?.length > 0 && (
                                    <View style={styles.row}>
                                        {order.customServices?.map(
                                            (customService) => (
                                                <View
                                                    key={uuid}
                                                    style={styles.column}
                                                >
                                                    {customService.propertyServices.map(
                                                        (propertyService) =>
                                                            propertyService
                                                                .service
                                                                .category !==
                                                                "Pose" && (
                                                                <Text
                                                                    key={uuid}
                                                                    style={{
                                                                        marginBottom: 3,
                                                                        fontWeight: 700,
                                                                    }}
                                                                >
                                                                    {
                                                                        propertyService
                                                                            .service
                                                                            .title
                                                                    }
                                                                </Text>
                                                            )
                                                    )}
                                                    <OrderDetails
                                                        orderdetails={
                                                            customService.details
                                                        }
                                                    />
                                                </View>
                                            )
                                        )}
                                    </View>
                                )}
                            </>
                        )}
                        {order.extraServices.length > 0 && (
                            <>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>
                                        {order.property
                                            ? "Services supplémentaires"
                                            : "Prestations"}
                                    </Text>
                                </View>
                                <ExtraServices
                                    extraServices={order.extraServices}
                                />
                            </>
                        )}
                    </View>
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

export const OrderDetails = ({ orderdetails }) => {
    return (
        <View style={styles.row}>
            {Object.keys(orderdetails)
                .filter(
                    (f) =>
                        f !== "ancienoccupant" &&
                        f !== "proprietaire" &&
                        f !== "orderTags" &&
                        f !== "nouveloccupant"
                )
                .map((key) => (
                    <View
                        key={uuid()}
                        style={{ ...styles.row, marginRight: 6 }}
                    >
                        <Text>
                            {commandDetails[key]}
                            {" : "}
                        </Text>
                        <Text style={styles.bold}>{orderdetails[key]}</Text>
                    </View>
                ))}
        </View>
    );
};

export const ExtraServices = ({ extraServices }) => {
    return (
        <View style={styles.row}>
            {extraServices.map((extraService) => (
                <View key={uuid()} style={{ ...styles.row, marginRight: 6 }}>
                    <Text style={styles.bold}>
                        {extraService.service.title}
                    </Text>
                </View>
            ))}
        </View>
    );
};
