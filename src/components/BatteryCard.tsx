import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
    level: number | null;
    isCharging: boolean;
    temperature: number;
    voltage: number;
};

export default function BatteryCard({ level, isCharging, temperature, voltage }: Props) {
    const getBatteryColor = () => {
        if (level === null) return '#757575'; // Grey for unknown
        if (level <= 20) return '#FF5252'; // Red
        if (level <= 50) return '#FFC107'; // Amber
        return '#4CAF50'; // Green
    };

    const getStatusText = () => {
        if (level === null) return 'Reading...';
        if (isCharging) return 'Charging ⚡️';
        if (level === 100) return 'Fully Charged';
        return 'Discharging';
    };

    const batteryColor = getBatteryColor();

    return (
        <View style={[styles.card, { shadowColor: batteryColor }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Battery Health</Text>
                <View style={[styles.statusBadge, isCharging && styles.chargingBadge]}>
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
            </View>

            <View style={styles.mainInfo}>
                <View style={styles.levelContainer}>
                    <Text style={[styles.levelText, { color: batteryColor }]}>
                        {level !== null ? `${Math.round(level)}%` : '--'}
                    </Text>
                    <View style={styles.batteryIconContainer}>
                        <View style={[
                            styles.batteryFill,
                            {
                                width: level ? `${level}%` : '0%',
                                backgroundColor: batteryColor
                            }
                        ]} />
                    </View>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Temperature</Text>
                    <Text style={styles.detailValue}>{temperature.toFixed(1)}°C</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Voltage</Text>
                    <Text style={styles.detailValue}>{voltage.toFixed(2)} V</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 24,
        borderRadius: 24,
        backgroundColor: '#1E1E1E',
        marginVertical: 16,
        width: width - 40,
        alignSelf: 'center',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E0E0E0',
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#333',
    },
    chargingBadge: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.5)',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#E0E0E0',
    },
    mainInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    levelContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    levelText: {
        fontSize: 64,
        fontWeight: 'bold',
        marginBottom: 10,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    batteryIconContainer: {
        width: 60,
        height: 24,
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 6,
        padding: 2,
        position: 'relative',
        marginTop: 8,
    },
    batteryFill: {
        height: '100%',
        borderRadius: 3,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#2C2C2C',
        borderRadius: 16,
        padding: 16,
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#9E9E9E',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
