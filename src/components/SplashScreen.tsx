import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// NeverSoft Services boot splash — retro CRT terminal.
// Palette: red + near-black main, white + gold accents. Shows once at launch,
// drives a real 0 -> 100% boot naming the apps, then fades out and hands off.

const RED = '#ff1f2e';
const RED_DEEP = '#b3121c';
const BLACK = '#070405';
const PANEL = '#0a0708';
const WHITE = '#f6f2ec';
const GOLD = '#e8c268';
const MUTED = '#7a5a5c';

const MONO = Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' });

// Boot sequence — each stage references NeverSoft Services / apps loading.
const STAGES: { at: number; label: string; sub: string }[] = [
  { at: 0, label: 'MOUNTING CORE MODULES', sub: '(NeverSoft Core Services)' },
  { at: 14, label: 'LOADING CROSS TRACE', sub: '(data cross-reference engine)' },
  { at: 30, label: 'LOADING GO FIND ME', sub: '(OSINT toolkit online)' },
  { at: 46, label: 'LOADING SPOTLIGHT', sub: '(all-device search index)' },
  { at: 62, label: 'LOADING COLOUR CEAUXDID', sub: '(LLM agent container)' },
  { at: 78, label: 'SYNCING APP STORE', sub: '(NeverSoft App Store)' },
  { at: 90, label: 'VERIFYING SESSION', sub: '(secure // authorized)' },
  { at: 100, label: 'SERVICES READY', sub: '(welcome to NeverSoft)' },
];

function currentStage(p: number) {
  let stage = STAGES[0];
  for (let i = 0; i < STAGES.length; i++) {
    if (p >= STAGES[i].at) {
      stage = STAGES[i];
    }
  }
  return stage;
}

const SplashScreen: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const flicker = useRef(new Animated.Value(0.5)).current;
  const chip = useRef(new Animated.Value(1)).current;
  const progressRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const fadeOut = () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(() => {
        if (mounted) {
          setHidden(true);
        }
      });
    };

    const tick = () => {
      if (!mounted) {
        return;
      }
      if (progressRef.current >= 100) {
        setPct(100);
        setReady(true);
        timerRef.current = setTimeout(fadeOut, 320);
        return;
      }
      // Uneven, believable boot cadence: mostly steady with occasional stalls.
      let step = Math.random() * 2.4 + 0.5;
      if (Math.random() < 0.08) {
        step = 0.1;
      }
      progressRef.current = Math.min(100, progressRef.current + step);
      setPct(Math.round(progressRef.current));
      const delay = 22 + Math.random() * 42;
      timerRef.current = setTimeout(tick, delay);
    };

    const start = (reduced: boolean) => {
      reducedRef.current = reduced;
      if (!reduced) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(flicker, { toValue: 0.85, duration: 90, useNativeDriver: true }),
            Animated.timing(flicker, { toValue: 0.35, duration: 90, useNativeDriver: true }),
            Animated.timing(flicker, { toValue: 0.5, duration: 900, useNativeDriver: true }),
          ]),
        ).start();
        Animated.loop(
          Animated.sequence([
            Animated.timing(chip, { toValue: 0.25, duration: 500, useNativeDriver: true }),
            Animated.timing(chip, { toValue: 1, duration: 500, useNativeDriver: true }),
          ]),
        ).start();
      }
      timerRef.current = setTimeout(tick, 260);
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then(reduced => {
        if (mounted) {
          start(!!reduced);
        }
      })
      .catch(() => {
        if (mounted) {
          start(false);
        }
      });

    return () => {
      mounted = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) {
    return null;
  }

  const stage = currentStage(pct);
  const { height: screenH } = Dimensions.get('window');
  const scanCount = Math.min(220, Math.max(60, Math.floor(screenH / 4)));
  const scanlines = [];
  for (let i = 0; i < scanCount; i++) {
    scanlines.push(<View key={i} style={styles.scanline} />);
  }

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
      {/* faint red CRT flicker */}
      <Animated.View style={[styles.flicker, { opacity: flicker }]} pointerEvents="none" />

      <View style={styles.terminal}>
        {/* inner thin frame */}
        <View style={styles.innerFrame} pointerEvents="none" />

        {/* gold corner brackets */}
        <View style={[styles.bracket, styles.bracketTL]} pointerEvents="none" />
        <View style={[styles.bracket, styles.bracketTR]} pointerEvents="none" />
        <View style={[styles.bracket, styles.bracketBL]} pointerEvents="none" />
        <View style={[styles.bracket, styles.bracketBR]} pointerEvents="none" />

        {/* header */}
        <View style={styles.termHead}>
          <View style={styles.glyphBox}>
            <Text style={styles.glyphPhone}>&#9742;</Text>
            <Text style={styles.glyphKanji}>通信</Text>
          </View>
          <View style={styles.headLines}>
            <Text style={styles.headLineGold}>SELECT MODULE:</Text>
            <Text style={styles.headLine}>[CORE], SYNC, VAULT</Text>
            <Text style={styles.headLine}>BUILD:11.0  REGION:US</Text>
          </View>
        </View>

        {/* initializing */}
        <View style={styles.thankyou}>
          <Text style={styles.tyText}>INITIALIZING SERVICES</Text>
          <View style={styles.tyRule} />
        </View>

        {/* wordmark with chromatic aberration */}
        <View style={styles.wordmark}>
          <View style={styles.brandWrap}>
            <Text style={[styles.brand, styles.brandRed]}>NeverSoft</Text>
            <Text style={[styles.brand, styles.brandGold]}>NeverSoft</Text>
            <Text style={[styles.brand, styles.brandWhite]}>NeverSoft</Text>
          </View>
          <Text style={styles.brandSub}>SERVICES</Text>
        </View>

        {/* mid status */}
        <View style={styles.midStatus}>
          <View style={styles.midLine}>
            <Text style={styles.midLabel}>{stage.label}</Text>
            <Animated.View style={[styles.midChip, { opacity: chip }]} />
          </View>
          <Text style={styles.midSub}>{stage.sub}</Text>
        </View>

        {/* footer / loader */}
        <View style={styles.termFoot}>
          <Text style={styles.est}>est.2011</Text>

          <View style={styles.footCenter}>
            <View style={styles.loadingLine}>
              <Text style={styles.loadingText}>{ready ? 'READY' : 'LOADING'}</Text>
              <Text style={styles.dots}>...</Text>
              <Text style={styles.pct}>{pct}%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct}%` }]}>
                <View style={styles.stripes} pointerEvents="none">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <View key={i} style={styles.stripe} />
                  ))}
                </View>
                <View style={styles.barEdge} pointerEvents="none" />
              </View>
            </View>
          </View>

          <View style={styles.logoBox}>
            <Text style={styles.lbPhone}>&#9742;</Text>
            <View>
              <Text style={styles.lbTag}>NS</Text>
              <Text style={styles.lbMark}>11</Text>
            </View>
          </View>
        </View>
      </View>

      {/* scanlines + vignette overlay (rendered last, on top) */}
      <View style={styles.scanlineOverlay} pointerEvents="none">
        {scanlines}
      </View>
      <View style={styles.vignette} pointerEvents="none" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 999,
    elevation: 24,
  },
  flicker: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,31,46,0.03)',
  },
  scanlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  scanline: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 400,
    borderWidth: 220,
    borderColor: 'rgba(0,0,0,0.55)',
  },
  terminal: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: 22,
    backgroundColor: PANEL,
    borderWidth: 2,
    borderColor: RED,
    shadowColor: RED,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  innerFrame: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,31,46,0.35)',
  },
  bracket: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: GOLD,
  },
  bracketTL: { top: -3, left: -3, borderTopWidth: 3, borderLeftWidth: 3 },
  bracketTR: { top: -3, right: -3, borderTopWidth: 3, borderRightWidth: 3 },
  bracketBL: { bottom: -3, left: -3, borderBottomWidth: 3, borderLeftWidth: 3 },
  bracketBR: { bottom: -3, right: -3, borderBottomWidth: 3, borderRightWidth: 3 },
  termHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  glyphBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: RED,
    marginRight: 14,
  },
  glyphPhone: { fontFamily: MONO, fontSize: 22, color: RED, lineHeight: 26 },
  glyphKanji: { fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: GOLD },
  headLines: { flex: 1 },
  headLine: { fontFamily: MONO, fontSize: 13, letterSpacing: 0.8, color: RED, marginTop: 2 },
  headLineGold: { fontFamily: MONO, fontSize: 13, letterSpacing: 0.8, color: GOLD },
  thankyou: { marginTop: 18 },
  tyText: {
    fontFamily: MONO,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 2.4,
    color: WHITE,
  },
  tyRule: {
    marginTop: 6,
    borderTopWidth: 2,
    borderColor: RED,
    borderStyle: 'dashed',
  },
  wordmark: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  brandWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: Platform.select({ ios: 'Helvetica', android: 'sans-serif-black', default: 'System' }),
    fontWeight: '900',
    fontSize: 58,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  brandWhite: { color: WHITE },
  brandRed: { position: 'absolute', color: RED, opacity: 0.85, left: -3, top: 1 },
  brandGold: { position: 'absolute', color: GOLD, opacity: 0.55, left: 3, top: -1 },
  brandSub: {
    marginTop: 6,
    fontFamily: Platform.select({ ios: 'Helvetica', android: 'sans-serif-medium', default: 'System' }),
    fontWeight: '600',
    fontSize: 22,
    letterSpacing: 12,
    paddingLeft: 12,
    color: GOLD,
  },
  midStatus: {
    alignItems: 'center',
    marginVertical: 10,
  },
  midLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  midLabel: { fontFamily: MONO, fontSize: 13, letterSpacing: 0.8, color: WHITE, marginRight: 8 },
  midChip: {
    width: 48,
    height: 12,
    backgroundColor: RED,
  },
  midSub: { fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: MUTED, marginTop: 4 },
  termFoot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  est: { fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: GOLD, marginRight: 12 },
  footCenter: { flex: 1 },
  loadingLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 6,
  },
  loadingText: { fontFamily: MONO, fontSize: 13, letterSpacing: 1.2, color: WHITE },
  dots: { fontFamily: MONO, fontSize: 13, color: WHITE },
  pct: { fontFamily: MONO, fontSize: 13, color: GOLD, marginLeft: 8 },
  barTrack: {
    height: 18,
    borderWidth: 2,
    borderColor: RED,
    backgroundColor: 'rgba(255,31,46,0.06)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: RED,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  stripes: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    width: 600,
  },
  stripe: {
    width: 4,
    height: '100%',
    marginRight: 10,
    backgroundColor: RED_DEEP,
  },
  barEdge: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: GOLD,
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderWidth: 2,
    borderColor: GOLD,
    marginLeft: 12,
  },
  lbPhone: { fontFamily: MONO, fontSize: 18, color: RED, marginRight: 5 },
  lbTag: { fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: GOLD },
  lbMark: { fontFamily: MONO, fontSize: 10, color: WHITE },
});

export default SplashScreen;
