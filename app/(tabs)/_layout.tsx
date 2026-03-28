import { Colors, FontSizes } from '@/constants/theme';
import { Redirect, Tabs } from 'expo-router';
import { Clock, Home, Settings } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useSupabase } from '@/hooks/useSupabase';

function TabIcon({ icon: Icon, label, focused }: { icon: any; label: string; focused: boolean }) {
    return (
        <View style={styles.tabItem}>
            <Icon
                size={22}
                color={focused ? Colors.glacier : Colors.slate}
                strokeWidth={focused ? 2.5 : 2}
            />
            <Text style={[
                styles.tabLabel,
                { color: focused ? Colors.glacier : Colors.slate }
            ]}>
                {label}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
    const { session, loadingSession } = useSupabase();

    if (loadingSession) {
        return null; // Mount blank while authenticating to prevent flash
    }

    if (!session) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon icon={Home} label="Home" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon icon={Clock} label="History" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon icon={Settings} label="Settings" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.snow,
        borderTopWidth: 1,
        borderTopColor: 'rgba(28, 43, 58, 0.06)',
        height: 88,
        paddingTop: 8,
        paddingBottom: 28,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    tabLabel: {
        fontFamily: 'DMMono_500Medium',
        fontSize: FontSizes.xs,
        letterSpacing: 0.5,
    },
});
