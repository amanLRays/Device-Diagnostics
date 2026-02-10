import { useEffect, useState } from 'react';
import { startBatteryListener } from '../native/Battery';

export function useBattery() {
    const [battery, setBattery] = useState<number | null>(null);

    useEffect(() => {
        const stop = startBatteryListener(setBattery);
        return stop;
    }, []);

    return battery;
}
