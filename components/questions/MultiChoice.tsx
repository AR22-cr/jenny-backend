/**
 * MultiChoice (§5.5 — multi_choice)
 * ──────────────────────────────────
 * - Vertical list of option pills (56px each, full-width)
 * - Tap selects one (glacier border + light glacier bg fill)
 * - Options: 12px rounded corners, Lora 17px text
 */
import { Colors, Fonts, Radii, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
    value: string | null;
    onChange: (val: string) => void;
    options: string[];
}

export default function MultiChoice({ value, onChange, options }: Props) {
    return (
        <View style={styles.container}>
            {options.map((option) => {
                const isSelected = value === option;
                return (
                    <Pressable
                        key={option}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => onChange(isSelected ? '' : option)}
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
    // §5.5: 56px each, full-width, 12px rounded corners
    pill: {
        backgroundColor: Colors.snow,
        borderRadius: Radii.md, // 12px
        height: 56,
        paddingHorizontal: Spacing.lg,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...Shadows.card,
    },
    // §5.5: glacier border + light glacier bg fill
    pillSelected: {
        borderColor: Colors.glacier,
        backgroundColor: 'rgba(91, 163, 191, 0.06)',
    },
    // §5.5: Lora 17px
    pillText: {
        fontFamily: Fonts.body,
        fontSize: 17,
        color: Colors.ink,
    },
    pillTextSelected: {
        color: Colors.glacier,
    },
});
