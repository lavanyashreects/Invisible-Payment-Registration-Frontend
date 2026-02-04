import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Mask } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_WIDTH = 520;

// ---- SAME LAYOUT CONSTANTS AS EnterPinScreen ----
const HEADER_HEIGHT = 300;
const CARD_OVERLAP = 120;

// ---- SAME BG COLOR FEEL AS EnterPinScreen ----
const COLORS = {
  bg: '#F7F7FB',
};

/** -------------------------
 *  SVG ICONS (YOUR EXACT SVGs)
 *  ------------------------- */

// Back Arrow (12x20)
const BackArrowIcon = ({ color = '#FFFFFF' }) => (
  <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" preserveAspectRatio="xMidYMid meet">
    <Path
      d="M10.8881 0.985054C10.3981 0.495054 9.60812 0.495054 9.11812 0.985054L0.808125 9.29505C0.418125 9.68505 0.418125 10.3151 0.808125 10.7051L9.11812 19.0151C9.60812 19.5051 10.3981 19.5051 10.8881 19.0151C11.3781 18.5251 11.3781 17.7351 10.8881 17.2451L3.64813 9.99505L10.8981 2.74505C11.3781 2.26505 11.3781 1.46505 10.8881 0.985054Z"
      fill={color}
    />
  </Svg>
);

// Lock icon (16x20) - kept same path, only scalable
const LockIcon = ({ color = '#000048', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 20" fill="none" preserveAspectRatio="xMidYMid meet">
    <Path
      d="M8 0.5C9.19347 0.5 10.3377 0.974446 11.1816 1.81836C12.0256 2.66227 12.5 3.80653 12.5 5V7.5H13C13.663 7.5 14.2987 7.76358 14.7676 8.23242C15.2364 8.70126 15.5 9.33696 15.5 10V17C15.5 17.663 15.2364 18.2987 14.7676 18.7676C14.2987 19.2364 13.663 19.5 13 19.5H3C2.33696 19.5 1.70126 19.2364 1.23242 18.7676C0.763581 18.2987 0.5 17.663 0.5 17V10C0.5 9.33696 0.763581 8.70126 1.23242 8.23242C1.70126 7.76358 2.33696 7.5 3 7.5H3.5V5C3.5 3.80653 3.97445 2.66227 4.81836 1.81836C5.66227 0.974446 6.80653 0.5 8 0.5ZM3 8.5C2.60217 8.5 2.22076 8.65815 1.93945 8.93945C1.65815 9.22076 1.5 9.60217 1.5 10V17C1.5 17.3978 1.65815 17.7792 1.93945 18.0605C2.22076 18.3419 2.60218 18.5 3 18.5H13C13.3978 18.5 13.7792 18.3419 14.0605 18.0605C14.3419 17.7792 14.5 17.3978 14.5 17V10C14.5 9.60218 14.3419 9.22076 14.0605 8.93945C13.7792 8.65815 13.3978 8.5 13 8.5H3ZM8 11.5C8.13261 11.5 8.25975 11.5527 8.35352 11.6465C8.44728 11.7403 8.5 11.8674 8.5 12V15C8.5 15.1326 8.44728 15.2597 8.35352 15.3535C8.25975 15.4473 8.13261 15.5 8 15.5C7.86739 15.5 7.74025 15.4473 7.64648 15.3535C7.55272 15.2597 7.5 15.1326 7.5 15V12C7.5 11.8674 7.55272 11.7403 7.64648 11.6465C7.74025 11.5527 7.86739 11.5 8 11.5ZM8 1.5C7.07174 1.5 6.18177 1.86901 5.52539 2.52539C4.86901 3.18177 4.5 4.07174 4.5 5V7.5H11.5V5C11.5 4.07174 11.131 3.18177 10.4746 2.52539C9.81823 1.86901 8.92826 1.5 8 1.5Z"
      fill={color}
      stroke={color}
    />
  </Svg>
);

// Settings icon (YOUR EXACT SVG + mask + strokeWidth=2)
// Settings icon (YOUR EXACT SVG + mask + strokeWidth=2)
const SettingsIcon = ({ color = '#000048', size = 20 }) => {
  const maskId = 'gearMask_1276_4020';
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <Mask id={maskId} fill="white">
        <Path d="M19.32 7.55L17.43 6.92L18.32 5.14C18.4102 4.95369 18.4404 4.74397 18.4064 4.53978C18.3723 4.33558 18.2758 4.14699 18.13 4L16 1.87C15.8522 1.72209 15.6618 1.62421 15.4555 1.59013C15.2493 1.55605 15.0375 1.58748 14.85 1.68L13.07 2.57L12.44 0.680003C12.3735 0.482996 12.2472 0.311629 12.0787 0.189751C11.9102 0.0678737 11.7079 0.00154767 11.5 3.33354e-06H8.5C8.29036 -0.000537828 8.08585 0.0648223 7.91537 0.186845C7.7449 0.308868 7.61709 0.481382 7.55 0.680003L6.92 2.57L5.14 1.68C4.95369 1.58978 4.74397 1.55961 4.53978 1.59364C4.33558 1.62767 4.14699 1.72423 4 1.87L1.87 4C1.72209 4.14777 1.62421 4.33818 1.59013 4.54446C1.55605 4.75074 1.58748 4.96251 1.68 5.15L2.57 6.93L0.680003 7.56C0.482996 7.62654 0.311629 7.75283 0.189751 7.92131C0.0678737 8.08979 0.00154767 8.29207 3.33354e-06 8.5V11.5C-0.000537828 11.7096 0.0648223 11.9142 0.186845 12.0846C0.308868 12.2551 0.481382 12.3829 0.680003 12.45L2.57 13.08L1.68 14.86C1.58978 15.0463 1.55961 15.256 1.59364 15.4602C1.62767 15.6644 1.72423 15.853 1.87 16L4 18.13C4.14777 18.2779 4.33818 18.3758 4.54446 18.4099C4.75074 18.444 4.96251 18.4125 5.15 18.32L6.93 17.43L7.56 19.32C7.62709 19.5186 7.7549 19.6911 7.92537 19.8132C8.09585 19.9352 8.30036 20.0005 8.51 20H11.51C11.7196 20.0005 11.9242 19.9352 12.0946 19.8132C12.2651 19.6911 12.3929 19.5186 12.46 19.32L13.09 17.43L14.87 18.32C15.0551 18.4079 15.2628 18.4369 15.4649 18.4029C15.667 18.3689 15.8538 18.2737 16 18.13L18.13 16C18.2779 15.8522 18.3758 15.6618 18.4099 15.4555C18.444 15.2493 18.4125 15.0375 18.32 14.85L17.43 13.07L19.32 12.44C19.517 12.3735 19.6884 12.2472 19.8103 12.0787C19.9321 11.9102 19.9985 11.7079 20 11.5V8.5C20.0005 8.29036 19.9352 8.08585 19.8132 7.91537C19.6911 7.7449 19.5186 7.61709 19.32 7.55Z" />
      </Mask>

      <Path
        d="M19.32 7.55L17.43 6.92L18.32 5.14C18.4102 4.95369 18.4404 4.74397 18.4064 4.53978C18.3723 4.33558 18.2758 4.14699 18.13 4L16 1.87C15.8522 1.72209 15.6618 1.62421 15.4555 1.59013C15.2493 1.55605 15.0375 1.58748 14.85 1.68L13.07 2.57L12.44 0.680003C12.3735 0.482996 12.2472 0.311629 12.0787 0.189751C11.9102 0.0678737 11.7079 0.00154767 11.5 3.33354e-06H8.5C8.29036 -0.000537828 8.08585 0.0648223 7.91537 0.186845C7.7449 0.308868 7.61709 0.481382 7.55 0.680003L6.92 2.57L5.14 1.68C4.95369 1.58978 4.74397 1.55961 4.53978 1.59364C4.33558 1.62767 4.14699 1.72423 4 1.87L1.87 4C1.72209 4.14777 1.62421 4.33818 1.59013 4.54446C1.55605 4.75074 1.58748 4.96251 1.68 5.15L2.57 6.93L0.680003 7.56C0.482996 7.62654 0.311629 7.75283 0.189751 7.92131C0.0678737 8.08979 0.00154767 8.29207 3.33354e-06 8.5V11.5C-0.000537828 11.7096 0.0648223 11.9142 0.186845 12.0846C0.308868 12.2551 0.481382 12.3829 0.680003 12.45L2.57 13.08L1.68 14.86C1.58978 15.0463 1.55961 15.256 1.59364 15.4602C1.62767 15.6644 1.72423 15.853 1.87 16L4 18.13C4.14777 18.2779 4.33818 18.3758 4.54446 18.4099C4.75074 18.444 4.96251 18.4125 5.15 18.32L6.93 17.43L7.56 19.32C7.62709 19.5186 7.7549 19.6911 7.92537 19.8132C8.09585 19.9352 8.30036 20.0005 8.51 20H11.51C11.7196 20.0005 11.9242 19.9352 12.0946 19.8132C12.2651 19.6911 12.3929 19.5186 12.46 19.32L13.09 17.43L14.87 18.32C15.0551 18.4079 15.2628 18.4369 15.4649 18.4029C15.667 18.3689 15.8538 18.2737 16 18.13L18.13 16C18.2779 15.8522 18.3758 15.6618 18.4099 15.4555C18.444 15.2493 18.4125 15.0375 18.32 14.85L17.43 13.07L19.32 12.44C19.517 12.3735 19.6884 12.2472 19.8103 12.0787C19.9321 11.9102 19.9985 11.7079 20 11.5V8.5C20.0005 8.29036 19.9352 8.08585 19.8132 7.91537C19.6911 7.7449 19.5186 7.61709 19.32 7.55Z"
        stroke={color}
        strokeWidth={2}
        mask={`url(#${maskId})`}
      />
    </Svg>
  );
};


// Shield icon (YOUR EXACT SVG)
const ShieldIcon = ({ color = '#000048', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 17 22" fill="none" preserveAspectRatio="xMidYMid meet">
    <Path
      d="M10.2968 8.52505L7.24994 11.5719L6.00385 10.3248C5.80951 10.1343 5.49841 10.1343 5.30402 10.3248C5.10681 10.5181 5.10364 10.8346 5.29688 11.0318L6.89648 12.6324C6.99023 12.7262 7.11737 12.7789 7.25 12.7789C7.38257 12.7789 7.5097 12.7262 7.60345 12.6324L11.011 9.22488C11.2042 9.02768 11.201 8.71109 11.0038 8.51785C10.8066 8.32462 10.4901 8.32779 10.2968 8.52505ZM16.3898 2.33212C16.3333 2.06174 16.0682 1.8884 15.7979 1.94492C13.3286 2.46634 10.7538 1.93979 8.6875 0.490814C8.51526 0.36972 8.28552 0.36972 8.11328 0.490814C6.04706 1.93985 3.47217 2.46646 1.00293 1.94492C0.96936 1.9379 0.935181 1.93436 0.900879 1.93436C0.624634 1.93417 0.400574 2.15793 0.400391 2.43417V10.4527C0.402039 13.3889 1.81561 16.1453 4.19922 17.86L8.10938 20.6637C8.19415 20.7247 8.29596 20.7575 8.40039 20.7574C8.50482 20.7575 8.60663 20.7248 8.69141 20.6637L12.6016 17.86C14.9852 16.1453 16.3987 13.3889 16.4004 10.4527V2.43417C16.4004 2.39987 16.3969 2.36569 16.3898 2.33212ZM15.4004 10.4527C15.3993 13.0667 14.1412 15.5207 12.0195 17.0475L8.40039 19.6422L4.78125 17.0475C2.65955 15.5206 1.40149 13.0667 1.40039 10.4527V3.03183C3.84216 3.39658 6.33289 2.85281 8.40039 1.50351C10.4681 2.85245 12.9587 3.39621 15.4004 3.03183V10.4527Z"
      fill={color}
      stroke={color}
      strokeWidth={0.8}
    />
  </Svg>
);

// Users (your existing one)
const UsersIcon = ({ color = '#000048', size = 20, strokeWidth = 1.6 }) => (
  <Svg width={size} height={size} viewBox="0 0 23 19" fill="none" preserveAspectRatio="xMidYMid meet">
    <Path
      d="M11.1758 6.8996C12.9128 6.8996 14.3262 8.31259 14.3262 10.05C14.3262 11.04 13.8647 11.9211 13.1494 12.4982C14.1481 12.8631 15.0145 13.4988 15.6689 14.3117C15.853 14.195 16.0442 14.0874 16.2451 13.9982C15.8049 13.5654 15.5254 12.9678 15.5254 12.3C15.5254 10.9764 16.6022 9.8996 17.9258 9.8996C19.2493 9.8996 20.3262 10.9764 20.3262 12.3C20.3262 12.9693 20.0444 13.5671 19.6025 14.0002C21.1269 14.6535 22.2012 16.1632 22.2012 17.925C22.2012 18.2151 21.9659 18.4504 21.6758 18.4504H12.6758C12.3857 18.4504 12.1504 18.2151 12.1504 17.925C12.1504 17.6349 12.3857 17.3996 12.6758 17.3996H15.8711C15.6088 15.0406 13.6035 13.2004 11.1758 13.2004C8.74811 13.2004 6.74273 15.0406 6.48047 17.3996H9.67578C9.9659 17.3996 10.2012 17.6349 10.2012 17.925C10.2012 18.2151 9.9659 18.4504 9.67578 18.4504H0.675781C0.385663 18.4504 0.150391 18.2151 0.150391 17.925C0.150391 16.1635 1.22415 14.6537 2.74805 14.0002C2.30643 13.5672 2.02539 12.9691 2.02539 12.3C2.02539 10.9764 3.10222 9.8996 4.42578 9.8996C5.74935 9.8996 6.82617 10.9764 6.82617 12.3C6.82617 12.9681 6.54596 13.5653 6.10547 13.9982C6.30647 14.0874 6.49753 14.195 6.68164 14.3117C7.33599 13.4988 8.20267 12.8632 9.20117 12.4982C8.48622 11.9211 8.02539 11.0397 8.02539 10.05C8.02539 8.31259 9.43878 6.8996 11.1758 6.8996Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Help icon (YOUR EXACT SVG)
// Help icon (YOUR EXACT SVG)
const HelpIcon = ({ color = '#000048', size = 20, strokeWidth = 1.6 }) => (
  <Svg width={size} height={size} viewBox="0 0 18 19" fill="none" preserveAspectRatio="xMidYMid meet">
    <Path
      d="M8.99805 1.5C9.13062 1.5 9.2578 1.55276 9.35156 1.64648C9.44533 1.74025 9.49805 1.86739 9.49805 2C9.49805 2.13261 9.44533 2.25975 9.35156 2.35352C9.2578 2.44724 9.13062 2.5 8.99805 2.5H8.99707C7.51674 2.50411 6.07036 2.94612 4.84082 3.77051C3.6113 4.5949 2.65285 5.76495 2.08691 7.13281C1.52113 8.50047 1.37263 10.0052 1.66016 11.457C1.94775 12.9088 2.65889 14.2433 3.70312 15.292V15.293C3.79614 15.3865 3.84851 15.5126 3.84863 15.6445C3.84863 15.7766 3.79625 15.9034 3.70312 15.9971L3.05469 16.6465L2.20117 17.5H8.99805C10.828 17.5008 12.5953 16.8326 13.9668 15.6211C15.3382 14.4095 16.2194 12.7379 16.4443 10.9219L16.4434 10.9209C16.4618 10.7916 16.5311 10.6744 16.6348 10.5947C16.7395 10.5143 16.872 10.4793 17.0029 10.4961"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Logout icon (YOUR SVG)
const LogoutIcon = ({ color = '#000048', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 19 19" fill="none" preserveAspectRatio="xMidYMid meet">
    <Path
      d="M8.5 17.8887V18H2.11133C1.92645 18 1.76639 17.9639 1.61914 17.8887H8.5ZM1.11133 17.3809C1.03606 17.2336 1 17.0735 1 16.8887V2.11133C1 1.92613 1.03579 1.76562 1.11133 1.61816V17.3809ZM17.585 9.5L13.7402 13.3438L13.666 13.2656L15.6699 11.2627L17.377 9.55566H7.33301V9.44434H17.377L13.666 5.7334L13.7402 5.65527L17.585 9.5ZM2.11133 1H8.5V1.11133H1.61914C1.73527 1.05197 1.859 1.01668 1.99707 1.00488L2.11133 1Z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

/** Row Component */
const MenuRow = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.row} activeOpacity={0.75} onPress={onPress}>
    <View style={styles.rowLeft}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default function MyAccountScreen({ userData, onBack, onLogout }) {
  const name = userData?.name || userData?.firstName || 'User';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0B0742', '#2D2A86']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitleLeft}>My Account</Text>
      </LinearGradient>

      {/* ✅ SAME OVERLAPPED WHITE CARD LAYOUT AS EnterPinScreen */}
      <View style={styles.sheetWrap}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileBox}>
            <View style={styles.avatarCircle}>
              <Image
                source={require('../../assets/ProfileImage.png')}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.name}>{name}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.menu}>
            <MenuRow icon={<LockIcon size={20} />} label="Account & Security" onPress={() => {}} />
            <MenuRow icon={<SettingsIcon size={20} />} label="App Settings" onPress={() => {}} />
            <MenuRow icon={<ShieldIcon size={20} />} label="Privacy Policy" onPress={() => {}} />
            <MenuRow icon={<UsersIcon size={20} />} label="Refer & Earn" onPress={() => {}} />
            <MenuRow icon={<HelpIcon size={20} />} label="Help center" onPress={() => {}} />
            <MenuRow icon={<LogoutIcon size={20} />} label="Logout" onPress={onLogout || (() => {})} />
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      {/* ✅ Bottom pill like EnterPinScreen */}
      <View style={styles.footerPill} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    height: HEADER_HEIGHT,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },

  topBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
  },

  // ✅ Match "blue card layout" feel (button style similar to EnterPin header)
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitleLeft: {
    position: 'absolute',
    top: 70,
    left: 10,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    maxWidth: MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
    fontFamily: 'Gallix, sans-serif',
  },

  // ✅ OVERLAPPED CARD (same as EnterPinScreen card)
  sheetWrap: {
    position: 'absolute',
    top: HEADER_HEIGHT - CARD_OVERLAP,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  profileBox: {
    alignItems: 'center',
    gap: 13,
    maxWidth: MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },

  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },

  avatar: {
    width: '100%',
    height: '100%',
  },

  name: {
    color: '#000048',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Gallix, sans-serif',
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#848484',
    opacity: 0.6,
    marginTop: 6,
  },

  menu: {
    marginTop: 20,
    gap: 20,
    maxWidth: MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  rowIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000048',
    letterSpacing: -0.4,
    fontFamily: 'Gallix, sans-serif',
  },

  // ✅ Bottom pill (same visual touch as EnterPinScreen)
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
