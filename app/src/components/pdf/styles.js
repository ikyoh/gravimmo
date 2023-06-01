import { StyleSheet, Font } from '@react-pdf/renderer'
import Montserrat from './fonts/Montserrat-Medium.ttf'
import MontserratBold from './fonts/Montserrat-Bold.ttf'
import MontserratBlack from './fonts/Montserrat-Black.ttf'

Font.register({
    family: 'Montserrat',
    fonts: [
        { src: Montserrat }, // font-style: normal, font-weight: normal
        { src: MontserratBold, fontWeight: 700 },
        { src: MontserratBlack, fontWeight: 900 },
    ]
});

const dpi = 72
const gap = 20

// Create styles
export const styles = StyleSheet.create({
    page: {
        fontFamily: 'Montserrat',
        flexDirection: 'col',
        backgroundColor: 'white',
        padding: 20,
        fontSize: '12px',
    },
    row: {
        flexDirection: 'row',
        marginTop: 0,
    },
    column: {
        flex: 1,
        flexShrink: 1,
        flexGrow: 1,
        flexBasis: 0,
        lineHeight: 1.3,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    title: {
        marginBottom: 10,
        fontSize: '14px',
        fontFamily: 'Montserrat',
        fontWeight: 900,
        paddingHorizontal: 10,
        paddingTop: 5,
        border: '3px solid black',
    },
    subtitle: {
        marginTop: 30,
        fontSize: '14px',
        fontFamily: 'Montserrat',
        fontWeight: 900,
        marginBottom: 10
    },
    bold: {
        fontWeight : 700
    },
    separator: {
        marginTop: 8
    },
    service :{
        borderLeft: '1px solid black',
        paddingLeft : 4,
        marginBottom: 8
    }

});