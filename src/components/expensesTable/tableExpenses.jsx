import { ScrollView, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { Text, View } from "react-native";
import { ExpensesLine } from "../lineExpenses/lineExpenses";

export function ExpensesShow() {
    const data = [
        {
            title: 'Internet',
            date: '10/05/2023',
            amount: 100
        },
        {
            title: 'Agua',
            date: '10/05/2023',
            amount: 128.9
        },
        {
            title: 'Luz',
            date: '10/05/2023',
            amount: 200.48
        },
        {
            title: 'Claro',
            date: '10/05/2023',
            amount: 144.5
        },
        {
            title: 'Cartão Mãe',
            date: '15/05/2023',
            amount: 1300.96
        },
        {
            title: 'Gasolina',
            date: '10/05/2023',
            amount: 400
        },
        {
            title: 'Compra',
            date: '10/05/2023',
            amount: 1400
        },
        {
            title: 'Compra',
            date: '10/05/2023',
            amount: 1400
        },
        {
            title: 'Compra',
            date: '10/05/2023',
            amount: 1400
        },
        {
            title: 'Compra',
            date: '10/05/2023',
            amount: 1233
        },
    ]

    return (
        <ScrollView 
        style={styles.containerExpenses}
        fadingEdgeLength={80}
        >
            {data.map(expense => {
                return (
                    <ExpensesLine key={expense.amount} data={expense}/>
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