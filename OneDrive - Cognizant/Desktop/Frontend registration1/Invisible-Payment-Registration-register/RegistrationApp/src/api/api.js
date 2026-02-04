/**
 * Centralized API layer for SmartPay React Native App
 * User Registration API + Wallet APIs + Biometric Login
 */

import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

// ====================================================================================
// Configuration
// ====================================================================================

// ✅ IMPORTANT:
// Android Emulator: 10.0.2.2 points to your PC localhost
// iOS Simulator/Web: localhost works
// Physical Device: replace with your PC IP (e.g., 192.168.x.x)
const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api';

// ✅ IMPORTANT: HomeScreen already uses API_BASE, so we export it
export const API_BASE = `${API_BASE_URL}/wallet`;

// ====================================================================================
// Helper Functions
// ====================================================================================

export const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const generateCredentialId = () => {
  const array = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return btoa(String.fromCharCode.apply(null, array));
};

export const generatePublicKey = () => {
  const dummyKey = new Uint8Array(65);
  dummyKey[0] = 0x04;
  for (let i = 1; i < 65; i++) {
    dummyKey[i] = Math.floor(Math.random() * 256);
  }
  return btoa(String.fromCharCode.apply(null, dummyKey));
};

export const getDeviceType = () => {
  if (Platform.OS === 'ios') return 'Touch ID';
  if (Platform.OS === 'android') return 'Android Fingerprint';
  return 'Windows Hello';
};

// ====================================================================================
// WebAuthn Authentication (Web/PC) - Registration
// ====================================================================================

export const performWebAuthnRegistration = async (firstName, email) => {
  try {
    console.log('=== STARTING WEBAUTHN ===');

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'SmartPay',
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: firstName,
        displayName: firstName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },
        { alg: -257, type: 'public-key' },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'none',
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    console.log('=== CREDENTIAL RECEIVED ===', credential);

    if (credential) {
      const credentialId = arrayBufferToBase64(credential.rawId);

      let publicKey = '';
      if (credential.response.getPublicKey) {
        const pubKeyBuffer = credential.response.getPublicKey();
        if (pubKeyBuffer) {
          publicKey = arrayBufferToBase64(pubKeyBuffer);
        }
      }

      if (!publicKey) {
        publicKey = arrayBufferToBase64(credential.response.attestationObject);
      }

      console.log('=== CREDENTIAL ID ===', credentialId);
      console.log('=== PUBLIC KEY ===', publicKey);

      return { success: true, credentialId, publicKey };
    }

    return { success: false, error: 'No credential created' };
  } catch (error) {
    console.error('=== WEBAUTHN ERROR ===', error);
    return { success: false, error: error.message || 'WebAuthn failed' };
  }
};

// ====================================================================================
// Mobile Biometric Authentication
// ====================================================================================

export const performMobileAuthentication = async () => {
  try {
    const authResult = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verify your identity',
      fallbackLabel: 'Use Passkey',
      disableDeviceFallback: false,
      cancelLabel: 'Cancel',
    });

    if (authResult.success) {
      return {
        success: true,
        credentialId: generateCredentialId(),
        publicKey: generatePublicKey(),
      };
    }

    return { success: false, error: 'Authentication failed' };
  } catch (error) {
    console.error('Mobile Auth Error:', error);
    return { success: false, error: error.message };
  }
};

// ====================================================================================
// Unified Biometric Authentication (Registration/Auth)
// ====================================================================================

export const performBiometricAuth = async (email, displayName) => {
  console.log('=== PLATFORM ===', Platform.OS);

  if (Platform.OS === 'web') {
    if (window.PublicKeyCredential) {
      return await performWebAuthnRegistration(email, displayName);
    }
    return { success: false, error: 'WebAuthn is not supported in this browser' };
  }

  return await performMobileAuthentication();
};

// ====================================================================================
// User Registration API  ✅ Wallet must start at 0
// ====================================================================================

export const registerUser = async (userData, credentialId, publicKey) => {
  try {
    const registrationData = {
      name: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      dob: userData.dob,
      password: userData.password,
      phone: userData.phone,

      // ✅ REQUIRED: first wallet balance must be 0
      initialWalletBalance: 0.0,

      fingerprintData: {
        method: 'webauthn',
        credentialId: credentialId,
        publicKey: publicKey,
      },
      deviceType: getDeviceType(),
      enrolledAt: new Date().toISOString(),
    };

    console.log('=== SENDING TO BACKEND ===');
    console.log(JSON.stringify(registrationData, null, 2));

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });

    console.log('=== RESPONSE STATUS ===', response.status);
    const responseText = await response.text();
    console.log('=== RESPONSE TEXT ===', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }

    if (response.ok) {
      console.log('=== BACKEND SUCCESS ===');
      return { success: true, data: responseData };
    }

    console.log('=== BACKEND ERROR ===', responseData);
    return { success: false, error: responseData.message || 'Registration failed' };
  } catch (error) {
    console.error('=== NETWORK ERROR ===', error);
    return { success: false, error: 'Could not connect to server.' };
  }
};

// ====================================================================================
// Dashboard Fetch
// ====================================================================================

export const fetchDashboardData = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/dashboard/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }
    return { success: false, error: 'Failed to fetch dashboard' };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// ====================================================================================
// WebAuthn Login (For BiometricSuccessScreen) ✅ THIS WAS MISSING
// ====================================================================================

export const performWebAuthnLogin = async () => {
  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions = {
      challenge: challenge,
      rpId: window.location.hostname,
      userVerification: 'required',
      timeout: 60000,
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (assertion) {
      return { success: true };
    }
    return { success: false, error: 'Authentication failed' };
  } catch (error) {
    console.error('WebAuthn Login Error:', error);
    return { success: false, error: error.message };
  }
};

// ✅ IMPORTANT: Named export required for your BiometricSuccessScreen import
export const performBiometricLogin = async () => {
  if (Platform.OS === 'web') {
    if (window.PublicKeyCredential) {
      return await performWebAuthnLogin();
    }
    return { success: false, error: 'WebAuthn not supported' };
  }
  return await performMobileAuthentication();
};

// ====================================================================================
// ✅ Wallet API (TopUp)
// ====================================================================================

export const fundWallet = async (userId, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/${userId}/fund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      return { success: false, error: data?.error || 'Top-up failed' };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
};

// ====================================================================================
// Optional helpers used by HomeScreen
// ====================================================================================

export const fetchWalletBalance = async (userId) => {
  const res = await fetch(`${API_BASE}/${userId}/balance`);
  return await res.json();
};

export const fetchWalletTransactions = async (userId) => {
  const res = await fetch(`${API_BASE}/${userId}/transactions`);
  return await res.json();
};

// ====================================================================================
// Default Export
// ====================================================================================

export default {
  registerUser,
  performBiometricAuth,
  performBiometricLogin,      // ✅ included
  performWebAuthnLogin,       // ✅ included
  performMobileAuthentication,
  getDeviceType,
  fetchDashboardData,
  fundWallet,
  fetchWalletBalance,
  fetchWalletTransactions,
  API_BASE,
};