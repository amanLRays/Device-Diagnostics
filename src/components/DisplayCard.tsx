import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, NativeModules, Platform, Dimensions } from 'react-native';

const { DisplayModule } = NativeModules;
const { width } = Dimensions.get('window');

type DisplayInfo = {
    brightness: number;
    maxBrightness: number;
    width: number;
    height: number;
    densityDpi: number;
    density: number;
    screenSize: number;
    refreshRate: number;
};

const DisplayCard = () => {
    const [display, setDisplay] = useState<DisplayInfo | null>(null);

    useEffect(() => {
        if (Platform.OS === 'android') {
            const fetchData = async () => {
                try {
                    const data = await DisplayModule.getDisplayInfo();
                    setDisplay(data);
                } catch (e) {
                    console.error('Failed to fetch display data', e);
                }
            };

            fetchData();
            // Refresh every 5 seconds to update brightness
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    if (!display) {
        return (
            <View style={styles.card}>
                <Text style={styles.loadingText}>Loading Display Data...</Text>
            </View>
        );
    }

    const brightnessPercent = Math.round((display.brightness / display.maxBrightness) * 100);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Display</Text>

            {/* Brightness */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Brightness</Text>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${brightnessPercent}%` }]} />
                    </View>
                    <Text style={styles.percentText}>{brightnessPercent}%</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Resolution</Text>
                    <Text style={styles.statValue}>{display.width} × {display.height}</Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>DPI</Text>
                    <Text style={styles.statValue}>{display.densityDpi}</Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Screen Size</Text>
                    <Text style={styles.statValue}>{display.screenSize.toFixed(1)}"</Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Refresh Rate</Text>
                    <Text style={styles.statValue}>{display.refreshRate.toFixed(0)} Hz</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 16,
    },
    loadingText: {
        color: '#888',
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#BBB',
        marginBottom: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    progressBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFC107',
        borderRadius: 4,
    },
    percentText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
        minWidth: 40,
        textAlign: 'right',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statItem: {
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        padding: 12,
        width: (width - 72) / 2, // 2 columns with gaps
        alignItems: 'center',
    },
    statLabel: {
        color: '#BBB',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DisplayCard;
