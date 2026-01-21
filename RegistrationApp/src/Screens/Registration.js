import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Platform, useWindowDimensions 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RegistrationScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState('splash'); 
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => setCurrentStep('onboarding'), 3000); 
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Use a helper to check if images exist to prevent the 500 error
  const renderOnboardingImage = (num) => {
    try {
      if (num === 1) return require('../../assets/onboarding1.png');
      if (num === 2) return require('../../assets/onboarding2.png');
      if (num === 3) return require('../../assets/onboarding3.png');
    } catch (e) {
      console.warn(`Image onboarding${num}.png missing in assets folder`);
      return null;
    }
  };

  if (currentStep === 'splash') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Image source={require('../../assets/logo.png')} style={{ width: windowWidth * 0.6, height: 120 }} resizeMode="contain" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScrollView 
          ref={scrollRef} 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / windowWidth))}
          scrollEventThrottle={16}
        >
          {[1, 2, 3].map((num) => (
            <View key={num} style={[styles.page, { width: windowWidth }]}>
              {/* Flex 3 pushes image to top half */}
              <View style={styles.imageContainer}>
                <Image 
                  source={renderOnboardingImage(num)} 
                  style={styles.flexibleImage} 
                  resizeMode="contain" 
                />
              </View>

              {/* Flex 2 keeps text and dots grouped in the middle */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  {num === 1 ? "Create Your Wallet" : num === 2 ? "Add Money Easily" : "Shop & Pay Effortlessly"}
                </Text>
                <Text style={styles.description}>
                  {num === 1 ? "Sign up and secure your wallet with PIN or biometric" : 
                   num === 2 ? "Top up using Paypal, Google pay, card, or Fednow anytime." : 
                   "SmartPay lets you complete purchases with one tap—fast and secure."}
                </Text>
                
                <View style={styles.dotRow}>
                  {[0, 1, 2].map(i => (
                    <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
                  ))}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.nextButton, { width: windowWidth * 0.9 }]} 
                  onPress={() => activeIndex < 2 ? scrollRef.current?.scrollTo({ x: (activeIndex + 1) * windowWidth, animated: true }) : console.log("Done")}
                >
                  <Text style={styles.buttonText}>{activeIndex === 2 ? "Get Started" : "Next"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  page: { flex: 1 },
  imageContainer: {
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 20
  },
  flexibleImage: {
    width: '80%',
    height: '80%',
  },
  textContainer: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: { fontSize: 30, fontWeight: '700', color: '#000048', textAlign: 'center', marginBottom: 10 },
  description: { fontSize: 16, color: '#000048', textAlign: 'center', opacity: 0.7, lineHeight: 24 },
  dotRow: { flexDirection: 'row', gap: 8, marginTop: 25 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  activeDot: { backgroundColor: '#000048' },
  inactiveDot: { backgroundColor: '#D9D9D9' },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30
  },
  nextButton: { height: 52, backgroundColor: '#000048', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' }
});