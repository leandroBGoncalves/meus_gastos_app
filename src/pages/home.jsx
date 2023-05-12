import { useState } from "react";
import { 
    Text, 
    TouchableOpacity, 
    View,
    StyleSheet, 
    TextInput
} from "react-native";
import { Dialog } from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

import { ExpensesShow } from "../components/expensesTable/tableExpenses";
import { Header } from "../components/Header/Header";
import { CardSummary } from "../components/summary/summaryCard";

export function Home() {
    const [visibleModalInner, setVisibleModalInner] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateSelecyed, setDateSelected] = useState();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
      const handleConfirm = (date) => {
        console.log("A date has been picked: ", date);
        setDateSelected(date)
        hideDatePicker();
      };

    function hideDialog() {
        setVisibleModalInner(false);
    }

    return (
        <View style={styles.container}>
            <Header/>
            <CardSummary />
            <ExpensesShow />
            <View style={styles.contentBTNNew}>
                <TouchableOpacity 
                style={styles.BTNAdd}
                onPress={() => {
                    setVisibleModalInner(true);
                }}
                >
                    <MaterialCommunityIcons 
                    name={'wallet-plus-outline'}
                    size={25} 
                    />
                    <Text style={styles.textBtn}>
                      Add Lançamento  
                    </Text>
                </TouchableOpacity>
            </View>
          <Dialog 
          visible={visibleModalInner} 
          onDismiss={hideDialog}
          style={styles.modalInnerData}
          >
            <View>
                <Text style={styles.labelSimple}>Descrição</Text>
                <TextInput 
                style={styles.inputSimple}
                />
            </View>
            <View style={styles.boxInputSimple}>
                <Text style={styles.labelSimple}>Valor</Text>
                <TextInput 
                style={styles.inputSimple}
                />
            </View>
            <View 
            style={styles.dueDatesAndInstallments}
            >
                <TouchableOpacity 
                onPress={() => showDatePicker()}
                style={styles.boxDueDateContainer}
                >
                    <View
                    style={styles.boxDueDate}
                    >
                        <Text style={styles.textLabelWhite}>Vencimento</Text>
                        <MaterialCommunityIcons 
                        name={'calendar-check'}
                        style={{marginLeft: 5}}
                        size={25} 
                        color={'#FFFFFF'}
                        />
                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          mode="date"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                        />
                    </View>
                    <Text style={styles.textLabelWhite}>{moment(dateSelecyed).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.labelSimple}>Parcelas</Text>
                    <TextInput 
                    style={styles.inputInstAllMents}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.BTNSendRegister}>
                <Text style={styles.textLabelWhite}>Enviar</Text>
            </TouchableOpacity>
          </Dialog>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },

    contentBTNNew: {
        width: '100%',
        height: '7%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    BTNAdd: {
        flexDirection: 'row',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#70e000',
        borderWidth: 2,
        padding: 4,
        borderRadius: 5
    },

    textBtn: {
        fontWeight: 'bold'
    },

    modalInnerData: {
        padding: 10,
        borderRadius: 5
    },

    inputSimple: {
        borderWidth: 1,
        borderColor: '#3b3b3b',
        borderRadius: 5,
        height: 40,
        padding: 3,
        fontSize: 16,
        color: '#6b6b6b'
    },

    inputInstAllMents: {
        borderWidth: 1,
        borderColor: '#3b3b3b',
        borderRadius: 5,
        height: 40,
        padding: 3,
        fontSize: 16,
        color: '#6b6b6b',
        width: 150
    },


    labelSimple: {
        fontSize: 18,
        color: '#6b6b6b',
        fontWeight: 'bold',
        marginBottom: 5
    },

    boxInputSimple: {
        marginTop: 10
    },

    dueDatesAndInstallments: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15
    },

    boxDueDate: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#22577a',
        paddingTop: 3,
        paddingLeft: 5,
        paddingBottom: 3,
        paddingRight: 5,
        borderRadius: 5
    },

    boxDueDateContainer: {
        alignItems: 'center',
        backgroundColor: '#22577a',
        paddingTop: 3,
        paddingLeft: 5,
        paddingBottom: 3,
        paddingRight: 5,
        borderRadius: 5
    },

    textLabelWhite: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF'
    },

    BTNSendRegister: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#70e000',
        marginTop: 20,
        padding: 8,
        borderRadius: 5
    }
})