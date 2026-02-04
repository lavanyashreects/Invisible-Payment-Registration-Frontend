
// src/Screens/TopUpWallet.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

// --- Layout constants for precise overlap ---
const HEADER_HEIGHT = 300;     // keep in sync with styles.header.height
const CARD_OVERLAP = 120;      // dialed to get nice overlap

// --- Global font constant ---
const GALAXY_FONT = Platform.select({
  ios: 'Galaxy',
  android: 'Galaxy',
  default: 'Galaxy',
});

export default function TopUpWallet({ navigation }) {
  const [amount, setAmount] = useState('100');
  const [selectedChip, setSelectedChip] = useState(null);
  const [method, setMethod] = useState(null);

  const route = useRoute();
  // ✅ accept either userId or user_id (safe)
  const userId = route?.params?.userId ?? route?.params?.user_id ?? route?.params?.id;

  // Show a small validation message if Pay is pressed without selecting a method
  const [showMethodError, setShowMethodError] = useState(false);

  const [amountFocused, setAmountFocused] = useState(false);

  // ---- dynamic time for mock status bar ----
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

  // displayAmount retained for Pay button
  const displayAmount = selectedChip ?? amount;

  const onChangeAmount = (txt) => {
    const clean = txt.replace(/[^0-9]/g, '');
    setAmount(clean);
    setSelectedChip(null);
  };

  const numericAmount = Number(displayAmount || 0);

  // ✅ Only enable when amount > 0 AND a payment method is selected
  const canPay = numericAmount > 0 && !!method;

  const handlePay = () => {
    if (!method) {
      setShowMethodError(true);
      return;
    }
    if (!(numericAmount > 0)) return;

    // ✅ pass userId to EnterPin (needed for backend fund API)
    navigation?.navigate('EnterPin', {
      amount: Number(displayAmount || 0),
      method,
      userId,
    });
  };

  const canGoBack = Boolean(navigation?.goBack);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Header (blue gradient) */}
      <LinearGradient
        colors={['#0B0742', '#2D2A86']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Mock status bar */}
        <View style={styles.mockStatusBar}>
          <Text style={styles.statusTime} allowFontScaling={false}>{statusTime}</Text>
          <View style={styles.statusIcons}>
            <MaterialCommunityIcons name="signal" size={15} color="#FFFFFF" />
            <MaterialCommunityIcons name="wifi" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            <Ionicons name="battery-full" size={22} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </View>
        </View>

        <View style={styles.headerBar}>
          <TouchableOpacity
            style={[styles.backBtn, !canGoBack && { opacity: 0.35 }]}
            onPress={() => canGoBack && navigation.goBack()}
            activeOpacity={0.8}
            disabled={!canGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} allowFontScaling={false}>Top up Wallet</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {/* White Card */}
      <View style={styles.card}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
        >
          <Text style={styles.sectionLabel} allowFontScaling={false}>Add Money</Text>

          {/* Amount Input */}
          <View style={[styles.inputRow, amountFocused && styles.inputRowFocused]}>
            <Text style={styles.currency} allowFontScaling={false}>$</Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={onChangeAmount}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              underlineColorAndroid="transparent"
              allowFontScaling={false}
              placeholder="100"
              placeholderTextColor="#B7BBD1"
            />
          </View>

          {/* Chips */}
          <View style={styles.chipsRow}>
            {['200', '500', '1000'].map((v, i) => {
              const active = selectedChip === v;
              return (
                <TouchableOpacity
                  key={`${v}-${i}`}
                  onPress={() => {
                    setSelectedChip(v);
                    setAmount(v);
                  }}
                  activeOpacity={0.85}
                  style={[
                    styles.outlineChip,
                    i !== 0 && { marginLeft: 12 },
                    active && styles.outlineChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.outlineChipText,
                      active && styles.outlineChipTextActive,
                    ]}
                    allowFontScaling={false}
                  >
                    $ {v}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Payment Methods */}
          <Text style={[styles.sectionLabel, { marginTop: 18 }]} allowFontScaling={false}>
            Select Payment Method
          </Text>

          {showMethodError && !method ? (
            <Text style={styles.methodError} allowFontScaling={false}>
              Please choose a payment method to continue.
            </Text>
          ) : null}

          <View style={styles.methodsRow}>
            {METHODS.map((m) => {
              const active = method === m.key;
              return (
                <View key={m.key} style={styles.methodCol}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      setMethod(m.key);
                      if (showMethodError) setShowMethodError(false);
                    }}
                    style={styles.methodCard}
                  >
                    <View style={[styles.methodImageWrap, active && styles.methodImageWrapActive]}>
                      <Image source={m.icon} style={styles.methodIcon} resizeMode="cover" />
                    </View>
                  </TouchableOpacity>
                  <Text
                    style={[styles.methodText, active && styles.methodTextActive]}
                    numberOfLines={1}
                    allowFontScaling={false}
                  >
                    {m.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Pay Button */}
          <Pressable
            disabled={!canPay}
            onPress={handlePay}
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            style={({ pressed }) => [
              styles.donePressable,
              pressed && canPay && { transform: [{ scale: 0.98 }] },
            ]}
          >
            <LinearGradient
              colors={['#0B0742']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.payWrap}
            >
              <View style={styles.payBtn}>
                <Text style={styles.payText} allowFontScaling={false}>
                  Pay $ {Number(displayAmount || 0)}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>

      <View style={styles.footerPill} />
    </SafeAreaView>
  );
}

/** Image paths */
const METHODS = [
  { key: 'paypal', label: 'Paypal', icon: require('../../assets/paypal.png') },
  { key: 'gpay', label: 'Gpay', icon: require('../../assets/gpay.png') },
  { key: 'fednow', label: 'FedNow', icon: require('../../assets/fednow.png') },
  { key: 'visa', label: 'Cards', icon: require('../../assets/visa.png') },
];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F7FB', position: 'relative' },

  header: {
    height: HEADER_HEIGHT,
    overflow: 'visible',
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    zIndex: 1,
    elevation: 0,
  },

  mockStatusBar: {
    height: 48,
    paddingHorizontal: 16,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    fontFamily: 'Gallix , sans-serif',
  },
  statusIcons: { flexDirection: 'row', alignItems: 'center' },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    position: 'relative',
    left: 8,
    marginTop: 12,
    paddingTop: 8,
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    position: 'absolute',
    width: 200,
    height: 26,
    top: 70,
    left: 10,
    textAlign: 'left',
    fontFamily: 'Gallix , sans-serif',
  },

  card: {
    position: 'absolute',
    top: HEADER_HEIGHT - CARD_OVERLAP,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    paddingTop: 24,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },

  sectionLabel: {
    color: '#0D0D33',
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.95,
    marginBottom: 10,
    fontFamily: 'Gallix , sans-serif',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDF1F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 56,
  },
  inputRowFocused: {
    borderWidth: 2,
    borderColor: '#0B0742',
    shadowColor: '#0B0742',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0742',
    marginRight: 8,
    fontFamily: 'Gallix , sans-serif',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0D0D33',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    outlineStyle: 'none',
    fontFamily: 'Gallix , sans-serif',
  },

  chipsRow: { flexDirection: 'row', marginTop: 15 },
  outlineChip: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: '#0C1445',
    backgroundColor: '#FFFFFF',
  },
  outlineChipActive: {
    backgroundColor: '#0C1445',
    borderColor: '#0C1445',
  },
  outlineChipText: {
    color: '#0C1445',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Gallix , sans-serif',
  },
  outlineChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'Gallix , sans-serif',
  },

  methodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  methodCol: { width: '23%', alignItems: 'center' },
  methodCard: {
    width: 75,
    height: 75,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  methodImageWrap: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  methodImageWrapActive: {
    borderWidth: 2,
    borderColor: '#2D2A86',
  },
  methodIcon: {
    width: '110%',
    height: '110%',
    transform: [{ scale: 1.08 }],
    alignSelf: 'center',
  },
  methodText: {
    marginTop: 8,
    color: '#0D0D33',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Gallix , sans-serif',
  },
  methodTextActive: {
    color: '#2D2A86',
    fontWeight: '700',
    fontFamily: 'Gallix , sans-serif',
  },

  methodError: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
    fontFamily: 'Gallix , sans-serif',
  },

  donePressable: { borderRadius: 12 },

  payWrap: {
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#0B0742',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  payBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Gallix , sans-serif',
  },

  footerPill: {
    position: 'absolute',
    bottom: 8,
    height: 5,
    width: 144,
    backgroundColor: '#2D2A86',
    borderRadius: 999,
    alignSelf: 'center',
    zIndex: 20,
    opacity: 1,
  },
});
