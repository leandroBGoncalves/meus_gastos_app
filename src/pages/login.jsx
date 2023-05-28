import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { useContext, useState } from "react";
import { 
    Image, 
    StyleSheet, 
    Text, 
    View, 
    StatusBar, 
    TextInput, 
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";

import axios from "axios";
import * as AuthSession from 'expo-auth-session';

import { CLIENT_ID,  REDIRECT_URI, GOOGLE_INFOS_URL } from '@env';
import { supabase } from '../configs/supaBaseClient';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const googleUserInfos = axios.create({
    baseURL: GOOGLE_INFOS_URL,
});


export function Login({ navigation }) {
    const [showPassword, setShowPassword] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);

    async function handleGoogleSignIn() {
        setLoadingLogin(true);
        try {
            const SCOPE = encodeURI('profile email');
            const RESPONSE_TYPE = 'token';

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession.startAsync({ authUrl })

            if (type === 'success') {
                await googleUserInfos.get(`userinfo?alt=json&access_token=${params.access_token}`)
                .then(async response => {
                    checkUserDB(response?.data?.id);
                })
                .catch(err => { throw new Error(err) })               
            }
        } catch (error) {
            console.log(error)
            setLoadingLogin(false);
            Alert.alert(`Erro ao buscar dados do google\n${error}`);
        }
    }

    async function checkUserDB(id_google) {
        let { data: user, error } = await supabase
        .from('user')
        .select("*")
        .eq('id_google', id_google)
        console.log('user', user)
        console.log('error', error)
        if (error) {
            console.log('errorVerifyUser', error);
            setLoadingLogin(false);
            Alert.alert('Cadastro não localizado \n Faça seu cadastro!');
        } else if (user.length === 0) {
            setLoadingLogin(false);
            Alert.alert('Cadastro não localizado\nFaça seu cadastro!');
        } else {
            setLoadingLogin(false);
            console.log('sucessVerifyUser', user)
            await AsyncStorage.setItem('data_user', JSON.stringify(user[0]));
            navigation.navigate('Home');
        }
    }

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
                    {loadingLogin && 
                    <ActivityIndicator
                        style={styles.activityIndicator} 
                        size="large"
                        animating={loadingLogin}
                    />}
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