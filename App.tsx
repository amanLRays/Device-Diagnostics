import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  NativeEventEmitter,
  NativeModules,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import BatteryCard from './src/components/BatteryCard';
import DeviceInfoCard from './src/components/DeviceInfoCard';
import PerformanceCard from './src/components/PerformanceCard';
import DisplayCard from './src/components/DisplayCard';

const { BatteryModule } = NativeModules;

type BatteryInfo = {
  percentage: number;
  isCharging: boolean;
  temperature: number;
  voltage: number;
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

      <ScrollView contentContainerStyle={styles.content}>
        {battery ? (
          <BatteryCard
            level={battery.percentage}
            isCharging={battery.isCharging}
            temperature={battery.temperature}
            voltage={battery.voltage}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}

        <PerformanceCard />

        <DisplayCard />

        <DeviceInfoCard />
      </ScrollView>
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
    padding: 20,
    paddingBottom: 40,
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
