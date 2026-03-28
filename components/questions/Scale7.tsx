/**
 * Scale7 (§5.5 — scale_7)
 * ────────────────────────
 * - Horizontal segmented control: 7 numbered circles (32px each)
 * - Tapping fills glacier from left → liquid fill effect
 * - Selected circle: glacier fill, white number, slight scale-up
 */
import { Colors, Fonts, FontSizes, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
    value: number | null;
    onChange: (val: number) => void;
    anchorLow?: string;
    anchorHigh?: string;
}

export default function Scale7({ value, onChange, anchorLow = '1', anchorHigh = '7' }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                    const isSelected = value === n;
                    // §5.5: fills glacier from left to that point
                    const isFilled = value !== null && n <= value;
                    return (
                        <Pressable
                            key={n}
                            style={[
                                styles.circle,
                                isFilled && styles.circleFilled,
                                isSelected && styles.circleSelected,
                            ]}
                            onPress={() => onChange(n)}
                        >
                            <Text style={[styles.number, (isFilled || isSelected) && styles.numberFilled]}>
                                {n}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            <View style={styles.anchors}>
                <Text style={styles.anchorText}>{anchorLow}</Text>
                <Text style={styles.anchorText}>{anchorHigh}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: Spacing.md,
    },
    // §5.5: 32px each
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.snow,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(28, 43, 58, 0.06)',
    },
    // §5.5: glacier fill from left
    circleFilled: {
        backgroundColor: Colors.ice,
        borderColor: Colors.glacier,
    },
    // §5.5: glacier fill, white number, slight scale-up
    circleSelected: {
        backgroundColor: Colors.glacier,
        borderColor: Colors.glacier,
        transform: [{ scale: 1.15 }],
    },
    number: {
        fontFamily: Fonts.monoMedium,
        fontSize: FontSizes.sm,
        color: Colors.ink,
    },
    numberFilled: {
        color: '#FFFFFF',
    },
    anchors: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: Spacing.xs,
    },
    anchorText: {
        fontFamily: Fonts.mono,
        fontSize: FontSizes.xs,
        color: Colors.slate,
    },
});
