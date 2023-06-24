import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import { createContext, useState } from "react";
import { Alert } from "react-native";

// import { CLIENT_ID,  REDIRECT_URI, GOOGLE_INFOS_URL } from '@env';

import axios from "axios";
import * as AuthSession from 'expo-auth-session';

import { supabase } from "../configs/supaBaseClient";

export const AuthContext = createContext({});

const googleUserInfos = axios.create({
    baseURL: 'https://www.googleapis.com/oauth2/v1/',
    // baseURL: GOOGLE_INFOS_URL,
});

let CLIENT_ID = '478803378481-a8ioc4cclla3q3bvfb3gkvcjcoplmm1s.apps.googleusercontent.com';
let REDIRECT_URI = 'https://auth.expo.io/@leandro25goncalves/meus-gastos';
export function ContextProvider({ children }) {
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [transactionsByUser, setTransactionsByUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [transactionsByIdTransactions, setTransactionsByIdTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    function handleEditing(id) {
        setIsEditing(true);
        getTransactionsByIdTransaction(id)
    }

    function handleEditingCancel() {
        setIsEditing(false);
    }

    async function handleGoogleSignIn(feature) {
        setLoadingLogin(true);
        try {
            const SCOPE = encodeURI('profile email');
            const RESPONSE_TYPE = 'token';

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession.startAsync({ authUrl })

            if (type === 'success') {
                await googleUserInfos.get(`userinfo?alt=json&access_token=${params.access_token}`)
                .then(response => {
                    if (feature === 'signUp') {
                        
                    }
                    setIsAuthenticate(true);
                })
                .catch(err => { throw new Error(err) })               
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function insertTransaction(transaction) {
        try {
            const { data, error } = await supabase
            .from('transactions')
            .insert([
                { 
                    description: transaction.description,
                    amount: transaction.amount,
                    due_dates: transaction.due_dates,
                    user_id: transaction.user_id,
                    installments: transaction.installments,
                    category: transaction.category 
                }
            ])
            if (error) {
                console.log('errorInsertData', error)
                throw new Error(error)
            }
            if (data) {
                Alert.alert('Sucess', 'Transaction inserted successfully')
            }
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }

    async function getTransactions(userId) {
        try {
            let { data: transactions, error } = await supabase
            .from('transactions')
            .select("*")
            .eq('user_id', Number(userId))
            if (error) {
                console.log('errorGetTransactions', error)
                throw new Error(error)
            }
            if (transactions) {
                setTransactionsByUser(transactions);
            }
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }

    async function getTransactionsByIdTransaction(transactionId) {
        setLoadingTransactions(true);
        try {
            let { data: transactions, error } = await supabase
            .from('transactions')
            .select("*")
            .eq('id', transactionId)
            if (error) {
                console.log('errorGetTransactions', error)
                throw new Error(error)
            }
            if (transactions) {
                setLoadingTransactions(false);
                setTransactionsByIdTransactions(transactions);
            }
        } catch (err) {
            setLoadingTransactions(false);
            Alert.alert('Error', err.message)
        }
    }

    async function deleteTransaction(transactionId) {
        setLoadingTransactions(true);
        try {
            let { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId)
            if (error) {
                console.log('errorGetTransactions', error)
                throw new Error(error)
            }
            if (!error) {
                Alert.alert('Sucesso', 'Transação deletada com successo!')
                setLoadingTransactions(false);
                setIsEditing(false);
            }
        } catch (err) {
            setLoadingTransactions(false);
            setIsEditing(false);
            Alert.alert('Error', err.message)
        }
    }

    return (
        <AuthContext.Provider value={{ 
            handleGoogleSignIn,
            isAuthenticate,
            setLoadingLogin,
            loadingLogin,
            insertTransaction,
            getTransactions,
            transactionsByUser,
            handleEditing,
            handleEditingCancel,
            isEditing,
            transactionsByIdTransactions,
            loadingTransactions,
            deleteTransaction
        }} >
            {children}
        </AuthContext.Provider>
    )
}