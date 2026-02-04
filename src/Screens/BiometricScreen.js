import React, { useState } from 'react';

import {

    StyleSheet,

    View,

    Text,

    TouchableOpacity,

    ActivityIndicator,

} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import { performBiometricAuth, registerUser } from '../api/api';

export default function BiometricScreen({ userData, onEnable }) {

    const [loading, setLoading] = useState(false);

    const handleBiometricAuth = async () => {
   console.log('=== ENABLE BUTTON CLICKED ===');
   setLoading(true);
   try {
       const firstName = userData.userData.firstName;  // Changed
       const email = userData.userData.email;
       const authResult = await performBiometricAuth(firstName, email);

            console.log('=== AUTH RESULT ===', authResult);

            if (authResult.success) {

                console.log('=== AUTH SUCCESS, CALLING BACKEND ===');

                const userDataForApi = {

                    firstName: userData.userData.firstName,

                    lastName: userData.userData.lastName,

                    email: userData.userData.email,

                    dob: userData.userData.dob,

                    password: userData.userData.password,

                    phone: userData.countryCode + userData.userData.mobile,

                };

                const backendResult = await registerUser(

                    userDataForApi,

                    authResult.credentialId,

                    authResult.publicKey

                );

                console.log('=== BACKEND RESULT ===', backendResult);

                setLoading(false);

                if (backendResult.success) {

                    console.log('=== NAVIGATING TO SUCCESS SCREEN ===');

                    if (onEnable) {

                       onEnable(backendResult.data);

                    } else {

                        console.error('=== onEnable IS NOT DEFINED ===');

                    }

                } else {

                    console.error('=== REGISTRATION FAILED ===', backendResult.error);

                }

            } else {

                setLoading(false);

                console.error('=== AUTH FAILED ===', authResult.error);

            }

        } catch (error) {

            setLoading(false);

            console.error('=== UNEXPECTED ERROR ===', error);

        }

    };

    return (
<View style={styles.container}>
<LinearGradient

                colors={['#000048', '#000048', '#4747AE']}

                locations={[0.4117, 0.6946, 1.0]}

                start={{ x: 0, y: 1 }}

                end={{ x: 1, y: 0 }}

                style={styles.headerArea}

            />
<View style={styles.contentSheet}>
<View style={styles.innerContainer}>
<View style={styles.iconContainer}>
<Ionicons

                            name="finger-print-outline"

                            size={100}

                            color="#000048"

                        />
</View>
<Text style={styles.title}>

                        Enable Fingerprint authentication
</Text>
<Text style={styles.subtitle}>

                        Secure your access with fingerprint for a smooth login experience
</Text>
<TouchableOpacity

                        style={styles.enableButton}

                        onPress={handleBiometricAuth}

                        disabled={loading}
>

                        {loading ? (
<ActivityIndicator color="#FFFFFF" />

                        ) : (
<Text style={styles.buttonText}>Enable</Text>

                        )}
</TouchableOpacity>
</View>
</View>
</View>

    );

}

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: '#000048',

    },

    headerArea: {

        height: 120,

        width: '100%',

    },

    contentSheet: {

        flex: 1,

        backgroundColor: '#FFFFFF',

        borderTopLeftRadius: 30,

        borderTopRightRadius: 30,

        paddingHorizontal: 30,

    },

    innerContainer: {

        flex: 1,

        alignItems: 'center',

        justifyContent: 'center',

        marginTop: -50,

    },

    iconContainer: {

        marginBottom: 40,

    },

    title: {

        fontSize: 24,

        fontWeight: '700',

        color: '#000048',

        textAlign: 'center',

        marginBottom: 15,

    },

    subtitle: {

        fontSize: 14,

        color: '#848484',

        textAlign: 'center',

        lineHeight: 22,

        paddingHorizontal: 20,

        marginBottom: 50,

    },

    enableButton: {

        backgroundColor: '#000048',

        width: '100%',

        height: 55,

        borderRadius: 12,

        justifyContent: 'center',

        alignItems: 'center',

        shadowColor: '#000',

        shadowOffset: { width: 0, height: 4 },

        shadowOpacity: 0.3,

        shadowRadius: 4.65,

        elevation: 8,

    },

    buttonText: {

        color: '#FFFFFF',

        fontSize: 18,

        fontWeight: '600',

    },

});
 