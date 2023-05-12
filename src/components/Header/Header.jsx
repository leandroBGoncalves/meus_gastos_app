import { 
    Image, 
    StatusBar, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View 
} from "react-native";

export function Header() {
    const styles = estilo(StatusBar.currentHeight)
    return (
        <View 
        style={styles.containerHeader}
        >
            <Image 
            style={styles.avatar}
            source={require('../../../assets/avatar.jpeg')}
            />
            <TouchableOpacity>
                <Text style={styles.textNameAvatar}>Leandro Gonçalves</Text>
            </TouchableOpacity>
        </View>
    )
}

const estilo = (statusBarHeight) => StyleSheet.create({
    containerHeader: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: statusBarHeight + 5,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: -2,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    
    textNameAvatar: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#38b000'
    }
})