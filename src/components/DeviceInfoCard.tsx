// App.tsx or a new DeviceCard.tsx
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useDevice } from '../hooks/useDevice';

const { width } = Dimensions.get('window');

export default function DeviceInfoCard() {
    const device = useDevice();

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Device Information</Text>
            {device ? (
                <View style={styles.infoContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Brand</Text>
                        <Text style={styles.value}>{device.brand}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Model</Text>
                        <Text style={styles.value}>{device.model}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Android Ver.</Text>
                        <Text style={styles.value}>{device.androidVersion}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.loading}>Loading device info...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 24,
        borderRadius: 24,
        backgroundColor: '#1E1E1E',
        marginVertical: 10,
        width: width - 40,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E0E0E0',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    infoContainer: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#9E9E9E',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 4,
    },
    loading: {
        color: '#888',
        fontStyle: 'italic',
    }
});
