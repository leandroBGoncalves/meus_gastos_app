import { useContext, useState } from "react";
import { 
    Image, 
    StyleSheet, 
    Text, 
    View, 
    StatusBar, 
    TextInput, 
    TouchableOpacity
} from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from "../context/contextProvider";

export function Login({ navigation }) {
    const { 
        handleGoogleSignIn
    } = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View
        style={styles.containerLogin}
        >
            <Image 
            resizeMode="contain"
            style={styles.logo}
            source={require('../../assets/logo.png')}
            />
            <View>
                <View>
                    <Text style={styles.labelSimple}>User Name</Text>
                    <TextInput 
                    style={styles.inputSimple}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    <Text style={styles.labelSimple}>PassWord</Text>
                    <View style={styles.inputPassWordBox}>
                        <TextInput 
                        style={styles.inputPassWord}
                        secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        >
                            <MaterialCommunityIcons 
                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={25} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.contentBtnLogin}>
                    <TouchableOpacity
                    style={styles.BTNLogin}
                    >
                        <Text style={styles.textWhiteBTN}>Entrar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentBtnCad}>
                    <TouchableOpacity
                    style={styles.BTNCad}
                    onPress={() => navigation.navigate('SignUp')}
                    >
                        <Text style={styles.textWhiteBTN}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentBtnCadSocial}>
                    <TouchableOpacity
                    style={styles.BTNCadGoogle}
                    onPress={() => handleGoogleSignIn()}
                    >
                        <Text style={styles.textWhiteBTN}>enter with</Text>
                        <Image 
                            style={styles.imgLoginSocial}
                            source={require('../../assets/google-logo-name.png')}
                        />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={styles.BTNCadFacebook}
                    >
                        <Text style={styles.textWhiteBTN}>enter with </Text>
                        <Image 
                            style={styles.imgLoginSocial}
                            source={require('../../assets/Facebook-Logo.png')}
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerLogin: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#FFFFFF', 
        paddingTop: StatusBar.currentHeight + 5,
        paddingLeft: 20,
        paddingRight: 20
    },

    logo: {
        width: '80%',
        height: '40%',
    },

    labelSimple: {
        fontSize: 18,
        color: '#6b6b6b',
        fontWeight: 'bold',
        marginBottom: 5
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

    inputPassWord: {
        width: '90%',
        height: 40,
        padding: 3,
        fontSize: 16,
        color: '#6b6b6b',
    },

    inputPassWordBox: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#3b3b3b',
        borderRadius: 5,
        height: 40,
        padding: 3,
    },

    contentBtnLogin: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },

    BTNLogin: {
        backgroundColor: '#89fc00',
        width: '40%',
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center'
    },

    textWhiteBTN: {
        fontWeight: '800',
        fontSize: 15,
        color: '#607744'
    },

    contentBtnCad: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },

    BTNCad: {
        backgroundColor: '#FFFFFF',
        borderColor: '#89fc00',
        borderWidth: 2,
        width: '40%',
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center'
    },

    contentBtnCadSocial: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20
    },

    BTNCadGoogle: {
        backgroundColor: '#FFFFFF',
        borderColor: '#EB4335',
        borderWidth: 2,
        width: '45%',
        height: 50,
        flexDirection: 'row',
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    BTNCadFacebook: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0078F6',
        borderWidth: 2,
        width: '45%',
        height: 50,
        flexDirection: 'row',
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    imgLoginSocial: {
        width: 50,
        height: 30,
        marginLeft: 5,
        resizeMode: 'contain'
    }
})