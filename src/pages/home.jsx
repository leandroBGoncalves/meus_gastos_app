import { 
    useContext, 
    useEffect, 
    useState 
} from "react";
import { 
    Text, 
    TouchableOpacity, 
    View,
    StyleSheet, 
    TextInput,
    SafeAreaView,
    ScrollView
} from "react-native";
import { Dialog } from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ExpensesShow } from "../components/expensesTable/tableExpenses";
import { Header } from "../components/Header/Header";
import { CardSummary } from "../components/summary/summaryCard";
import { AuthContext } from "../context/contextProvider";

import Filters from "../libs/Filters";

let parcelas = [];
export function Home() {
    const {
        insertTransaction,
        getTransactions
    } = useContext(AuthContext);
    const [visibleModalInner, setVisibleModalInner] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateSelected, setDateSelected] = useState(moment());
    const [dataUserRetrieve, setDataUserRetrieve] = useState(null);
    const [numberInstallments, setNumberInstallments] = useState([]);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [installments, setInstallments] = useState('');
    const [category, setCategory] = useState("");

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
          setDateSelected(date)
          hideDatePicker();
    };

    function hideDialog() {
        setVisibleModalInner(false);
        setDescription('');
        setAmount('');
        setInstallments('');
        setCategory('');
    }

    async function retrieveUserData() {
        const dataUser = await AsyncStorage.getItem("data_user");
        const userDataParse = JSON.parse(dataUser);
        setDataUserRetrieve(userDataParse);
    }

    function handleSendData() {
        insertTransaction({
            description: description,
            amount: amount,
            due_dates: Number(installments) >= 1 ? numberInstallments : [dateSelected],
            installments: installments,
            user_id: dataUserRetrieve.id,
            category: category
        })
        hideDialog();
        setTimeout(() => {
            getTransactions(dataUserRetrieve.id);           
        }, 500);
    }

    useEffect(() => {
        retrieveUserData();
    }, [])

    useEffect(() => {
        let dueDate = 1;
        let dueDates = [];
        if (Number(installments) >= 1) {
            parcelas = [];
            while (Number(parcelas.length) < Number(installments)) {
                parcelas.push(dueDate ++);
            }
            while (dueDates?.length < Number(installments)) {
                parcelas.forEach((item, index) => {
                    if (dueDates?.length < 1) {
                        dueDates.push(moment(dateSelected));
                    } else {
                            dueDates.push(moment(dueDates[index-1]).add(1, 'month')); 
                        }
                    }
            )}               
            setTimeout(() => {
                setNumberInstallments(dueDates);
            }, 500);
        }
    }, [installments])

    function handleCategoryChange(categorySelected) {
        setCategory(categorySelected);
    }
    
    const styles = estilos(category);
    return (
        <SafeAreaView style={styles.container}>
            <Header
                photo={dataUserRetrieve?.photo_url}
                nomeUser={dataUserRetrieve?.name}
            />
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
                <ScrollView style={{maxHeight: '100%'}}>
                    <View>
                      <Text style={styles.labelSimple}>Descrição</Text>
                      <TextInput 
                          onChangeText={setDescription}
                          style={styles.inputSimple}
                      />
                    </View>
                    <View style={styles.boxInputSimple}>
                        <Text style={styles.labelSimple}>Valor</Text>
                        <TextInput 
                            onChange={(e) => setAmount(Filters.removeMoneyMask(e.nativeEvent.text))}
                            style={styles.inputSimple}
                            value={Filters.convertMoneyTextMask(amount)}
                            keyboardType={'decimal-pad'}
                        />
                    </View>
                    <View style={styles.boxInputCategory}>
                        <TouchableOpacity 
                            style={styles.btnCategoryPlus}
                            onPress={() => {
                                handleCategoryChange('income')
                            }}
                        >
                            <MaterialCommunityIcons 
                                name={'plus-thick'}
                                size={20} 
                                color={'#FFFFFF'}
                            />
                            <Text style={styles.textLabelWhite}>Entrada</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.btnCategoryMinus}
                            onPress={() => {
                                handleCategoryChange('expense')
                            }}
                        >
                            <Text style={styles.textLabelWhite}>Saída</Text>
                            <MaterialCommunityIcons 
                                name={'exit-to-app'}
                                size={20} 
                                color={'#FFFFFF'}
                            />
                        </TouchableOpacity>
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
                            <Text style={styles.textLabelWhite}>{moment(dateSelected).format('DD/MM/YYYY')}</Text>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.labelSimple}>Parcelas</Text>
                            <TextInput 
                                onChangeText={setInstallments}
                                style={styles.inputInstAllMents}
                                keyboardType='ascii-capable'
                            />
                        </View>
                    </View>
                    {Number(installments) > 1 && 
                    <>
                        <View style={styles.divider}></View>
                        {numberInstallments?.map((parcela, index) => {
                            return (
                                <View style={styles.boxInputParcelas}>
                                    <Text style={styles.labelSimple}>{'Parcela' + ' ' + (index+1)}</Text>
                                    <TextInput 
                                        style={styles.inputInstAllMents}
                                        keyboardType='ascii-capable'
                                        value={moment(parcela).format('DD/MM/YYYY')}
                                        editable={false}
                                    />
                                </View>
                            )
                        })}
                    </>
                    }
                    <TouchableOpacity 
                        style={styles.BTNSendRegister}
                        onPress={() => handleSendData()}
                    >
                        <Text style={styles.textLabelWhite}>Enviar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Dialog>
        </SafeAreaView>
    )
}

const estilos = (category) => StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingBottom: '50%'
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
        borderRadius: 5,
        bottom: '10%',
        maxHeight: '50%',
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

    boxInputCategory: {
        marginTop: 10,
        flexDirection: 'row',
        width: '100%',
        justifyContent:'center'
    },

    btnCategoryPlus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-evenly',
        width: '50%',
        borderColor: '#70e000',
        backgroundColor: category === 'income' ? 'rgba(112, 224, 0, 0.9)' : 'rgba(112, 224, 0, 0.2)',
        borderWidth: category === 'income' ? 2 : 0.8,
        padding: 4,
        borderRadius: 5
    },

    btnCategoryMinus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-evenly',
        width: '50%',
        borderColor: '#ef233c',
        backgroundColor: category === 'expense' ? 'rgba(239, 35, 60, 0.9)' : 'rgba(239, 35, 60, 0.2)',
        borderWidth: category === 'expense' ? 2 : 0.8,
        padding: 4,
        borderRadius: 5
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
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF'
    },

    BTNSendRegister: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#70e000',
        marginTop: 20,
        padding: 8,
        borderRadius: 5
    },

    divider: {
        height: 2,
        backgroundColor: '#70e000',
        marginTop: 20,
        marginBottom: 20
    },

    boxInputParcelas: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 10
    }
})