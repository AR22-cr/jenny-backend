/**
 * MultiSelect (§5.5 — multi_select)
 * ──────────────────────────────────
 * - Same as multi_choice but multiple selections
 * - Selected: small glacier checkmark circle on right
 * - "Select all that apply" subtext below question in slate
 */
import { Colors, Fonts, FontSizes, Radii, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
    value: string[];
    onChange: (val: string[]) => void;
    options: string[];
}

export default function MultiSelect({ value, onChange, options }: Props) {
    const toggleOption = (option: string) => {
        if (value.includes(option)) {
            onChange(value.filter((v) => v !== option));
        } else {
            onChange([...value, option]);
        }
    };

    return (
        <View style={styles.container}>
            {/* §5.5: "Select all that apply" subtext */}
            <Text style={styles.hint}>Select all that apply</Text>
            {options.map((option) => {
                const isSelected = value.includes(option);
                return (
                    <Pressable
                        key={option}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => toggleOption(option)}
                    >
                        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                            {option}
                        </Text>
                        {/* §5.5: small glacier checkmark circle on right */}
                        {isSelected && (
                            <View style={styles.checkCircle}>
                                <Text style={styles.checkMark}>✓</Text>
                            </View>
                        )}
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
    hint: {
        fontFamily: Fonts.mono,
        fontSize: FontSizes.xs,
        color: Colors.slate,
        letterSpacing: 0.5,
        marginBottom: Spacing.xs,
    },
    // Same dimensions as multi_choice: 56px, 12px corners
    pill: {
        backgroundColor: Colors.snow,
        borderRadius: Radii.md,
        height: 56,
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...Shadows.card,
    },
    pillSelected: {
        borderColor: Colors.glacier,
        backgroundColor: 'rgba(91, 163, 191, 0.06)',
    },
    pillText: {
        fontFamily: Fonts.body,
        fontSize: 17,
        color: Colors.ink,
        flex: 1,
    },
    pillTextSelected: {
        color: Colors.glacier,
    },
    // §5.5: small glacier checkmark circle
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.glacier,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
});
