/**
 * MoodGrid (§5.5 — mood_grid)
 * ────────────────────────────
 * - 3×3 grid of Pip face illustrations (9 moods)
 * - Each cell: 80×80px rounded square, face + label below
 * - Selected: glacier 2px border, ice tint bg, slight lift
 */
import { Colors, Fonts, FontSizes, Radii, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const MOODS = [
    ['Joyful', 'Calm', 'Hopeful'],
    ['Tired', 'Neutral', 'Restless'],
    ['Sad', 'Anxious', 'Irritable'],
];

// Simple stylized face marks (placeholder for Pip illustrations)
const MOOD_FACES: Record<string, string> = {
    Joyful: '◠▽◠',
    Calm: '–‿–',
    Hopeful: '◠‿◠',
    Tired: '–_–',
    Neutral: '◦_◦',
    Restless: '◉_◉',
    Sad: '·_·',
    Anxious: '◠_◠',
    Irritable: '>_<',
};

interface Props {
    value: string | null;
    onChange: (val: string) => void;
}

export default function MoodGrid({ value, onChange }: Props) {
    return (
        <View style={styles.container}>
            {MOODS.map((row, ri) => (
                <View key={ri} style={styles.row}>
                    {row.map((mood) => {
                        const isSelected = value === mood;
                        return (
                            <Pressable
                                key={mood}
                                style={[styles.cell, isSelected && styles.cellSelected]}
                                onPress={() => onChange(mood)}
                            >
                                {/* Pip face placeholder */}
                                <View style={[styles.faceCircle, isSelected && styles.faceCircleSelected]}>
                                    <Text style={[styles.face, isSelected && styles.faceSelected]}>
                                        {MOOD_FACES[mood]}
                                    </Text>
                                </View>
                                <Text style={[styles.label, isSelected && styles.labelSelected]}>{mood}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Spacing.sm,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.sm,
        justifyContent: 'center',
    },
    // §5.5: 80×80px rounded square
    cell: {
        width: 100,
        height: 100,
        borderRadius: Radii.lg, // 20px
        backgroundColor: Colors.snow,
        alignItems: 'center',
        justifyContent: 'center',
        // §5.5: glacier 2px border on select
        borderWidth: 2,
        borderColor: 'transparent',
        ...Shadows.card,
        gap: Spacing.xs,
    },
    // §5.5: border glacier 2px, ice tint bg, slight lift
    cellSelected: {
        borderColor: Colors.glacier,
        backgroundColor: Colors.ice,
        transform: [{ scale: 1.03 }],
    },
    faceCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.fog,
        alignItems: 'center',
        justifyContent: 'center',
    },
    faceCircleSelected: {
        backgroundColor: 'rgba(91, 163, 191, 0.15)',
    },
    face: {
        fontFamily: Fonts.mono,
        fontSize: 13,
        color: Colors.ink,
    },
    faceSelected: {
        color: Colors.glacier,
        fontFamily: Fonts.monoMedium,
    },
    // §5.5: label below
    label: {
        fontFamily: Fonts.mono,
        fontSize: FontSizes.xs,
        color: Colors.slate,
    },
    labelSelected: {
        color: Colors.glacier,
        fontFamily: Fonts.monoMedium,
    },
});
