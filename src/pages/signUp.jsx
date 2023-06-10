import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { useContext, useState } from "react";
import { 
    Image,
    StatusBar,
    StyleSheet,
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    Alert, 
    ActivityIndicator
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";


import axios from "axios";
import * as AuthSession from 'expo-auth-session';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import { CLIENT_ID,  REDIRECT_URI, GOOGLE_INFOS_URL } from '@env';
import { supabase } from "../configs/supaBaseClient";

const googleUserInfos = axios.create({
    baseURL: 'https://www.googleapis.com/oauth2/v1/',
    // baseURL: GOOGLE_INFOS_URL,
});

let CLIENT_ID = '478803378481-a8ioc4cclla3q3bvfb3gkvcjcoplmm1s.apps.googleusercontent.com';
let REDIRECT_URI = 'https://auth.expo.io/@leandro25goncalves/meus-gastos';

export function SignUp({ navigation }) {
    const [loadingSignUp, setLoadingSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [ddd, setDdd] = useState("");
    const [phone, setPhone] = useState("");
    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

    async function handleGoogleSignUp() {
        setLoadingSignUp(true);
        try {
            const SCOPE = encodeURI('profile email');
            const RESPONSE_TYPE = 'token';

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession.startAsync({ authUrl })

            if (type === 'success') {
                await googleUserInfos.get(`userinfo?alt=json&access_token=${params.access_token}`)
                .then(async response => {
                    await supabase
                    .from('user')
                    .insert(
                            [
                              { 
                                name: response?.data?.name, 
                                email: response?.data?.email,
                                id_google: response?.data?.id, 
                                photo_url: response?.data?.picture, 
                              },
                            ]
                    ).then(response => {
                        setLoadingSignUp(false);
                        Alert.alert('Usuário cadastrado com sucesso!');
                        navigation.navigate('Home');                       
                    }).catch(error => {
                        setLoadingSignUp(false);
                        Alert.alert(error.message);                      
                    })
                })
                .catch(err => { throw new Error(err) })               
            }
        } catch (error) {
            setLoadingSignUp(false);
        }
    }

    async function handleSignUpWithSupaBase() {
        if (password !== confirmPassword) {
            setErrorConfirmPassword(true);
        } else {
            setErrorConfirmPassword(false);
        }

        if (password.length < 6) {
            setErrorPassword(true);
        } else {
            setErrorPassword(false);
        }

        if (email.length > 10) {
            setErrorEmail(true);
        } else {
            setErrorEmail(false);
        }

        if (name.length < 3) {
            setErrorName(true);
        } else {
            setErrorName(false);
        }

        if (
            !errorConfirmPassword &&
            !errorPassword &&
            !errorEmail &&
            !errorName
            ) {
                setLoadingSignUp(true);
                try {
                    await supabase
                   .from('user')
                   .insert(
                            [
                              { 
                                name: name, 
                                email: email,
                                phone_number: ddd + phone,
                                id_google: null, 
                                photo_url: null, 
                              },
                            ]
                    ).then(response => {
                        setLoadingSignUp(false);
                        Alert.alert('Usuário cadastrado com sucesso!');
                        navigation.navigate('Home');                       
                    }).catch(error => {
                        setLoadingSignUp(false);
                        Alert.alert(error.message);                      
                    })

                    let { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password,
                    })

                } catch (error) {
                    setLoadingSignUp(false);
                }
            }
    }

    const styles = estilo()
    return (
        <View style={styles.containerLogin}>
            <Image 
                resizeMode="contain"
                style={styles.logo}
                source={require('../../assets/logo.png')}
            />
            <ScrollView>
                <View style={styles.contentForm}>
                    <Text style={styles.title}>Seus dados são somente seus!</Text>
                    <Text style={styles.subtitle}>Faça seu cadastro para garantir a integridade de suas informações</Text>
                    <View style={styles.contentBtnCadSocial}>
                    <TouchableOpacity
                    style={styles.BTNCadGoogle}
                    onPress={() => handleGoogleSignUp()}
                    >
                        <Text style={styles.textWhiteBTN}>continue with</Text>
                        <Image 
                            style={styles.imgLoginSocial}
                            source={require('../../assets/google-logo-name.png')}
                        />
                    </TouchableOpacity>
                </View>
                    <Text style={[styles.subtitle, {marginTop: 20}]}>Ou</Text>
                    <View style={styles.form}>
                        <Text style={styles.labelSimple}>Nome</Text>
                        <TextInput 
                            style={styles.inputSimple}
                            placeholder="Digite seu nome"
                            autoCapitalize="words"
                            autoCorrect={false}
                            value={name}
                            onChangeText={setName}
                        />
                        <Text style={styles.labelSimple}>E-mail</Text>
                        <TextInput 
                            style={styles.inputSimple}
                            placeholder="Digite seu e-mail"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={styles.labelSimple}>Celular</Text>
                        <View style={styles.inputPhoneNumberLine}>
                            <TextInput 
                                style={styles.inputDDD}
                                placeholder="DDD"
                                keyboardType="numeric"
                                value={ddd}
                                onChangeText={setDdd}
                            />
                            <TextInput 
                                style={styles.inputPhoneNumber}
                                placeholder="Digite seu celular"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                        <Text style={styles.labelSimple}>Senha</Text>
                        <View style={styles.inputPassWordBox}>
                            <TextInput 
                                style={styles.inputPassWord}
                                placeholder="Digite sua senha"
                                secureTextEntry={!showPassword}
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={password}
                                onChangeText={setPassword}
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
                        <Text style={styles.labelSimple}>Confirmação de senha</Text>
                        <View style={styles.inputPassWordBox}>
                            <TextInput 
                                style={styles.inputPassWord}
                                placeholder="Digite sua senha"
                                secureTextEntry={!showPasswordConfirm}
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity
                            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            >
                                <MaterialCommunityIcons 
                                name={showPasswordConfirm? 'eye-outline' : 'eye-off-outline'}
                                size={25} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.contentBtnCad}>
                        <TouchableOpacity
                        style={styles.BTNCad}
                        onPress={() => handleSignUpWithSupaBase()}
                        >
                            <Text style={styles.textWhiteBTN}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {loadingSignUp && 
                <ActivityIndicator 
                    style={styles.activityIndicator}
                    animating={loadingSignUp}
                    size="large"
                />}
            </ScrollView>
        </View>
    )
}

const estilo = () => StyleSheet.create({
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
        height: '30%',
    },

    contentForm: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20
    },

    form: {
        width: '80%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0078F6',
        marginBottom: 10
    },

    subtitle: {
        fontSize: 15,
        color: '#6b6b6b',
        marginBottom: 10,
        textAlign: 'center'
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

    inputDDD: {
        width: '15%',
        borderWidth: 1,
        borderColor: '#3b3b3b',
        borderRadius: 5,
        height: 40,
        padding: 3,
        fontSize: 16,
        color: '#6b6b6b',
        marginRight: 10
    },

    inputPhoneNumber: {
        width: '83%',
        borderWidth: 1,
        borderColor: '#3b3b3b',
        borderRadius: 5,
        height: 40,
        padding: 3,
        fontSize: 16,
        color: '#6b6b6b'
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

    labelSimple: {
        fontSize: 18,
        color: '#6b6b6b',
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10
    },

    contentBtnCad: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },

    BTNCad: {
        backgroundColor: '#89fc00',
        width: '40%',
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center'
    },

    inputPhoneNumberLine: {
        flexDirection: 'row',
        width: '100%',
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
        width: '80%',
        height: 50,
        flexDirection: 'row',
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textWhiteBTN: {
        fontWeight: '800',
        fontSize: 15,
        color: '#607744'
    },

    imgLoginSocial: {
        width: 50,
        height: 30,
        marginLeft: 5,
        resizeMode: 'contain'
    },

    activityIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
})