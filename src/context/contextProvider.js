import { createContext, useState } from "react";
import axios from "axios";
import * as AuthSession from 'expo-auth-session';
import { CLIENT_ID,  REDIRECT_URI, GOOGLE_INFOS_URL } from '@env';

export const AuthContext = createContext({});

const googleUserInfos = axios.create({
    baseURL: GOOGLE_INFOS_URL,
});

export function ContextProvider({ children }) {
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);

    async function handleGoogleSignIn(feature) {
        console.log('feature', feature)
        setLoadingLogin(true);
        try {
            const SCOPE = encodeURI('profile email');
            const RESPONSE_TYPE = 'token';

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession.startAsync({ authUrl })

            if (type === 'success') {
                await googleUserInfos.get(`userinfo?alt=json&access_token=${params.access_token}`)
                .then(response => {
                    console.log('respUserInfos', response)
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
    return (
        <AuthContext.Provider value={{ 
            handleGoogleSignIn,
            isAuthenticate,
            setLoadingLogin,
            loadingLogin
        }} >
            {children}
        </AuthContext.Provider>
    )
}