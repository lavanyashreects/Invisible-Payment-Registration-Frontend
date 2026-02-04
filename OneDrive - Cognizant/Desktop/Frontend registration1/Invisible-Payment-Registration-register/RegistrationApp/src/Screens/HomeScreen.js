import React, { useState, useEffect, useRef } from 'react';

import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions, Alert, Image, ActivityIndicator, RefreshControl
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// ✅ Functionality-only import (working code)
import { API_BASE } from '../api/api';

// Keep Splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

const FONT = { fontFamily: 'Gallix' };

// =====================================================
// ✅ ICONS / SVGs (Design from your old code)
// =====================================================

const HomeIcon = ({ color = "#000048" }) => (
  <Svg width="24" height="25" viewBox="0 0 24 25" fill="none">
    <Path
      d="M20.88 9.37503L13.07 3.01044C12.7642 2.7578 12.3853 2.6203 11.995 2.6203C11.6047 2.6203 11.2258 2.7578 10.92 3.01044L3.12 9.37503C2.84897 9.59229 2.62955 9.87156 2.47869 10.1913C2.32783 10.511 2.24959 10.8625 2.25 11.2188V20.3125C2.25 20.9341 2.48705 21.5303 2.90901 21.9698C3.33097 22.4093 3.90326 22.6563 4.5 22.6563H7.5C8.09674 22.6563 8.66903 22.4093 9.09099 21.9698C9.51295 21.5303 9.75 20.9341 9.75 20.3125V17.1875C9.75259 16.9812 9.83244 16.784 9.97254 16.6381C10.1126 16.4922 10.3019 16.409 10.5 16.4063H13.5C13.6981 16.409 13.8874 16.4922 14.0275 16.6381C14.1676 16.784 14.2474 16.9812 14.25 17.1875V20.3125C14.25 20.9341 14.4871 21.5303 14.909 21.9698C15.331 22.4093 15.9033 22.6563 16.5 22.6563H19.5C20.0967 22.6563 20.669 22.4093 21.091 21.9698C21.5129 21.5303 21.75 20.3125 21.75 20.3125V11.1771C21.7444 10.8279 21.6632 10.4846 21.5126 10.1726C21.362 9.86057 21.1457 9.58796 20.88 9.37503Z"
      fill={color}
    />
  </Svg>
);

const WalletIcon = ({ color = "#848484" }) => (
  <Svg width="24" height="25" viewBox="0 0 24 25" fill="none">
    <Path d="M21.6389 14.9956H17.5906C16.1042 14.9947 14.8993 13.7406 14.8984 12.1922C14.8984 10.6438 16.1042 9.38974 17.5906 9.38879H21.6389" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.0493 12.1281H17.7373" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M7.74766 3.125H16.3911C19.2892 3.125 21.6388 5.57241 21.6388 8.59132V16.0674C21.6388 19.0863 19.2892 21.5337 16.3911 21.5337H7.74766C4.84951 21.5337 2.5 19.0863 2.5 16.0674V8.59132C2.5 5.57241 4.84951 3.125 7.74766 3.125Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7.03613 7.85205H12.4351" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ProfileIcon = ({ color = "#848484" }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M11.5788 12.056C14.2176 12.056 16.3568 9.91682 16.3568 7.278C16.3568 4.63918 14.2176 2.5 11.5788 2.5C8.93996 2.5 6.80078 4.63918 6.80078 7.278C6.80078 9.91682 8.93996 12.056 11.5788 12.056Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M4.00002 18.7014C3.99875 18.3655 4.07387 18.0337 4.21971 17.7311C4.67738 16.8158 5.968 16.3307 7.03893 16.111C7.81129 15.9462 8.59432 15.836 9.38218 15.7815C10.8409 15.6533 12.308 15.6533 13.7666 15.7815C14.5544 15.8367 15.3374 15.9468 16.1099 16.111C17.1808 16.3307 18.4714 16.77 18.9291 17.7311C19.2224 18.3479 19.2224 19.064 18.9291 19.6808C18.4714 20.6419 17.1808 21.0812 16.1099 21.2918C15.3384 21.4634 14.5551 21.5766 13.7666 21.6304C12.5794 21.7311 11.3866 21.7494 10.1968 21.6854C9.92223 21.6854 9.65678 21.6854 9.38218 21.6304C8.59665 21.5773 7.81633 21.4641 7.04809 21.2918C5.968 21.0812 4.68653 20.6419 4.21971 19.6808C4.07461 19.3747 3.99957 19.0401 4.00002 18.7014Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PlusIcon = ({ color = "#000048", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" preserveAspectRatio="xMidYMid meet">
    <Path d="M8 18V10H0V8H8V0H10V8H18V10H10V18H8Z" fill={color}/>
  </Svg>
);

// ✅ Action icons from old design
const TransactionHistoryIcon = ({ size = 34, color = "#000048", strokeWidth = 2.4 }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none" preserveAspectRatio="xMidYMid meet">
    <Rect x={3.2} y={3.2} width={23.6} height={23.6} rx={6.2} stroke={color} strokeWidth={strokeWidth} fill="none"/>
    <Path d="M9 12.2H18.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.5 9.9L18.9 12.2L16.5 14.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M20.8 17.8H11.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.3 15.5L10.9 17.8L13.3 20.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx={21.6} cy={21.6} r={3.7} stroke={color} strokeWidth={strokeWidth} fill="none"/>
    <Path d="M21.6 19.8V21.6L22.9 22.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const RewardsPointsIcon = ({ color = "#000048" }) => (
  <Svg width="34" height="36" viewBox="0 0 34 36" fill="none">
    <Path
      d="M30.936 24.077C30.26 23.504 29.371 23.258 28.494 23.404L19.983 24.823C19.939 24.088 19.644 23.402 19.12 22.878C18.554 22.313 17.812 22.007 17.001 22.006C11.588 22.022 8.017 22.023 7.228 22.008C6.677 21.394 5.887 21 5 21H3C2.448 21 2 21.448 2 22V32C2 32.552 2.448 33 3 33H5C5.883 33 6.67 32.609 7.22 32H17C17.07 32 17.141 31.993 17.209 31.978L29.619 29.319C30.998 29.023 31.999 27.785 31.999 26.374C32 25.487 31.612 24.65 30.936 24.077ZM5 31H4V23H5C5.551 23 6 23.449 6 24V30C6 30.551 5.551 31 5 31ZM29.201 27.363L16.894 30H8V24.014C9.244 24.024 11.763 24.021 17.006 24.006H17.009C17.273 24.006 17.52 24.108 17.707 24.294C17.896 24.483 18 24.734 18 25.003C18 25.553 17.553 26 17.003 26H12C11.448 26 11 26.448 11 27C11 27.552 11.448 28 12 28H17.003C17.898 28 18.694 27.597 19.244 26.973L28.823 25.376C29.121 25.328 29.412 25.407 29.643 25.602C29.873 25.798 30 26.072 30 26.374C30 26.848 29.664 27.264 29.201 27.363ZM15 21H19C23.962 21 28 16.962 28 12C28 7.038 23.962 3 19 3H15C10.038 3 6 7.038 6 12C6 16.962 10.038 21 15 21ZM26 12C26 15.174 23.875 17.856 20.975 18.712C22.826 17.062 24 14.668 24 12C24 9.332 22.826 6.938 20.975 5.288C23.875 6.144 26 8.826 26 12ZM15 5C18.86 5 22 8.14 22 12C22 15.86 18.86 19 15 19C11.14 19 8 15.86 8 12C8 8.14 11.14 5 15 5Z"
      fill={color}
    />
    <Path
      d="M11.9319 13.442L11.5409 15.838C11.4789 16.216 11.6389 16.596 11.9519 16.817C12.2659 17.037 12.6779 17.06 13.0119 16.875L14.9999 15.776L16.9879 16.875C17.1399 16.958 17.3059 17 17.4719 17C17.6739 17 17.8759 16.938 18.0479 16.817C18.3609 16.597 18.5209 16.216 18.4589 15.838L18.0679 13.442L19.7149 11.754C19.9769 11.486 20.0669 11.094 19.9469 10.738C19.8269 10.382 19.5199 10.123 19.1499 10.067L16.9139 9.725L15.9049 7.575C15.7409 7.224 15.3879 7 14.9999 7C14.6119 7 14.2589 7.224 14.0949 7.575L13.0859 9.725L10.8489 10.067C10.4789 10.124 10.1709 10.383 10.0519 10.738C9.93291 11.093 10.0219 11.486 10.2839 11.754L11.9319 13.442ZM13.9149 11.622C14.2449 11.571 14.5279 11.36 14.6689 11.058L14.9999 10.354L15.3309 11.059C15.4729 11.361 15.7549 11.572 16.0849 11.623L16.9249 11.751L16.2839 12.408C16.0619 12.635 15.9619 12.954 16.0129 13.267L16.1539 14.129L15.4839 13.759C15.3339 13.676 15.1669 13.634 14.9999 13.634C14.8329 13.634 14.6669 13.676 14.5159 13.759L13.8459 14.129L13.9869 13.267C14.0379 12.954 13.9379 12.635 13.7159 12.408L13.0749 11.75L13.9149 11.622Z"
      fill={color}
    />
  </Svg>
);

// ✅ Balance card background SVGs (old design)
const BalanceDollarWatermark = () => (
  <Svg pointerEvents="none" width="55" height="79" viewBox="0 0 55 79" style={styles.balanceSvgDollar}>
    <Path
      d="M21.7647 79V66.4583C16.5686 65.2917 12.0833 63.0556 8.30882 59.75C4.53431 56.4444 1.76471 51.7778 0 45.75L10.8824 41.375C12.3529 46.0417 14.5343 49.5903 17.4265 52.0208C20.3186 54.4514 24.1176 55.6667 28.8235 55.6667C32.8431 55.6667 36.25 54.7674 39.0441 52.9688C41.8382 51.1701 43.2353 48.375 43.2353 44.5833C43.2353 41.1806 42.1569 38.4826 40 36.4896C37.8431 34.4965 32.8431 32.2361 25 29.7083C16.5686 27.0833 10.7843 23.9479 7.64706 20.3021C4.5098 16.6562 2.94118 12.2083 2.94118 6.95834C2.94118 0.638889 5 -4.27083 9.11765 -7.77083C13.2353 -11.2708 17.451 -13.2639 21.7647 -13.75V-26H33.5294V-13.75C38.4314 -12.9722 42.4755 -11.1979 45.6618 -8.42708C48.848 -5.65625 51.1765 -2.27778 52.6471 1.70833L41.7647 6.375C40.5882 3.26389 38.9216 0.930555 36.7647 -0.625C34.6078 -2.18056 31.6667 -2.95833 27.9412 -2.95833C23.6275 -2.95833 20.3431 -2.01042 18.0882 -0.114582C15.8333 1.78125 14.7059 4.13889 14.7059 6.95834C14.7059 10.1667 16.1765 12.6944 19.1176 14.5417C22.0588 16.3889 27.1569 18.3333 34.4118 20.375C41.1765 22.3194 46.299 25.4063 49.7794 29.6354C53.2598 33.8646 55 38.75 55 44.2917C55 51.1945 52.9412 56.4445 48.8235 60.0417C44.7059 63.6389 39.6078 65.875 33.5294 66.75V79H21.7647Z"
      fill="white"
      opacity="0.2"
    />
  </Svg>
);

const BalanceCircleLeft = () => (
  <Svg pointerEvents="none" width="81" height="70" viewBox="0 0 81 70" style={styles.balanceSvgLeft}>
    <Circle cx="-31" cy="-42" r="112" fill="white" opacity="0.1" />
    <Circle cx="-31" cy="-42" r="110.5" stroke="white" strokeOpacity="0.1" strokeWidth="3" />
  </Svg>
);

const BalanceCircleRight = () => (
  <Svg pointerEvents="none" width="129" height="72" viewBox="0 0 129 72" style={styles.balanceSvgRight}>
    <Circle cx="112" cy="112" r="109" stroke="white" strokeOpacity="0.2" strokeWidth="6" />
  </Svg>
);

// =====================================================
// ✅ Transaction Row (keep functionality same)
// =====================================================
const TransactionRow = ({ name, date, amount, type }) => {
  const isDebit = type === 'DEBIT';
  return (
    <TouchableOpacity style={styles.transItem} onPress={() => Alert.alert('Transaction Detail', `Viewing ${name}`)}>
      <View style={styles.transLeft}>
        <View style={styles.transIconBg}>
          <Text style={{ fontSize: 20 }}>{isDebit ? '🛒' : '💰'}</Text>
        </View>
        <View>
          <Text style={styles.transName}>{name}</Text>
          <Text style={styles.transDate}>{new Date(date).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={[styles.transAmount, { color: isDebit ? '#E74C3C' : '#2ECC71' }]}>
        {isDebit ? '-' : '+'} ${parseFloat(amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

// ✅ Auto-scrolling Rewards Carousel (unchanged)
const AutoScrollRewards = () => {
  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const rewardImages = [require('../../assets/rewardc1.png')];

  useEffect(() => {
    if (!containerWidth || rewardImages.length <= 1) return;

    let index = 0;
    let direction = 1;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;

      index += direction;

      if (index >= rewardImages.length - 1) {
        index = rewardImages.length - 1;
        direction = -1;
      } else if (index <= 0) {
        index = 0;
        direction = 1;
      }

      scrollRef.current.scrollTo({ x: index * containerWidth, animated: true });
    }, 2500);

    return () => clearInterval(interval);
  }, [containerWidth, rewardImages.length]);

  return (
    <View style={styles.rewardCarouselContainer} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
      >
        {rewardImages.map((img, idx) => (
          <View key={idx} style={[styles.rewardSlide, { width: containerWidth || 1 }]}>
            <Image source={img} style={styles.rewardImage} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// =====================================================
// ✅ MAIN SCREEN (Keep ALL functionality same)
// =====================================================
export default function HomeScreen({ userData: userDataProp, onProfilePress, navigation, route }) {

  // ✅ Accept userData from either props OR route params (working functionality)
  const userData =
    userDataProp ??
    route?.params?.userData ??
    route?.params?.user ??
    route?.params ??
    null;

  const [walletData, setWalletData] = useState({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  // ✅ Strong userId resolution (working functionality)
  const userId =
    userData?.user_id ??
    userData?.id ??
    userData?.userId ??
    userData?.userID ??
    userData?.user?.user_id ??
    userData?.user?.id ??
    userData?.user?.userId;

  const fetchWalletDetails = async () => {
    if (!userId) {
      console.warn("HomeScreen: userId missing, skipping wallet fetch", userData);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const balanceRes = await fetch(`${API_BASE}/${userId}/balance`);
      const balanceJson = await balanceRes.json();

      if (balanceJson?.name) setDbUser({ name: balanceJson.name });

      const transRes = await fetch(`${API_BASE}/${userId}/transactions`);
      const transJson = await transRes.json();

      setWalletData({
        balance: balanceJson?.wallet_balance ?? balanceJson?.balance ?? 0,
        transactions: transJson || []
      });
    } catch (error) {
      Alert.alert("Error", "Could not fetch wallet data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchWalletDetails();
  }, [userId]);

  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId) fetchWalletDetails();
    });
    return unsubscribe;
  }, [navigation, userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletDetails();
  };

  const displayName = dbUser?.name || userData?.name || 'User';

  // ✅ pass userId (TopUpWallet expects it) (working functionality)
  const handleTopUp = () => {
    navigation.navigate('Topupwallet', { userId });
  };

  // ✅ keep old action handlers (design-only section uses these)
  const handleSeeAll = () => Alert.alert("History", "Loading full transaction history...");
  const handleRewards = () => Alert.alert("Rewards", "You have 450 points!");

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000048" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image source={require('../../assets/ProfileImage.png')} style={styles.profileImage} resizeMode="cover" />
          </TouchableOpacity>

          <Text style={styles.greetingText}>
            Hi, {displayName?.split(' ')[0] || 'User'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => Alert.alert("Notifications", "No new alerts.")}
        >
          <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21 16H1C1.79565 16 2.55871 15.6839 3.12132 15.1213C3.68393 14.5587 4 13.7956 4 13V8C4 6.14348 4.7375 4.36301 6.05025 3.05025C7.36301 1.7375 9.14348 1 11 1C12.8565 1 14.637 1.7375 15.9497 3.05025C17.2625 4.36301 18 6.14348 18 8V13C18 13.7956 18.3161 14.5587 18.8787 15.1213C19.4413 15.6839 20.2044 16 21 16ZM12.73 20C12.5542 20.3031 12.3018 20.5547 11.9982 20.7295C11.6946 20.9044 11.3504 20.9965 11 20.9965C10.6496 20.9965 10.3054 20.9044 10.0018 20.7295C9.69816 20.5547 9.44581 20.3031 9.27 20H12.73Z"
              stroke="#000048"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
contentContainerStyle={[styles.scrollBody, { flexGrow: 1 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* --- BALANCE CARD (Design updated with SVG backgrounds like old UI) --- */}
        <LinearGradient
          colors={['#000048', '#2F2F8D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.balanceCard}
        >
          {/* ✅ background svg design from old code */}
          <BalanceCircleLeft />
          <BalanceCircleRight />
          <BalanceDollarWatermark />

          <View>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceAmount}>
              $ {parseFloat(walletData.balance || 0).toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity style={styles.topUpGroup} onPress={handleTopUp}>
            <View style={styles.plusCircle}>
              <PlusIcon size={18} color="#000048" />
            </View>
            <Text style={styles.topUpLabel}>Top up</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* ✅ Action Row (Transaction History + Rewards) – design from old code */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSeeAll}>
            <View style={styles.actionIconContainer}>
              <TransactionHistoryIcon size={34} color="#000048" />
            </View>
            <Text style={styles.actionBtnText}>Transaction{"\n"}History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleRewards}>
            <View style={styles.actionIconContainer}>
              <RewardsPointsIcon color="#000048" />
            </View>
            <Text style={styles.actionBtnText}>Rewards &{"\n"}Points</Text>
          </TouchableOpacity>
        </View>

        {/* --- Recent Transactions --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Dynamic list remains same functionality */}
        {walletData.transactions.length > 0 ? (
          walletData.transactions.slice(0, 5).map((trans) => (
            <TransactionRow
              key={trans.walletTransactionId || trans.id}
              name={trans.description || "SmartPay Order"}
              date={trans.createdAt || trans.created_at}
              amount={trans.amount}
              type={trans.transactionType || trans.transaction_type}
            />
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 10 }}>
            No transactions yet.
          </Text>
        )}

        {/* Top up rewards + carousel (design unchanged) */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Top up Rewards</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See more</Text>
          </TouchableOpacity>
        </View>

        <AutoScrollRewards />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <View style={styles.tabBarInner}>
          <TouchableOpacity style={styles.tabItem}>
            <HomeIcon color="#000048" />
            <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <WalletIcon color="#848484" />
            <Text style={styles.tabLabel}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={onProfilePress}>
            <ProfileIcon color="#848484" />
            <Text style={styles.tabLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// =====================================================
// ✅ STYLES (Your working file already has these + old design ones)
// No functionality change.
// =====================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  
scrollBody: {
  paddingHorizontal: 16,
  paddingTop: 10,
  paddingBottom: 90,  // ✅ just enough to avoid hiding behind tab bar
  width: '100%',
  alignSelf: 'stretch',
},



  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    width: '100%',
    alignSelf: 'stretch',
  },

  userInfo: { flexDirection: 'row', alignItems: 'center' },

  avatarContainer: {
    marginRight: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },

  profileImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  greetingText: { fontSize: 16, fontWeight: '600', color: '#000048', fontFamily: 'Gallix, sans-serif'  },

  notificationIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center'
  },

  

// ✅ BALANCE CARD: stronger shadow + compact height like screenshot
balanceCard: {
  borderRadius: 16,          // tighter like screenshot
  paddingVertical: 16,       // compact height (was 25)
  paddingHorizontal: 18,     // compact width (was 25)
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  // iOS shadow (soft but strong)
  shadowColor: '#000',
  shadowOpacity: 0.28,
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 18,

  // Android shadow
  elevation: 12,

  overflow: 'hidden',
},

balanceLabel: { 
  color: '#FFFFFFCC', 
  fontSize: 13 
},

balanceAmount: { 
  color: '#FFF', 
  fontSize: 22, 
  fontWeight: '700', 
  marginTop: 4 
},

topUpGroup: { 
  alignItems: 'center' 
},

plusCircle: {
  backgroundColor: '#FFFFFF',
  width: 40,              // smaller to match screenshot
  height: 40,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',

  // subtle shadow for the + circle
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
},

topUpLabel: { 
  color: '#FFF', 
  fontSize: 12.5, 
  marginTop: 5, 
  fontWeight: '500' 
},


  // ✅ Action Row design (old design)
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 25
  },

  actionBtn: {
    width: '48%',
    height: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },

  actionIconContainer: { marginRight: 10, width: 35, alignItems: 'center' },

  actionBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000048',
    lineHeight: 18
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center'
  },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000048',fontFamily: 'Gallix, sans-serif' },

  seeAllText: { color: '#2F78C4', fontSize: 15, fontWeight: '600',fontFamily: 'Gallix, sans-serif' },

  transItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },

  transLeft: { flexDirection: 'row', alignItems: 'center' },

  transIconBg: {
    width: 48,
    height: 48,
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },

  transName: { fontSize: 16, fontWeight: '600', color: '#000048' },

  transDate: { fontSize: 12, color: '#888', marginTop: 2 },

  transAmount: { fontSize: 16, fontWeight: '700' },

  // ✅ Balance background SVG positions (old design)
  balanceSvgLeft: {
    position: 'absolute',
    left: -20,
    top: -20,
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0.18,
  },

  balanceSvgRight: {
    position: 'absolute',
    right: -30,
    bottom: -10,
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0.18,
  },

  balanceSvgDollar: {
    position: 'absolute',
    right: 190,
    top: 10,
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0.12,
  },

 

rewardCarouselContainer: {
  width: '100%',
  aspectRatio: 200 / 68,
  minHeight: 80,
  borderRadius: 8,
  overflow: 'hidden',
  marginTop: 6,
  marginBottom: 0,      // ✅ remove extra gap below banner
  backgroundColor: '#BEDEFF',
},



  rewardSlide: { height: '100%' },

  rewardImage: { width: '100%', height: '100%' },

  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignSelf: 'stretch',
  },

 tabBar: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 56,              // ✅ compact like reference
  backgroundColor: '#FFF',
  borderTopWidth: 1,
  borderTopColor: '#EEE',
  paddingBottom: 0,        // ✅ remove extra space
  paddingTop: 0,
  justifyContent: 'center',
},

tabItem: {
  alignItems: 'center',
  paddingTop: 6,           // ✅ balanced touch area without wasting space
},

tabLabel: { 
  fontSize: 11,            // ✅ slightly smaller (optional but matches ref)
  color: '#999', 
  marginTop: 3,
  fontFamily: 'Gallix, sans-serif'
},

  tabLabelActive: { color: '#000048', fontWeight: '700',fontFamily: 'Gallix, sans-serif' },
});
