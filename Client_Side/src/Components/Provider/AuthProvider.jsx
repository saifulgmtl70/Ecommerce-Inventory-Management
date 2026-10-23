import { createContext, useEffect, useState } from 'react';

import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";

import app from '../../Firebase/firebase.config';
import useAxiosPublic from '../Hooks/useAxiosPublic';

const googleProvider = new GoogleAuthProvider();

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const axiosPublic = useAxiosPublic();


    // Create User
    const createUser = (email, password) => {
        setLoading(true);

        return createUserWithEmailAndPassword(
            auth,
            email,
            password
        ).catch(error => {
            setLoading(false);
            throw error;
        });
    };


    // Sign In
    const signIn = (email, password) => {
        setLoading(true);

        return signInWithEmailAndPassword(
            auth,
            email,
            password
        ).catch(error => {
            setLoading(false);
            throw error;
        });
    };


    // Google Sign In
    const signInWithGoogle = () => {
        setLoading(true);

        return signInWithPopup(
            auth,
            googleProvider
        ).catch(error => {
            setLoading(false);
            throw error;
        });
    };


    // Logout
    const logOut = () => {
        setLoading(true);

        return signOut(auth).catch(error => {
            setLoading(false);
            throw error;
        });
    };


    // Update User Profile
    const updateUserProfile = async (displayName, image) => {

        if (!auth.currentUser) {
            throw new Error("No authenticated user found");
        }

        await updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: image
        });

        // Update React user state
        setUser({ ...auth.currentUser });

        return auth.currentUser;
    };


    // Monitor Authentication State
    useEffect(() => {

        let active = true;

        const unsubscribe = onAuthStateChanged(
            auth,
            async (currentUser) => {

                console.log("Current User:", currentUser);

                if (active) {
                    setLoading(true);
                }

                try {

                    if (currentUser) {

                        // Generate JWT
                        const userInfo = {
                            email: currentUser.email
                        };

                        const response = await axiosPublic.post(
                            '/jwt',
                            userInfo
                        );

                        if (!active) return;

                        if (response.data.token) {

                            localStorage.setItem(
                                'access-token',
                                response.data.token
                            );

                        } else {
                            localStorage.removeItem('access-token');
                        }

                    } else {

                        localStorage.removeItem('access-token');

                    }

                } catch (error) {

                    console.error(
                        "Authentication token error:",
                        error
                    );

                    if (active) {
                        localStorage.removeItem('access-token');
                    }

                } finally {

                    if (active) {
                        setUser(currentUser);
                        setLoading(false);
                    }

                }

            }
        );

        return () => {
            active = false;
            unsubscribe();
        };

    }, [axiosPublic]);


    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        logOut,
        updateUserProfile
    };


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;