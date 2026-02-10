// src/hooks/useDevice.ts
import { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

const { DeviceModule } = NativeModules;

type DeviceInfo = {
    brand: string;
    model: string;
    androidVersion: string;
};

export function useDevice() {
    const [device, setDevice] = useState<DeviceInfo | null>(null);

    useEffect(() => {
        if (DeviceModule) {
            DeviceModule.getDeviceInfo()
                .then(setDevice)
                .catch((e: any) => console.error(e));
        } else {
            console.warn('DeviceModule is not linked. Please rebuild the app.');
            // Mock data for development if needed, or just leave null
        }
    }, []);

    return device;
}
