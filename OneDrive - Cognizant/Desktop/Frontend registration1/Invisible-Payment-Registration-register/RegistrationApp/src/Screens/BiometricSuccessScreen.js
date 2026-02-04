import React, { useState } from 'react';

import {

    StyleSheet,

    View,

    Text,

    SafeAreaView,

    TouchableOpacity,

    ActivityIndicator,

} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import { performBiometricLogin } from '../api/api';

export default function BiometricSuccessScreen({ onAuthenticate }) {

    const [loading, setLoading] = useState(false);

    const handleFingerprintPress = async () => {

        setLoading(true);

        try {

            const authResult = await performBiometricLogin();

            setLoading(false);

            if (authResult.success) {

                if (onAuthenticate) {

                    onAuthenticate();

                }

            } else {

                console.error('Authentication failed:', authResult.error);

            }

        } catch (error) {

            setLoading(false);

            console.error('Auth error:', error);

        }

    };

    return (
<View style={styles.container}>
<LinearGradient

                colors={['#000048', '#2E2E8A']}

                start={{ x: 0, y: 0 }}

                end={{ x: 1, y: 0 }}

                style={styles.header}
>
<SafeAreaView />
</LinearGradient>
<View style={styles.contentSheet}>
<View style={styles.successGroup}>
<View style={styles.checkCircle}>
<Ionicons name="checkmark" size={40} color="#FFFFFF" />
</View>
<View style={styles.textGroup}>
<Text style={styles.titleText}>

                            Successfully enabled fingerprint authentication
</Text>
<Text style={styles.subtitleText}>

                            Fingerprint setup complete. You're all set to sign in

                            with a single touch.
</Text>
</View>
</View>
<TouchableOpacity

                    style={styles.sensorGroup}

                    onPress={handleFingerprintPress}

                    disabled={loading}
>

                    {loading ? (
<ActivityIndicator size="large" color="#000048" />

                    ) : (
<Ionicons name="finger-print" size={90} color="#000048" />

                    )}
<Text style={styles.instructionText}>

                        {loading ? 'Authenticating...' : 'Touch the fingerprint sensor'}
</Text>
</TouchableOpacity>
</View>
</View>

    );

}

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: '#000048',

    },

    header: {

        width: '100%',

        height: 76,

    },

    contentSheet: {

        flex: 1,

        backgroundColor: '#FFFFFF',

        borderTopLeftRadius: 24,

        borderTopRightRadius: 24,

        paddingTop: 80,

        paddingHorizontal: 16,

        paddingBottom: 30,

        alignItems: 'center',

        justifyContent: 'space-between',

    },

    successGroup: {

        alignItems: 'center',

        gap: 30,

    },

    checkCircle: {

        width: 80,

        height: 80,

        borderRadius: 40,

        backgroundColor: '#000048',

        justifyContent: 'center',

        alignItems: 'center',

    },

    textGroup: {

        alignItems: 'center',

        gap: 16,

        paddingHorizontal: 16,

    },

    titleText: {

        fontWeight: '500',

        fontSize: 24,

        lineHeight: 34,

        letterSpacing: -0.72,

        textAlign: 'center',

        color: '#000048',

    },

    subtitleText: {

        fontWeight: '400',

        fontSize: 14,

        lineHeight: 20,

        textAlign: 'center',

        color: '#848484',

    },

    sensorGroup: {

        alignItems: 'center',

        gap: 4,

        marginBottom: 40,

    },

    instructionText: {

        fontWeight: '400',

        fontSize: 12,

        lineHeight: 17,

        letterSpacing: -0.36,

        textAlign: 'center',

        color: '#848484',

        marginTop: 8,

    },

});
 