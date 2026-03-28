/**
 * YesNo (§5.5 — yes_no)
 * ──────────────────────
 * - Two full-width stacked cards (120px each), large rounded corners
 * - "Yes" with moss tint on select
 * - "No" with blush tint on select
 */
import { Colors, Fonts, FontSizes, Radii, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
    value: boolean | null;
    onChange: (val: boolean) => void;
}

export default function YesNo({ value, onChange }: Props) {
    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.card, value === true && styles.cardYes]}
                onPress={() => onChange(true)}
            >
                <Text style={[styles.checkIcon, value === true && styles.checkIconYes]}>✓</Text>
                <Text style={[styles.label, value === true && styles.labelYes]}>Yes</Text>
            </Pressable>

            <Pressable
                style={[styles.card, value === false && styles.cardNo]}
                onPress={() => onChange(false)}
            >
                <Text style={[styles.checkIcon, value === false && styles.checkIconNo]}>✗</Text>
                <Text style={[styles.label, value === false && styles.labelNo]}>No</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Spacing.md,
        width: '100%',
    },
    // §5.5: 120px each, large rounded corners
    card: {
        backgroundColor: Colors.snow,
        borderRadius: Radii.lg, // 20px
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: Spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
        ...Shadows.card,
    },
    // §5.5: moss tint on select
    cardYes: {
        borderColor: Colors.moss,
        backgroundColor: 'rgba(107, 143, 113, 0.08)',
    },
    // §5.5: blush tint on select
    cardNo: {
        borderColor: Colors.blush,
        backgroundColor: 'rgba(212, 120, 138, 0.08)',
    },
    checkIcon: {
        fontSize: 28,
        color: Colors.slate,
    },
    checkIconYes: {
        color: Colors.moss,
    },
    checkIconNo: {
        color: Colors.blush,
    },
    label: {
        fontFamily: Fonts.displayBold,
        fontSize: FontSizes.lg, // 24px
        color: Colors.ink,
    },
    labelYes: {
        color: Colors.moss,
    },
    labelNo: {
        color: Colors.blush,
    },
});
