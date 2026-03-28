/**
 * Mock deck data for development.
 * A sample deck with various question types to test all components.
 */

export type QuestionType =
    | 'yes_no'
    | 'scale_5'
    | 'scale_7'
    | 'scale_10'
    | 'vas'
    | 'multi_choice'
    | 'multi_select'
    | 'frequency'
    | 'duration'
    | 'mood_grid'
    | 'text_short';

export interface QuestionConfig {
    anchorLow?: string;
    anchorHigh?: string;
    options?: string[];
    variant?: 'faces' | 'stars';
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    config: QuestionConfig;
    isRequired: boolean;
    tags: string[];
}

export interface Deck {
    id: string;
    patientId: string;
    questions: Question[];
}

export const MOCK_DECK: Deck = {
    id: 'deck-001',
    patientId: 'patient-001',
    questions: [
        {
            id: 'q1',
            text: 'How would you describe your mood today?',
            type: 'mood_grid',
            config: {},
            isRequired: true,
            tags: ['mood'],
        },
        {
            id: 'q2',
            text: 'How would you rate your pain right now?',
            type: 'scale_10',
            config: { anchorLow: 'No pain', anchorHigh: 'Worst imaginable' },
            isRequired: true,
            tags: ['pain'],
        },
        {
            id: 'q3',
            text: 'How would you rate your sleep quality?',
            type: 'scale_7',
            config: { anchorLow: 'Very poor', anchorHigh: 'Excellent' },
            isRequired: true,
            tags: ['sleep'],
        },
        {
            id: 'q4',
            text: 'Did you take your medication as prescribed today?',
            type: 'yes_no',
            config: {},
            isRequired: true,
            tags: ['medication'],
        },
        {
            id: 'q5',
            text: 'How rested do you feel today?',
            type: 'scale_5',
            config: { variant: 'faces' },
            isRequired: false,
            tags: ['sleep', 'energy'],
        },
        {
            id: 'q6',
            text: 'Where did you experience pain today?',
            type: 'multi_select',
            config: { options: ['Head', 'Neck', 'Chest', 'Back', 'Abdomen', 'Arms', 'Legs', 'Joints'] },
            isRequired: false,
            tags: ['pain'],
        },
        {
            id: 'q7',
            text: 'How often did you feel sad today?',
            type: 'frequency',
            config: {},
            isRequired: false,
            tags: ['mood'],
        },
        {
            id: 'q8',
            text: 'Is there anything you\'d like your doctor to know about today?',
            type: 'text_short',
            config: {},
            isRequired: false,
            tags: ['open'],
        },
    ],
};
