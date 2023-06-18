import { useContext } from "react";
import { 
    StyleSheet, 
    Text, 
    View 
} from "react-native";
import { Dialog } from "react-native-paper";
import { AuthContext } from "../../context/contextProvider";

export function EditTransaction({
    openEdit, 
    handleClose
}) {
    const {
        transactionsByIdTransactions
    } = useContext(AuthContext);

    console.log('transactionEdit', transactionsByIdTransactions);
    const styles = estilo()
    return (
        <Dialog
            visible={openEdit} 
            onDismiss={handleClose}
            style={styles.modalInnerData}
        >
            <View>
                <Text>{transactionsByIdTransactions[0].description}</Text>
            </View>
        </Dialog>
    )
}

const estilo = () => StyleSheet.create({
    modalInnerData: {
        padding: 10,
        borderRadius: 5,
        bottom: '10%',
        maxHeight: '50%',
    },
});