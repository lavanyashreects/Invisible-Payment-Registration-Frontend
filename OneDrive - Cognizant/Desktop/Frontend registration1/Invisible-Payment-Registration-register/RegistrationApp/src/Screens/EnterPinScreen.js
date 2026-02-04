// src/Screens/EnterPinScreen.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

// ✅ API call for wallet top-up
import { fundWallet } from '../api/api'; // adjust path if needed

// ---- keep these identical to TopUpWallet ----
const HEADER_HEIGHT = 300;
const CARD_OVERLAP = 120;

// Modal's vertical offset must start exactly where the background card starts
const MODAL_TOP_OFFSET = HEADER_HEIGHT - CARD_OVERLAP;

const COLORS = {
  bg: '#F7F7FB',
  navy: '#0C1445',
  white: '#FFFFFF',
  border: '#0C1445',
  textPrimary: '#0C1445',
  textSecondary: '#8C8C9A',
  buttonText: '#FFFFFF',
  keyText: '#0C1445',
  backdrop: 'rgba(6,10,61,0.50)',
  successGreen: 'rgba(45, 184, 31, 1)',
  failureRed: '#F14336',
  infoBlue: '#09b6e6',
};

const PIN_LENGTH = 4;

// ✅ 30 seconds inactivity timeout
const INACTIVITY_MS = 30 * 1000;

export default function EnterPinScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ read userId + amount passed from TopUpWallet
  const { amount, userId } = route.params || {};

  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // ✅ store server-updated balance to display in modal
  const [serverNewBalance, setServerNewBalance] = useState(null);

  // ✅ prevent multiple submissions
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ inactivity timer refs
  const inactivityTimerRef = useRef(null);

  // ---- status bar time ----
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const statusTime = useMemo(() => {
    const h = now.getHours();
    const m = now.getMinutes();
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${String(m).padStart(2, '0')}`;
  }, [now]);

  // ✅ helper: clear timer
  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  // ✅ helper: reset timer on any user action
  const resetInactivityTimer = () => {
    // If already completed or in modal, no need to restart
    if (showSuccess || showFailure) return;

    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      // If still nothing happened (and not processing), show failure
      if (!showSuccess && !showFailure && !isProcessing) {
        setShowFailure(true);
      }
    }, INACTIVITY_MS);
  };

  // ✅ start inactivity timer when screen mounts
  useEffect(() => {
    resetInactivityTimer();
    return () => clearInactivityTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ stop timer once modal is shown
  useEffect(() => {
    if (showSuccess || showFailure) {
      clearInactivityTimer();
    }
  }, [showSuccess, showFailure]);

  const handleKeyPress = (key) => {
    // ✅ reset inactivity timer on any keypad action
    resetInactivityTimer();

    if (key === 'blank') return;
    if (key === 'delete') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (typeof key === 'string' && key.length === 1 && pin.length < PIN_LENGTH) {
      setPin((p) => p + key);
    }
  };

  const canSubmit = pin.length === PIN_LENGTH;

  // ✅ Actually fund wallet on Done
  const processTopUp = async () => {
    if (isProcessing) return;

    // must have userId
    if (!userId) {
      setShowFailure(true);
      return;
    }

    const addedAmount = Number(amount || 0);
    if (!(addedAmount > 0)) {
      setShowFailure(true);
      return;
    }

    try {
      setIsProcessing(true);

      // ✅ CALL BACKEND fund API
      const res = await fundWallet(userId, addedAmount);

      if (!res?.success) {
        setShowFailure(true);
        return;
      }

      // ✅ capture new balance from server response
      const newBal = res?.data?.wallet_balance ?? res?.data?.balance ?? null;
      setServerNewBalance(newBal);

      // ✅ show success modal
      setShowSuccess(true);
    } catch (e) {
      setShowFailure(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ DONE press: no double click logic now; just single press = success flow
  const handleDonePress = () => {
    // reset inactivity timer because user acted
    resetInactivityTimer();

    if (!canSubmit) return;
    if (showSuccess || showFailure) return;

    processTopUp();
  };

  const added = Number(amount || 0);

  // ✅ show server new balance if available; fallback to safe computation (only value, no UI change)
  const newBalance =
    serverNewBalance !== null && serverNewBalance !== undefined
      ? Number(serverNewBalance).toFixed(2)
      : (1032.54 + added).toFixed(2);

  const closeSuccess = () => setShowSuccess(false);
  const closeFailure = () => setShowFailure(false);

  const backToHome = () => {
    setShowSuccess(false);
    // ✅ HomeScreen refreshes on focus and shows updated DB balance
    navigation.popToTop?.();
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <LinearGradient
        colors={['#0B0742', '#2D2A86']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Mock status bar */}
        <View style={styles.mockStatusBar}>
          <Text style={styles.statusTime}>{statusTime}</Text>
          <View style={styles.statusIcons}>
            <MaterialCommunityIcons name="signal" size={15} color="#FFFFFF" />
            <MaterialCommunityIcons name="wifi" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            <Ionicons name="battery-full" size={22} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </View>
        </View>

        {/* Back + Title */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              resetInactivityTimer();
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top up Wallet</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {/* Background white card */}
      <View style={styles.card}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Enter Pin</Text>
          <Text style={styles.sectionSubtitle}>Please enter your pin to continue</Text>

          <PinBoxes value={pin} length={PIN_LENGTH} />
          <NumericKeypad onKeyPress={handleKeyPress} />

          {/* DONE Button (Single tap -> Success w/API) */}
          <Pressable disabled={!canSubmit} onPress={handleDonePress} style={styles.nextButton}>
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>

      {/* Bottom pill */}
      <View style={styles.footerPill} />

      {/* ---------- Success Modal ---------- */}
      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.cardShadow}>
            <View style={modalStyles.card}>
              <TouchableOpacity style={modalStyles.closeBtn} onPress={closeSuccess}>
                <Ionicons name="close" size={18} color="#0C1445" />
              </TouchableOpacity>

              {/* Content */}
              <View style={modalStyles.body}>
                <View style={[modalStyles.iconCircle, { backgroundColor: COLORS.successGreen }]}>
                  <Ionicons name="checkmark" size={30} color="#FFFFFF" />
                </View>

                <Text style={modalStyles.title}>Top – up successful !</Text>
                <Text style={modalStyles.subText}>You have added</Text>

                <Text style={modalStyles.amount}>${Number(added || 0)}</Text>

                <Text style={[modalStyles.balance, { color: COLORS.infoBlue }]}>
                  Your new Balance is $ {newBalance}
                </Text>
              </View>

              {/* CTA pinned to bottom */}
              <LinearGradient colors={['#0B0742']} style={modalStyles.ctaWrapPinned}>
                <TouchableOpacity activeOpacity={0.9} onPress={backToHome} style={modalStyles.ctaBtn}>
                  <Text style={modalStyles.ctaText}>Back to home</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>

      {/* ---------- Failure Modal ---------- */}
      <Modal visible={showFailure} transparent animationType="fade" onRequestClose={closeFailure}>
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.cardShadow}>
            <View style={modalStyles.card}>
              <TouchableOpacity style={modalStyles.closeBtn} onPress={closeFailure}>
                <Ionicons name="close" size={18} color="#0C1445" />
              </TouchableOpacity>

              <View style={modalStyles.body}>
                <View style={[modalStyles.iconCircle, { backgroundColor: COLORS.failureRed }]}>
                  <Ionicons name="close" size={28} color="#FFFFFF" />
                </View>

                <Text style={modalStyles.title}>Top – up Failed !</Text>
                <Text style={modalStyles.subText}>Oops! Your top-up didn’t go through.</Text>

                <Text style={[modalStyles.balance, { color: COLORS.infoBlue, marginTop: 10 }]}>
                  Please try again or use a different{'\n'}payment method.
                </Text>
              </View>

              <LinearGradient colors={['#0B0742']} style={modalStyles.ctaWrapPinned}>
                <TouchableOpacity activeOpacity={0.9} onPress={closeFailure} style={modalStyles.ctaBtn}>
                  <Text style={modalStyles.ctaText}>Try again</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/** ---------- Components ---------- */

function PinBoxes({ value, length }) {
  const items = Array.from({ length });
  return (
    <View style={pinStyles.row}>
      {items.map((_, i) => {
        const isFilled = i < value.length;
        return (
          <View key={i} style={pinStyles.box}>
            <Text style={pinStyles.char}>{isFilled ? '•' : ''}</Text>
          </View>
        );
      })}
    </View>
  );
}

function NumericKeypad({ onKeyPress }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'blank', '0', 'delete'];

  return (
    <View style={keypadStyles.grid}>
      {keys.map((k, idx) => {
        const isBlank = k === 'blank';
        const isDelete = k === 'delete';
        return (
          <View key={idx} style={keypadStyles.cell}>
            {isBlank ? (
              <View style={keypadStyles.blank} />
            ) : (
              <TouchableOpacity onPress={() => onKeyPress(k)} activeOpacity={0.6} style={keypadStyles.touch}>
                {isDelete ? (
                  <MaterialCommunityIcons name="backspace-outline" size={22} color="#07103F" />
                ) : (
                  <Text style={keypadStyles.keyText}>{k}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

/** ---------- Styles ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    height: HEADER_HEIGHT,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },

  mockStatusBar: {
    height: 48,
    paddingHorizontal: 16,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Gallix , sans-serif',
  },
  statusIcons: { flexDirection: 'row', alignItems: 'center' },

  headerBar: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    marginTop: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 8,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    position: 'absolute',
    top: 70,
    left: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Gallix , sans-serif',
  },

  card: {
    position: 'absolute',
    top: HEADER_HEIGHT - CARD_OVERLAP,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0D33',
    marginBottom: 8,
    fontFamily: 'Gallix , sans-serif',
  },

  sectionSubtitle: {
    fontSize: 13,
    color: '#8C8C9A',
    marginBottom: 18,
    fontFamily: 'Gallix , sans-serif',
  },

  nextButton: {
    height: 52,
    backgroundColor: '#000048',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Gallix , sans-serif',
  },

  footerPill: {
    position: 'absolute',
    bottom: 8,
    width: 144,
    height: 5,
    backgroundColor: '#2D2A86',
    borderRadius: 999,
    alignSelf: 'center',
  },
});

const pinStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 22 },
  box: {
    width: 52,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 6,
  },
  char: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Gallix , sans-serif',
  },
});

const keypadStyles = StyleSheet.create({
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    marginTop: 8,
  },
  cell: {
    width: '33.333%',
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touch: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  keyText: {
    fontSize: 24,
    color: COLORS.navy,
    fontFamily: 'Gallix , sans-serif',
  },
  blank: { width: '100%', height: '100%' },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    alignItems: 'center',
  },
  cardShadow: {
    width: '100%',
    maxWidth: 360,
    marginTop: MODAL_TOP_OFFSET,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 110,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F4F5FA',
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  body: { alignItems: 'center' },
  iconCircle: {
    width: 64,
    height: 64,
    alignSelf: 'center',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#0C1445',
    fontFamily: 'Gallix , sans-serif',
    marginTop: 2,
  },
  subText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#8C8C9A',
    fontFamily: 'Gallix , sans-serif',
    marginTop: 6,
  },
  amount: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
    color: '#0B0742',
    fontFamily: 'Gallix , sans-serif',
    marginTop: 10,
  },
  balance: {
    textAlign: 'center',
    fontSize: 13,
    color: '#09b6e6',
    fontFamily: 'Gallix , sans-serif',
    marginTop: 10,
  },
  ctaWrapPinned: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Gallix , sans-serif',
  },
});
