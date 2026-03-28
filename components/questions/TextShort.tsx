/**
 * TextShort (§5.5 — text_short)
 * ──────────────────────────────
 * - Large multiline text input (auto-grows)
 * - Character counter bottom-right (DM Mono, slate)
 * - Keyboard pushes content up gracefully
 */
import { Colors, Fonts, FontSizes, Radii, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const MAX_CHARS = 280;

interface Props {
    value: string;
    onChange: (val: string) => void;
}

export default function TextShort({ value, onChange }: Props) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => {
                    if (text.length <= MAX_CHARS) onChange(text);
                }}
                placeholder="Type your response here..."
                placeholderTextColor={Colors.slate}
                multiline
                textAlignVertical="top"
            />
            {/* §5.5: Character counter (DM Mono, slate) */}
            <Text style={styles.counter}>
                {value.length}/{MAX_CHARS}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        backgroundColor: Colors.snow,
        borderRadius: Radii.lg, // 20px
        padding: Spacing.lg,
        minHeight: 140,
        fontFamily: Fonts.body,
        fontSize: FontSizes.base, // 16px minimum
        color: Colors.ink,
        lineHeight: FontSizes.base * 1.5,
        ...Shadows.card,
    },
    counter: {
        fontFamily: Fonts.mono,
        fontSize: FontSizes.xs,
        color: Colors.slate,
        textAlign: 'right',
        marginTop: Spacing.sm,
    },
});
