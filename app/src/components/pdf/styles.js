import { Font, StyleSheet } from "@react-pdf/renderer";
import MontserratBlack from "./fonts/Montserrat-Black.ttf";
import MontserratBold from "./fonts/Montserrat-Bold.ttf";
import Montserrat from "./fonts/Montserrat-Medium.ttf";

Font.register({
    family: "Montserrat",
    fonts: [
        { src: Montserrat }, // font-style: normal, font-weight: normal
        { src: MontserratBold, fontWeight: 700 },
        { src: MontserratBlack, fontWeight: 900 },
    ],
});

const dpi = 72;
const gap = 20;

// Create styles
export const styles = StyleSheet.create({
    page: {
        fontFamily: "Montserrat",
        flexDirection: "column",
        backgroundColor: "white",
        padding: 20,
        fontSize: "12px",
    },
    container: { flexDirection: "column", padding: 25 },
    table: {
        fontSize: 10,
        width: 550,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "stretch",
        flexWrap: "wrap",
        alignItems: "stretch",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    column: {
        padding: 3,
        border: "2px solid black",
        marginRight: 8,
        marginBottom: 8,
        display: "flex",
        flexDirection: "column",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        marginBottom: 10,
        fontSize: "14px",
        fontFamily: "Montserrat",
        fontWeight: 900,
        paddingHorizontal: 10,
        paddingTop: 5,
        border: "3px solid black",
    },
    subtitle: {
        marginTop: 30,
        fontSize: "14px",
        fontFamily: "Montserrat",
        fontWeight: 900,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 700,
    },
    separator: {
        marginTop: 8,
    },
    service: {
        paddingLeft: 4,
        marginRight: 8,
    },
    flex: {
        flexBasis: 1,
    },
});
