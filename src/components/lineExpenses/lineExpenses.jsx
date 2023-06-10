import { 
    useEffect, 
    useState 
} from "react";
import { 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View 
} from "react-native";
import moment from "moment";
import Filters from "../../libs/Filters";

export function ExpensesLine({ data }) {
    const [dueDate, setDueDate] = useState();

    function filterTransactionByDate() {
        let dateFiltered = data.due_dates.filter(date => moment(date).format('MM/YYYY') === moment().format('MM/YYYY'))
        setDueDate(dateFiltered[0]);
    }

    useEffect(() => {
        filterTransactionByDate()
    }, [])
    const styles = estilo()
    return (
        <>
        {dueDate &&
        <TouchableOpacity style={styles.containerLine}>
            <View style={styles.celTitle}>
                <Text>{data.description}</Text>
            </View>
            <View style={styles.celDateAndValue}>
                <Text>{moment(dueDate).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={styles.celDateAndValue}>
                <Text>{Filters.convertMoneyTextMask(data.amount)}</Text>
            </View>
        </TouchableOpacity>}
        </>
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