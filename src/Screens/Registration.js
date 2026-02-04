import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Platform, useWindowDimensions 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Pass 'onFinish' as a prop to handle navigation to signup.js
export default function RegistrationScreen({ onFinish }) {
  const { width: windowWidth } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState('splash'); 
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => setCurrentStep('onboarding'), 3000); 
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (activeIndex < 2) {
      const nextIndex = activeIndex + 1;
      // Move to next onboarding slide programmatically
      scrollRef.current?.scrollTo({ x: nextIndex * windowWidth, animated: true });
      // Manually set the active index because scrollEnabled is false
      setActiveIndex(nextIndex);
    } else {
      // This triggers the switch to signup.js in your App.js
      if (onFinish) onFinish(); 
    }
  };

  if (currentStep === 'splash') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={{ width: windowWidth * 0.6, height: 120 }} 
          resizeMode="contain" 
        />
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
          scrollEnabled={false} // Disables manual swiping
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {[1, 2, 3].map((num) => (
            <View key={num} style={[styles.page, { width: windowWidth }]}>
              
              {/* Image Section (Flex 3) - Pushes content up */}
              <View style={styles.imageSection}>
                <Image 
                  source={
                    num === 1 ? require('../../assets/onboarding1.png') : 
                    num === 2 ? require('../../assets/onboarding2.png') : 
                    require('../../assets/onboarding3.png')
                  } 
                  style={styles.responsiveImage} 
                  resizeMode="contain" 
                />
              </View>

              {/* Text & Dots Section (Flex 2) - Grouped together */}
              <View style={styles.textSection}>
                <Text style={styles.title}>
                  {num === 1 ? "Create Your Wallet" : num === 2 ? "Add Money Easily" : "Shop & Pay Effortlessly"}
                </Text>
                <Text style={styles.description}>
                  {num === 1 ? "Sign up and secure your wallet with PIN or biometric" : 
                   num === 2 ? "Top up using Paypal, Google pay, card, or Fednow anytime." : 
                   "SmartPay lets you complete purchases with one tap—fast and secure."}
                </Text>
                
                {/* Dots moved up to stay close to description */}
                <View style={styles.dotRow}>
                  {[0, 1, 2].map(i => (
                    <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
                  ))}
                </View>
              </View>

              {/* Bottom Button Area (Flex 1) */}
              <View style={styles.buttonSection}>
                <TouchableOpacity 
                  style={[styles.nextButton, { width: windowWidth * 0.9 }]} 
                  onPress={handleNext}
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
  imageSection: {
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 20
  },
  responsiveImage: {
    width: '85%',
    height: '85%',
  },
  textSection: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'flex-start' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#000048', 
    textAlign: 'center', 
    marginBottom: 10,
    fontFamily: "Gallix , sans-serif" 
  },
  description: { 
    fontSize: 16, 
    color: '#000048', 
    textAlign: 'center', 
    opacity: 0.7, 
    lineHeight: 24,
    fontFamily: "Gallix , sans-serif" 
  },
  dotRow: { 
    flexDirection: 'row', 
    gap: 8, 
    marginTop: 25 
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  activeDot: { backgroundColor: '#000048' },
  inactiveDot: { backgroundColor: '#D9D9D9' },
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  nextButton: { 
    height: 52, 
    backgroundColor: '#000048', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '600',
    fontFamily: "Gallix , sans-serif" 
  }
});