import React, { useState } from 'react';

import {

    StyleSheet,

    View,

    Image,

    Text,

    TextInput,

    TouchableOpacity,

    ScrollView,

    Platform,

    ActivityIndicator,

} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import DateTimePicker from '@react-native-community/datetimepicker';

import { LinearGradient } from 'expo-linear-gradient';

const countries = [

    { id: '1', name: 'USA', code: '+1', flag: 'https://flagcdn.com/w80/us.png' },

    { id: '2', name: 'India', code: '+91', flag: 'https://flagcdn.com/w80/in.png' },

];

export default function SignupScreen({ onRegister }) {

    const [form, setForm] = useState({

        firstName: '',

        lastName: '',

        email: '',

        dob: '',

        mobile: '',

        password: '',

    });

    const [focusedField, setFocusedField] = useState(null);

    const [showPicker, setShowPicker] = useState(false);

    const [date, setDate] = useState(new Date());

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);

    };

    const handleRegister = async () => {

        let newErrors = {};

        let isValid = true;

        // Check required fields

        Object.keys(form).forEach((key) => {

            if (!form[key] || form[key].trim() === '') {

                newErrors[key] = 'Required';

                isValid = false;

            }

        });

        // Validate email format

        if (form.email && !validateEmail(form.email)) {

            newErrors.email = 'Invalid email format';

            isValid = false;

        }

        // Validate password length (minimum 6 characters)

        if (form.password && form.password.length < 6) {

            newErrors.password = 'Password must be at least 6 characters';

            isValid = false;

        }

        // Validate mobile number (should be digits only)

        if (form.mobile && !/^\d+$/.test(form.mobile)) {

            newErrors.mobile = 'Invalid mobile number';

            isValid = false;

        }

        if (!isValid) {

            setErrors(newErrors);

            return;

        }

        setLoading(true);

        setTimeout(() => {

            setLoading(false);

            onRegister({

                userData: form,

                countryCode: selectedCountry.code,

            });

        }, 500);

    };

    const onDateChange = (event, selectedDate) => {

        setShowPicker(false);

        if (selectedDate) {

            setDate(selectedDate);

            const year = selectedDate.getFullYear();

            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');

            const day = String(selectedDate.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            setForm({ ...form, dob: formattedDate });

            setErrors({ ...errors, dob: null });

        }

    };

    const getBorderStyle = (fieldName) => {

        if (errors[fieldName]) return styles.errorBorder;

        if (focusedField === fieldName) return styles.focusedBorder;

        return null;

    };

    return (
<View style={styles.container}>
<LinearGradient

                colors={['#000048', '#000048', '#4747AE']}

                locations={[0.4117, 0.6946, 1.0]}

                start={{ x: 0, y: 1 }}

                end={{ x: 1, y: 0 }}

                style={styles.headerArea}
>
<Image

                    source={require('../../assets/logo1.png')}

                    style={styles.logo1}

                    resizeMode="contain"

                />
<View style={styles.headerTextContainer}>
<Text style={styles.headerTitle}>Register</Text>
<Text style={styles.headerSubtitle}>

                        Create an account to continue!
</Text>
</View>
</LinearGradient>
<View style={styles.formSheet}>
<ScrollView

                    showsVerticalScrollIndicator={false}

                    contentContainerStyle={styles.scrollContent}

                    keyboardShouldPersistTaps="handled"
>

                    {/* First Name & Last Name Row */}
<View style={styles.row}>
<View style={styles.halfInputContainer}>
<Text style={styles.label}>First Name</Text>
<View style={[styles.inputWrapper, getBorderStyle('firstName')]}>
<TextInput

                                    style={styles.input}

                                    onFocus={() => {

                                        setFocusedField('firstName');

                                        setErrors({ ...errors, firstName: null });

                                    }}

                                    onBlur={() => setFocusedField(null)}

                                    onChangeText={(text) =>

                                        setForm({ ...form, firstName: text })

                                    }

                                />
</View>

                            {errors.firstName && (
<Text style={styles.errorText}>{errors.firstName}</Text>

                            )}
</View>
<View style={styles.halfInputContainer}>
<Text style={styles.label}>Last Name</Text>
<View style={[styles.inputWrapper, getBorderStyle('lastName')]}>
<TextInput

                                    style={styles.input}

                                    onFocus={() => {

                                        setFocusedField('lastName');

                                        setErrors({ ...errors, lastName: null });

                                    }}

                                    onBlur={() => setFocusedField(null)}

                                    onChangeText={(text) =>

                                        setForm({ ...form, lastName: text })

                                    }

                                />
</View>

                            {errors.lastName && (
<Text style={styles.errorText}>{errors.lastName}</Text>

                            )}
</View>
</View>

                    {/* Email Field */}
<View style={styles.fieldGap}>
<Text style={styles.label}>Email</Text>
<View style={[styles.inputWrapper, getBorderStyle('email')]}>
<TextInput

                                style={styles.input}

                                onFocus={() => {

                                    setFocusedField('email');

                                    setErrors({ ...errors, email: null });

                                }}

                                onBlur={() => setFocusedField(null)}

                                onChangeText={(text) => setForm({ ...form, email: text })}

                                keyboardType="email-address"

                                autoCapitalize="none"

                            />
</View>

                        {errors.email && (
<Text style={styles.errorText}>{errors.email}</Text>

                        )}
</View>

                    {/* Date of Birth Field */}
<View style={styles.fieldGap}>
<Text style={styles.label}>Date of Birth</Text>
<View

                            style={[

                                styles.inputWrapper,

                                styles.rowBetween,

                                getBorderStyle('dob'),

                            ]}
>
<TextInput

                                style={styles.input}

                                placeholder="YYYY-MM-DD"

                                value={form.dob}

                                editable={true}

                                onChangeText={(text) => {

                                    setForm({ ...form, dob: text });

                                    setErrors({ ...errors, dob: null });

                                }}

                                onFocus={() => setFocusedField('dob')}

                                onBlur={() => setFocusedField(null)}

                            />
<TouchableOpacity onPress={() => setShowPicker(true)}>
<Ionicons

                                    name="calendar-outline"

                                    size={16}

                                    color="#000048"

                                />
</TouchableOpacity>
</View>

                        {errors.dob && (
<Text style={styles.errorText}>{errors.dob}</Text>

                        )}
</View>

                    {/* Mobile Number Field */}
<View style={[styles.fieldGap, { zIndex: 1000 }]}>
<Text style={styles.label}>Mobile Number</Text>
<View>
<View

                                style={[

                                    styles.inputWrapper,

                                    styles.rowAlignCenter,

                                    getBorderStyle('mobile'),

                                ]}
>
<TouchableOpacity

                                    style={styles.countrySelector}

                                    onPress={() => setIsDropdownVisible(!isDropdownVisible)}
>
<Image

                                        source={{ uri: selectedCountry.flag }}

                                        style={styles.flagCircle}

                                    />
<Ionicons

                                        name="chevron-down"

                                        size={12}

                                        color="#000048"

                                        style={{ marginLeft: 5 }}

                                    />
</TouchableOpacity>
<TextInput

                                    style={[styles.input, { flex: 1, paddingLeft: 10 }]}

                                    placeholder={selectedCountry.code}

                                    keyboardType="phone-pad"

                                    onFocus={() => {

                                        setFocusedField('mobile');

                                        setErrors({ ...errors, mobile: null });

                                    }}

                                    onBlur={() => setFocusedField(null)}

                                    onChangeText={(text) =>

                                        setForm({ ...form, mobile: text })

                                    }

                                />
</View>

                            {isDropdownVisible && (
<View style={styles.inlineDropdown}>

                                    {countries.map((item) => (
<TouchableOpacity

                                            key={item.id}

                                            style={styles.countryOption}

                                            onPress={() => {

                                                setSelectedCountry(item);

                                                setIsDropdownVisible(false);

                                            }}
>
<Image

                                                source={{ uri: item.flag }}

                                                style={styles.flagCircle}

                                            />
<Text style={styles.countryText}>

                                                {item.name} ({item.code})
</Text>
</TouchableOpacity>

                                    ))}
</View>

                            )}
</View>

                        {errors.mobile && (
<Text style={styles.errorText}>{errors.mobile}</Text>

                        )}
</View>

                    {/* Password Field */}
<View style={[styles.passwordGap, { zIndex: 1 }]}>
<Text style={styles.label}>Set Password</Text>
<View

                            style={[

                                styles.inputWrapper,

                                styles.rowBetween,

                                getBorderStyle('password'),

                            ]}
>
<TextInput

                                style={styles.input}

                                secureTextEntry={!isPasswordVisible}

                                onFocus={() => {

                                    setFocusedField('password');

                                    setErrors({ ...errors, password: null });

                                }}

                                onBlur={() => setFocusedField(null)}

                                onChangeText={(text) =>

                                    setForm({ ...form, password: text })

                                }

                            />
<TouchableOpacity

                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
>
<Ionicons

                                    name={

                                        isPasswordVisible ? 'eye-outline' : 'eye-off-outline'

                                    }

                                    size={18}

                                    color="#848484"

                                />
</TouchableOpacity>
</View>

                        {errors.password && (
<Text style={styles.errorText}>{errors.password}</Text>

                        )}
</View>

                    {/* Register Button */}
<TouchableOpacity

                        style={styles.registerButton}

                        onPress={handleRegister}

                        disabled={loading}
>

                        {loading ? (
<ActivityIndicator color="#FFFFFF" />

                        ) : (
<Text style={styles.registerButtonText}>Register</Text>

                        )}
</TouchableOpacity>
</ScrollView>
</View>

            {showPicker && (
<DateTimePicker

                    value={date}

                    mode="date"

                    display="default"

                    onChange={onDateChange}

                />

            )}
</View>

    );

}

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: '#000048',

    },

    headerArea: {

        height: 271,

        width: '100%',

        position: 'relative',

    },

    logo1: {

        width: 154,

        height: 103,

        position: 'absolute',

        top: 47,

        left: -20,

        zIndex: 10,

    },

    headerTextContainer: {

        position: 'absolute',

        top: 155,

        left: 25,

    },

    headerTitle: {

        fontSize: 32,

        fontWeight: '700',

        color: '#FFFFFF',

    },

    headerSubtitle: {

        fontSize: 12,

        fontWeight: '500',

        color: '#FFFFFF',

        marginTop: 5,

    },

    formSheet: {

        flex: 1,

        backgroundColor: '#FFFFFF',

        borderTopLeftRadius: 24,

        borderTopRightRadius: 24,

        overflow: 'visible',

    },

    scrollContent: {

        paddingTop: 24,

        paddingHorizontal: 16,

        paddingBottom: 60,

    },

    row: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        marginBottom: 16,

    },

    halfInputContainer: {

        width: '48%',

    },

    fieldGap: {

        marginBottom: 16,

    },

    passwordGap: {

        marginBottom: 36,

    },

    label: {

        fontSize: 14,

        color: '#848484',

        marginBottom: 8,

    },

    inputWrapper: {

        height: 46,

        borderRadius: 10,

        borderWidth: 1,

        borderColor: '#EDF1F3',

        backgroundColor: '#FFFFFF',

        paddingHorizontal: 14,

        flexDirection: 'row',

        alignItems: 'center',

    },

    focusedBorder: {

        borderColor: '#000048',

        borderWidth: 1.5,

    },

    errorBorder: {

        borderColor: '#FF0000',

        borderWidth: 1.5,

    },

    errorText: {

        color: '#FF0000',

        fontSize: 10,

        marginTop: 4,

        marginLeft: 2,

    },

    input: {

        fontSize: 16,

        color: '#000048',

        height: '100%',

        flex: 1,

        ...Platform.select({

            web: { outlineStyle: 'none' },

        }),

    },

    rowAlignCenter: {

        flexDirection: 'row',

        alignItems: 'center',

    },

    rowBetween: {

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'space-between',

    },

    countrySelector: {

        flexDirection: 'row',

        alignItems: 'center',

        borderRightWidth: 1,

        borderColor: '#EDF1F3',

        paddingRight: 10,

        height: '100%',

    },

    flagCircle: {

        width: 22,

        height: 22,

        borderRadius: 11,

        overflow: 'hidden',

    },

    registerButton: {

        width: '100%',

        height: 52,

        borderRadius: 10,

        backgroundColor: '#000048',

        justifyContent: 'center',

        alignItems: 'center',

    },

    registerButtonText: {

        color: '#FFFFFF',

        fontSize: 20,

        fontWeight: '500',

    },

    inlineDropdown: {

        position: 'absolute',

        top: 50,

        left: 0,

        width: 180,

        backgroundColor: '#FFFFFF',

        borderRadius: 8,

        borderWidth: 1,

        borderColor: '#EDF1F3',

        zIndex: 9999,

        elevation: 10,

        shadowColor: '#000',

        shadowOffset: { width: 0, height: 5 },

        shadowOpacity: 0.2,

        shadowRadius: 5,

    },

    countryOption: {

        flexDirection: 'row',

        alignItems: 'center',

        padding: 12,

        borderBottomWidth: 1,

        borderBottomColor: '#F5F5F5',

        backgroundColor: '#FFFFFF',

    },

    countryText: {

        marginLeft: 10,

        fontSize: 14,

        color: '#000048',

    },

});
 