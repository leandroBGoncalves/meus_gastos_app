import { 
    useContext, 
    useEffect, 
    useState 
} from "react";
import { 
    ActivityIndicator,
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View 
} from "react-native";
import { Dialog } from "react-native-paper";
import { AuthContext } from "../../context/contextProvider";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import Filters from "../../libs/Filters";
import { ConfirmChange } from "../confirmChange/confirmChange";

export function EditTransaction({
    openEdit, 
    handleClose
}) {
    const {
        transactionsByIdTransactions,
        loadingTransactions,
        handleEditingCancel,
        deleteTransaction,
        getTransactions
    } = useContext(AuthContext);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateSelected, setDateSelected] = useState(moment());
    const [installments, setInstallments] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [dataUserRetrieve, setDataUserRetrieve] = useState(null);
    const [dueDate, setDueDate] = useState([]);
    const [numberInstallments, setNumberInstallments] = useState([]);

    async function retrieveUserData() {
        const dataUser = await AsyncStorage.getItem("data_user");
        const userDataParse = JSON.parse(dataUser);
        setDataUserRetrieve(userDataParse);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
  
    const handleConfirm = (date) => {
          setDateSelected(date);
          setDueDate([date]);
          hideDatePicker();
    };

    useEffect(() => {
        setDescription(transactionsByIdTransactions[0]?.description);
        setAmount(transactionsByIdTransactions[0]?.amount);
        setInstallments(transactionsByIdTransactions[0]?.installments || 'Sem parcelas');
        setDueDate(transactionsByIdTransactions[0].due_dates);
        retrieveUserData();
    }, [transactionsByIdTransactions]);

    function dateCurrent(date) {
        let dateCorrecty = date?.find((item) => {
            return moment(item).format('YYYY-MM') === moment().format('YYYY-MM');
        })

        return dateCorrecty;
    }

    function handleDelete(idTransaction) {
        deleteTransaction(idTransaction);
        setTimeout(() => {
            getTransactions(dataUserRetrieve.id);
        }, 800);
    }

    function editDuedates() {
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
    }

    useEffect(() => {
        editDuedates();
    }, [installments])

    useEffect(() => {
        editDuedates();
    }, [dateSelected])
    
    const styles = estilo()
    return (
        <Dialog
            visible={openEdit} 
            onDismiss={handleClose}
            style={styles.modalInnerData}
        >
            <View style={styles.containerEdit}>
                <Text style={styles.TitleContainer}>Edite ou exclua esta transação</Text>
                {loadingTransactions && <ActivityIndicator color={'#70e000'}/>}
                {!loadingTransactions && 
                    <View style={styles.contentForm}>
                        <View style={styles.boxInputSimple}>
                            <Text style={styles.labelSimple}>Descrição</Text>
                            <TextInput 
                                onChange={setDescription}
                                style={styles.inputSimple}
                                value={description}
                                keyboardType={'default'}
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
                        <View style={styles.boxInputSimple}>
                            <Text style={styles.labelSimple}>Data de Vencimento</Text>
                            <TouchableOpacity 
                                onPress={() => setDatePickerVisibility(true)}
                                style={styles.inputSimpleFake}
                            >
                                <Text style={styles.textSimpleGray}>{moment(dateCurrent(dueDate)).format('DD/MM/YYYY')}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              minimumDate={new Date()}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
                        </View>
                        <View style={styles.boxInputSimple}>
                            <Text style={styles.labelSimple}>Parcelas</Text>
                            <TextInput 
                                onChangeText={setInstallments}
                                style={styles.inputSimple}
                                value={installments}
                                keyboardType={'decimal-pad'}
                            />
                        </View>
                        {Number(installments) > 1 && 
                            <>
                                <View style={styles.divider}></View>
                                {numberInstallments?.map((parcela, index) => {
                                    return (
                                        <View key={index} style={styles.boxInputParcelas}>
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
                        {confirmDelete && 
                            <ConfirmChange 
                                textALert="Tem certeza que deseja excluir esta transação?"
                                textConfirm="Excluir"
                                dataTransaction={transactionsByIdTransactions[0]}
                                handleConfirm={handleDelete}
                            />}
                        <View style={styles.boxBtnActions}>
                            <TouchableOpacity 
                                onPress={() => setConfirmDelete(true)}
                                style={styles.buttonExclude}
                            >
                                <Text style={styles.textBtnWhite}>Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSave}>
                                <Text style={styles.textBtnWhite}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.boxBtnActions}>
                            <TouchableOpacity 
                                style={styles.buttonCancel}
                                onPress={() => {
                                    setDateSelected(dateCurrent(transactionsByIdTransactions[0].due_dates));                                        
                                    handleEditingCancel();
                                    setConfirmDelete(false);
                                    editDuedates();
                                }}        
                            >
                                <Text style={styles.textBtnGray}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        </Dialog>
    )
}

const estilo = () => StyleSheet.create({
    modalInnerData: {
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#fff'
    },

    containerEdit: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    TitleContainer: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a4e69'
    },

    labelSimple: {
        fontSize: 18,
        color: '#6b6b6b',
        fontWeight: 'bold',
        marginBottom: 5
    },

    textSimpleGray: {
        fontSize: 18,
        color: '#6b6b6b',
    },

    boxInputSimple: {
        marginTop: 10,
        width: '100%'
    },

    inputSimple: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#3b3b3b',
        borderRadius: 5,
        height: 40,
        padding: 3,
        fontSize: 16,
        color: '#6b6b6b'
    },

    contentForm: {
        width: '100%'
    },

    inputSimpleFake: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#3b3b3b',
        borderRadius: 5,
        height: 40,
        padding: 3,
        justifyContent: 'center',
    },

    boxBtnActions: {
        marginVertical: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent:'space-between'
    },

    buttonExclude: {
        width: '45%',
        height: 40,
        backgroundColor: '#ef233c',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

    buttonSave: {
        width: '45%',
        height: 40,
        backgroundColor: '#70e000',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

    buttonCancel: {
        width: '100%',
        height: 40,
        borderWidth: 2,
        borderColor: '#4a4e69',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

    textBtnWhite: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },

    textBtnGray: {
        color: '#4a4e69',
        fontWeight: 'bold',
        fontSize: 16
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
});