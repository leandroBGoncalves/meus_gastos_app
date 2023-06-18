import { 
    useContext,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from "../../context/contextProvider";
import Filters from "../../libs/Filters";

export function ExpensesLine({ data }) {
    const {
        handleEditing
    } = useContext(AuthContext);
    const [dueDate, setDueDate] = useState();

    function filterTransactionByDate() {
        let dateFiltered = data.due_dates.filter(date => moment(date).format('MM/YYYY') === moment().format('MM/YYYY'))
        setDueDate(dateFiltered[0]);
    }

    useEffect(() => {
        filterTransactionByDate()
    }, [])

    function renderIcom() {
        switch (data.category) {
            case 'income':
                return 'plus-thick';
            case 'expense':
                return 'exit-to-app'     
            default:
                break;
        }
    };

    function renderColorTransaction() {
        switch (data.category) {
            case 'income':
                return '#70e000';
            case 'expense':
                return '#ef233c'     
            default:
                break;
        }
    };

    const styles = estilo(renderColorTransaction)
    return (
        <>
        {dueDate &&
        <TouchableOpacity 
            style={styles.containerLine}
            onPress={() => handleEditing(data.id)}
        >
            <View style={styles.celTitle}>
                <Text>{data.description}</Text>
            </View>
            <View style={styles.celDateAndValue}>
                <Text>{moment(dueDate).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={styles.celAmountAndIcon}>
                <Text style={{color: renderColorTransaction()}}>{Filters.convertMoneyTextMask(data.amount)}</Text>
                <MaterialCommunityIcons 
                    name={renderIcom()}
                    size={20} 
                    color={renderColorTransaction()}
                />
            </View>
        </TouchableOpacity>}
        </>
    )
}

const estilo = (renderColorTransaction) => StyleSheet.create({
    containerLine: {
        flexDirection: 'row',
        width: '95%',
        backgroundColor: '#FFFFFF',
        height: 50,
        alignItems: 'center',
        borderRadius: 5,
        borderColor: renderColorTransaction(),
        borderWidth: 0.5,
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
    },

    celAmountAndIcon: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingRight: 10,
    }
})