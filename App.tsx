import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  NativeEventEmitter,
  NativeModules,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BatteryCard from './src/components/BatteryCard';
import DeviceInfoCard from './src/components/DeviceInfoCard';

const { BatteryModule } = NativeModules;

type BatteryInfo = {
  percentage: number;
  isCharging: boolean;
  temperature: number;
};

export default function App() {
  const [battery, setBattery] = useState<BatteryInfo | null>(null);

  useEffect(() => {
    const emitter = new NativeEventEmitter(BatteryModule);

    const sub = emitter.addListener(
      'BatteryInfoChanged',
      (data: BatteryInfo) => {
        setBattery(data);
      }
    );

    BatteryModule.startListening();

    return () => {
      sub.remove();
      BatteryModule.stopListening();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" hidden={true} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Device Report</Text>
      </View>

      <View style={styles.content}>
        {battery ? (
          <BatteryCard
            level={battery.percentage}
            isCharging={battery.isCharging}
            temperature={battery.temperature}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}

        <DeviceInfoCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#888',
    fontSize: 16,
  },
});
