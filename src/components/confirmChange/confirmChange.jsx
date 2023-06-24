import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function ConfirmChange({
    textALert,
    textConfirm,
    dataTransaction,
    handleConfirm
}) {

    const styles = estilo();
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons 
                name={'alert-outline'}
                size={20} 
                color={'#FFFFFF'}
            />
            <Text style={styles.text}>{textALert}</Text>
            <TouchableOpacity 
                style={styles.BTNConfirm}
                onPress={() => handleConfirm(dataTransaction.id)}
            >
                <Text style={styles.textButton} >{textConfirm}</Text>
            </TouchableOpacity>
        </View>
    )
}

const estilo = () => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(239, 35, 60, 0.6)'
    },

    text: {
        color: '#FFFFFF',
        maxWidth: '60%',
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 5
    },

    textButton: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    BTNConfirm: {
        backgroundColor: 'rgba(239, 35, 60, 0.8)',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5
    }
});