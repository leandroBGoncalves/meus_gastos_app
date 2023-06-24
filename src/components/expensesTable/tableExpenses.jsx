import { 
    useContext, 
    useEffect, 
    useState 
} from "react";
import { 
    ScrollView, 
    StyleSheet, 
    Dimensions,
    Text,
    View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../../context/contextProvider";
import { ExpensesLine } from "../lineExpenses/lineExpenses";

export function ExpensesShow() {
    const {
        transactionsByUser
    } = useContext(AuthContext);

    return (
        <ScrollView 
        style={styles.containerExpenses}
        fadingEdgeLength={80}
        >
            {transactionsByUser?.map(expense => {
                return (
                    <ExpensesLine key={expense.id} data={expense}/>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    containerExpenses: {
        width: '100%',
        height: Dimensions.get('screen').height - 420,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5
    }
})