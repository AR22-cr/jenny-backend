/**
 * Pip Placeholder Component
 * ─────────────────────────
 * A styled dummy placeholder for the Pip mascot.
 * Will be replaced with actual Pip illustrations later.
 *
 * Assets folder: /assets/images/pip/
 * Future Pip states: happy, curious, sleepy, celebratory, concerned, neutral
 */
import { Colors, Fonts, FontSizes, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PipProps {
    size?: number;
    mood?: 'happy' | 'curious' | 'sleepy' | 'celebratory' | 'concerned' | 'neutral';
    showLabel?: boolean;
}

const MOOD_FACES: Record<string, string> = {
    happy: '◠‿◠',
    curious: '◉_◉',
    sleepy: '–‿–',
    celebratory: '◠▽◠',
    concerned: '◠_◠',
    neutral: '◦_◦',
};

export default function Pip({ size = 80, mood = 'happy', showLabel = false }: PipProps) {
    const containerSize = size;
    const innerSize = size * 0.7;

    return (
        <View style={[styles.container, { width: containerSize, height: containerSize, borderRadius: containerSize / 2 }]}>
            {/* Penguin-ish shape */}
            <View style={[styles.body, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}>
                {/* Belly */}
                <View style={[styles.belly, { width: innerSize * 0.6, height: innerSize * 0.7, borderRadius: innerSize * 0.3 }]}>
                    <Text style={[styles.face, { fontSize: size * 0.15 }]}>{MOOD_FACES[mood]}</Text>
                </View>
                {/* Beak */}
                <View style={styles.beak} />
            </View>
            {showLabel && (
                <Text style={styles.label}>Pip</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.ice,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        backgroundColor: Colors.ink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    belly: {
        backgroundColor: Colors.snow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    face: {
        fontFamily: Fonts.mono,
        color: Colors.ink,
        marginTop: 2,
    },
    beak: {
        position: 'absolute',
        bottom: '20%',
        width: 8,
        height: 5,
        backgroundColor: Colors.aurora,
        borderRadius: 4,
    },
    label: {
        fontFamily: Fonts.monoMedium,
        fontSize: FontSizes.xs,
        color: Colors.slate,
        marginTop: Spacing.xs,
        position: 'absolute',
        bottom: -20,
    },
});
