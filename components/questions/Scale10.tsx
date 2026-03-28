/**
 * Scale10 / NRS (§5.5 — scale_10)
 * ────────────────────────────────
 * - Large centered number display (56px, Canela)
 * - Wide segmented bar (0–10), color gradient moss (0) → blush (10)
 * - Anchors: doctor-defined labels
 */
import { Colors, Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
    value: number | null;
    onChange: (val: number) => void;
    anchorLow?: string;
    anchorHigh?: string;
}

export default function Scale10({ value, onChange, anchorLow = '0', anchorHigh = '10' }: Props) {
    return (
        <View style={styles.container}>
            {/* §5.5: Large centered number (56px, Canela) */}
            <Text style={styles.bigNumber}>{value !== null ? value : '—'}</Text>

            {/* §5.5: Wide segmented bar, color gradient moss → blush */}
            <View style={styles.barRow}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                    const isSelected = value === n;
                    const fraction = n / 10;
                    // Gradient: moss (#6B8F71) → blush (#D4788A)
                    const r = Math.round(107 + (212 - 107) * fraction);
                    const g = Math.round(143 + (120 - 143) * fraction);
                    const b = Math.round(113 + (138 - 113) * fraction);
                    const filled = value !== null && n <= value;
                    const bgColor = filled ? `rgb(${r}, ${g}, ${b})` : Colors.snow;

                    return (
                        <Pressable
                            key={n}
                            style={[
                                styles.segment,
                                { backgroundColor: bgColor },
                                n === 0 && styles.segmentFirst,
                                n === 10 && styles.segmentLast,
                                isSelected && styles.segmentSelected,
                            ]}
                            onPress={() => onChange(n)}
                        >
                            <Text style={[styles.segmentNum, filled && styles.segmentNumFilled]}>
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
    // §5.5: 56px Canela
    bigNumber: {
        fontFamily: Fonts.display,
        fontSize: FontSizes['4xl'], // 56px
        color: Colors.ink,
        marginBottom: Spacing.lg,
        lineHeight: FontSizes['4xl'] * 1.1,
    },
    barRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: Spacing.md,
    },
    segment: {
        flex: 1,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'rgba(28, 43, 58, 0.04)',
    },
    segmentFirst: {
        borderTopLeftRadius: Radii.md,
        borderBottomLeftRadius: Radii.md,
    },
    segmentLast: {
        borderTopRightRadius: Radii.md,
        borderBottomRightRadius: Radii.md,
    },
    segmentSelected: {
        transform: [{ scaleY: 1.08 }],
        zIndex: 1,
    },
    segmentNum: {
        fontFamily: Fonts.mono,
        fontSize: FontSizes.xs,
        color: Colors.slate,
    },
    segmentNumFilled: {
        color: '#FFFFFF',
        fontFamily: Fonts.monoMedium,
    },
    anchors: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    anchorText: {
        fontFamily: Fonts.mono,
        fontSize: FontSizes.xs,
        color: Colors.slate,
    },
});
