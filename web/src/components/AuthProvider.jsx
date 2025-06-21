import React, { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    
    // Check for existing session cookie on component mount
    useEffect(() => {
        const userToken = Cookies.get('userToken')
        const username = Cookies.get('username')
        
        if (userToken && username) {
            setUser({
                username,
                token: userToken
            })
        }
    }, [])
    
    const login = (username, token) => {

        // Store user data in session cookies (expires when browser is closed)
        Cookies.set('username', username, { sameSite: 'strict' })
        Cookies.set('userToken', token, { sameSite: 'strict' })
        
        const userData = { 
            username,
            token,
        }
        setUser(userData)
    }

    const loginAsGuest = () => {
        // Remove any existing auth cookies
        Cookies.remove('username')
        Cookies.remove('userToken')
        Cookies.remove('userId')
        
        setUser({ username: 'Guest', id: 'guest-' + Date.now() })
    }

    const logout = () => {
        // Remove auth cookies
        Cookies.remove('username')
        Cookies.remove('userToken')
        Cookies.remove('userId')
        
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, loginAsGuest, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
