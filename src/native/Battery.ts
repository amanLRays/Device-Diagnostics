import { NativeModules, NativeEventEmitter } from 'react-native';

const { BatteryModule } = NativeModules;
const emitter = new NativeEventEmitter(BatteryModule);

export function startBatteryListener(
    callback: (level: number) => void
) {
    const sub = emitter.addListener(
        'BatteryLevelChanged',
        callback
    );

    BatteryModule.startListening();

    return () => {
        sub.remove();
        BatteryModule.stopListening();
    };
}
