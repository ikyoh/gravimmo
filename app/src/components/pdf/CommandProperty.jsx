import React from 'react'
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { useGetIRI as getProperty } from 'queryHooks/useProperty'


export const CommandProperty = ({ iri }) => {

    console.log('iri', iri)
    //const { data: property, isLoading: isLoadingProperty, error: errorProperty } = getProperty(iri || null)

    const data2 = {}

    return (
        <>
            <Text style={styles.subtitle}>Pose</Text>
            <Text style={{ fontWeight: 700, marginTop: 2 }}>Copropriété - {data2.title}</Text>
            <Text style={styles.separator}>Secteur : {data2.zone}</Text>
        </>
    )
}
