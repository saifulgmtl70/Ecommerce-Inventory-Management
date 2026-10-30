import {
    createContext,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";

import app from "../../Firebase/firebase.config";
import useAxiosPublic from "../Hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account",
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleLoginInProgress = useRef(false);

    const axiosPublic = useAxiosPublic();

    // Create User
    const createUser = async (email, password) => {
        setLoading(true);

        try {
            return await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Email/Password Login
    const signIn = async (email, password) => {
        setLoading(true);

        try {
            return await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Google Login
    const signInWithGoogle = async () => {
        if (googleLoginInProgress.current) {
            throw new Error(
                "Google sign-in is already in progress."
            );
        }

        googleLoginInProgress.current = true;

        try {
            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            return result;
        } catch (error) {
            console.error(
                "Firebase Google authentication failed:",
                error.code,
                error.message
            );

            throw error;
        } finally {
            googleLoginInProgress.current = false;
        }
    };

    // Logout
    const logOut = async () => {
        setLoading(true);

        try {
            return await signOut(auth);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Update User Profile
    const updateUserProfile = async (displayName, image) => {
        if (!auth.currentUser) {
            throw new Error("No authenticated user found");
        }

        await updateProfile(auth.currentUser, {
            displayName,
            photoURL: image,
        });

        setUser({ ...auth.currentUser });

        return auth.currentUser;
    };

    // Monitor Firebase Authentication State
    useEffect(() => {
        let active = true;

        const unsubscribe = onAuthStateChanged(
            auth,
            async (currentUser) => {
                if (!active) return;

                setLoading(true);

                try {
                    if (currentUser) {
                        const userInfo = {
                            email: currentUser.email,
                        };

                        const response = await axiosPublic.post(
                            "/jwt",
                            userInfo
                        );

                        if (!active) return;

                        if (response.data?.token) {
                            localStorage.setItem(
                                "access-token",
                                response.data.token
                            );
                        } else {
                            localStorage.removeItem(
                                "access-token"
                            );
                        }
                    } else {
                        localStorage.removeItem(
                            "access-token"
                        );
                    }
                } catch (error) {
                    console.error(
                        "Authentication token error:",
                        error
                    );

                    if (active) {
                        localStorage.removeItem(
                            "access-token"
                        );
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
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;