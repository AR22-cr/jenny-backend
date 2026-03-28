/**
 * Frequency (§5.5 — frequency)
 * ─────────────────────────────
 * - 5 vertical pills: Never / Rarely / Sometimes / Often / Always
 * - Color-coded fill intensity: white → light glacier → full glacier
 */
import { Colors, Fonts, Radii, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

interface Props {
    value: string | null;
    onChange: (val: string) => void;
}

export default function Frequency({ value, onChange }: Props) {
    return (
        <View style={styles.container}>
            {OPTIONS.map((option, i) => {
                const isSelected = value === option;
                // §5.5: intensity from white → light glacier → full glacier
                const intensity = (i + 1) / OPTIONS.length;

                return (
                    <Pressable
                        key={option}
                        style={[
                            styles.pill,
                            isSelected && [
                                styles.pillSelected,
                                { backgroundColor: `rgba(91, 163, 191, ${0.04 + intensity * 0.12})` },
                            ],
                        ]}
                        onPress={() => onChange(option)}
                    >
                        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                            {option}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Spacing.sm,
        width: '100%',
    },
    pill: {
        backgroundColor: Colors.snow,
        borderRadius: Radii.md,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...Shadows.card,
    },
    pillSelected: {
        borderColor: Colors.glacier,
    },
    pillText: {
        fontFamily: Fonts.body,
        fontSize: 17,
        color: Colors.ink,
    },
    pillTextSelected: {
        color: Colors.glacier,
        fontFamily: Fonts.bodyBold,
    },
});
