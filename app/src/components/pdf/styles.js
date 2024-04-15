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
        marginBottom: 2,
    },
    column: {
        padding: 3,
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
        fontSize: "14px",
        fontFamily: "Montserrat",
        fontWeight: 700,
        paddingHorizontal: 10,
        paddingTop: 5,
        border: "2px solid black",
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 16,
    },
    subtitle: {
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 5,
        fontSize: "14px",
        fontFamily: "Montserrat",
        fontWeight: 700,
        border: "2px solid black",
    },
    bold: {
        fontWeight: 700,
    },
    separator: {
        marginTop: 4,
    },
    service: {
        paddingLeft: 4,
        marginRight: 8,
    },
    flex: {
        flexBasis: 1,
    },
});
