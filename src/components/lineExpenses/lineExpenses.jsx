import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Filters from "../../libs/Filters";

export function ExpensesLine({ data }) {

    const styles = estilo()
    return (
        <TouchableOpacity style={styles.containerLine}>
            <View style={styles.celTitle}>
                <Text>{data.title}</Text>
            </View>
            <View style={styles.celDateAndValue}>
                <Text>{data.date}</Text>
            </View>
            <View style={styles.celDateAndValue}>
                <Text>{Filters.convertMoneyTextMask(data.amount)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const estilo = () => StyleSheet.create({
    containerLine: {
        flexDirection: 'row',
        width: '95%',
        backgroundColor: '#FFFFFF',
        height: 50,
        alignItems: 'center',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: -2,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginBottom: 10,
        marginLeft: 8,
        marginTop: 2
    },

    celTitle: {
        width: '40%',
        alignItems: 'center',
    },

    celDateAndValue: {
        width: '30%',
        alignItems: 'center',
    }
})