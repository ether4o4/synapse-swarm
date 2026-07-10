import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

const SplashScreen: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setHidden(true));
    }, 800);
    return () => clearTimeout(timer);
  }, [opacity]);

  if (hidden) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
      <View style={styles.badge}>
        <Text style={styles.badgeText}>N</Text>
      </View>
      <Text style={styles.brand}>NeverSoft Services</Text>
      <View style={styles.bar}>
        <View style={styles.barFill} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  badgeText: { fontSize: 40, fontWeight: '800', color: '#FFF' },
  brand: { fontSize: 20, fontWeight: '800', color: '#000', letterSpacing: 0.5 },
  bar: {
    width: 120,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EEE',
    marginTop: 24,
    overflow: 'hidden',
  },
  barFill: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
});

export default SplashScreen;
