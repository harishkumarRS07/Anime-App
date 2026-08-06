import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
// Reverting to FontAwesome5 as it correctly mapped the crown prior to this update
import { FontAwesome5 } from '@expo/vector-icons';

const COLORS = {
  background: '#000000',
  primary: '#ff6600',
  primaryLight: '#ff9933',
  secondary: '#ffffff',
  glow: 'rgba(255, 102, 0, 0.8)',
};

const PARTICLES = 14;
const RADIUS = 140;

const GlowingParticle = ({ index }: { index: number }) => {
  const angle = (index * 2 * Math.PI) / PARTICLES;
  
  const startX = Math.cos(angle) * RADIUS;
  const startY = Math.sin(angle) * RADIUS;

  const x = useSharedValue(startX);
  const y = useSharedValue(startY);
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0); 

  useEffect(() => {
    // Breathing scale for active energy
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800 }),
        withTiming(0.7, { duration: 800 })
      ),
      -1
    );

    // 800ms: Particles fade in AFTER the crown has appeared
    // We use setTimeout instead of withDelay to prevent complex native bridging crashes
    const timer1 = setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900 }),
          withTiming(0.4, { duration: 900 })
        ),
        -1
      );
    }, 800);

    // 2600ms: Energy collapse to center
    const timer2 = setTimeout(() => {
      x.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) });
      y.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) });
    }, 2600);

    // 3200ms: EXPLOSION BURST
    const timer3 = setTimeout(() => {
      x.value = withTiming(Math.cos(angle) * 200, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });

      y.value = withTiming(Math.sin(angle) * 200, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });

      opacity.value = withTiming(0, { duration: 350 });
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style]} />;
};

export default function SplashScreen() {
  const crownTranslateY = useSharedValue(38);
  const crownScale = useSharedValue(0.5);
  const crownOpacity = useSharedValue(0);
  
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  
  const circleRotation = useSharedValue(0);
  
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(15);

  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // Stable Global Rotation
    circleRotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    // 0ms: Crown appears cleanly
    crownOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    crownScale.value = withSequence(
      withTiming(1.2, { duration: 500, easing: Easing.out(Easing.exp) }),
      withSpring(1, { damping: 10 })
    );

    // 1800ms: AniKings Logo pops out
    const timeout1 = setTimeout(() => {
      logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
      logoScale.value = withSpring(1, { damping: 12 });

      subtitleOpacity.value = withTiming(0.8, { duration: 800 });
      subtitleTranslateY.value = withSpring(0, { damping: 12 });

      // Crown elegantly slides UP
      crownTranslateY.value = withSpring(0, { damping: 12 });
    }, 1800);

    // 3600ms: Final Netflix exit
    const timeout2 = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 600 });
      logoScale.value = withTiming(3.5, { duration: 600, easing: Easing.in(Easing.exp) });
      crownScale.value = withTiming(3.5, { duration: 600, easing: Easing.in(Easing.exp) });
    }, 3600);

    const timeout3 = setTimeout(() => {
      runOnJS(navigateToHome)();
    }, 4200);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  const navigateToHome = () => {
    router.replace('/(tabs)');
  };

  const crownStyle = useAnimatedStyle(() => ({
    opacity: crownOpacity.value,
    transform: [
      { translateY: crownTranslateY.value },
      { scale: crownScale.value }
    ],
    marginBottom: 8, 
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${circleRotation.value}deg` }
    ],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      
      {/* Dynamic Particle Orbit */}
      <Animated.View style={[styles.circleContainer, circleStyle]}>
        {Array.from({ length: PARTICLES }).map((_, i) => (
          <GlowingParticle key={`particle-${i}`} index={i} />
        ))}
      </Animated.View>

      <View style={styles.centerBox}>
        {/* The FontAwesome5 Crown is universally supported */}
        <Animated.View style={[styles.crownContainer, crownStyle]}>
           <FontAwesome5 name="crown" size={54} color={COLORS.primaryLight} />
        </Animated.View>

        {/* AniKings Typography */}
        <Animated.View style={logoStyle}>
          <Text style={styles.logoText}>
            <Text style={{ color: COLORS.primaryLight }}>Ani</Text>Kings
          </Text>
          
          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Enter the Anime World
          </Animated.Text>
        </Animated.View>
      </View>
      
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBox: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  crownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownGlow: {
    textShadowColor: COLORS.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  logoText: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#ffffff',
    textAlign: 'center',
  },
  textGlow: {
    textShadowColor: COLORS.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  }
});
