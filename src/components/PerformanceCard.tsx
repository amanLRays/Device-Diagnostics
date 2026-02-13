import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, NativeModules, Platform } from 'react-native';

const { PerformanceModule } = NativeModules;

type MemoryInfo = {
    totalMemory: number;
    availableMemory: number;
    lowMemory: boolean;
};

type StorageInfo = {
    totalStorage: number;
    availableStorage: number;
};

type CpuInfo = {
    cpuCores: number;
};

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ProgressBar = ({ label, total, used, color }: { label: string; total: number; used: number; color: string }) => {
    const percentage = Math.min(100, Math.max(0, (used / total) * 100));

    return (
        <View style={styles.progressContainer}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{Math.round(percentage)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.details}>
                {formatBytes(used)} / {formatBytes(total)}
            </Text>
        </View>
    );
};

const PerformanceCard = () => {
    const [memory, setMemory] = useState<MemoryInfo | null>(null);
    const [storage, setStorage] = useState<StorageInfo | null>(null);
    const [cpu, setCpu] = useState<CpuInfo | null>(null);

    useEffect(() => {
        if (Platform.OS === 'android') {
            const fetchData = async () => {
                try {
                    const mem = await PerformanceModule.getMemoryInfo();
                    const stor = await PerformanceModule.getStorageInfo();
                    const cpuInfo = await PerformanceModule.getCpuInfo();

                    setMemory(mem);
                    setStorage(stor);
                    setCpu(cpuInfo);
                } catch (e) {
                    console.error("Failed to fetch performance data", e);
                }
            };

            fetchData();
            // Refresh every 5 seconds
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    if (!memory || !storage || !cpu) {
        return (
            <View style={styles.card}>
                <Text style={styles.loadingText}>Loading Performance Data...</Text>
            </View>
        );
    }

    const usedMemory = memory.totalMemory - memory.availableMemory;
    const usedStorage = storage.totalStorage - storage.availableStorage;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Performance</Text>

            <View style={styles.row}>
                <Text style={styles.label}>CPU Cores:</Text>
                <Text style={styles.valueText}>{cpu.cpuCores}</Text>
            </View>

            <ProgressBar
                label="RAM Usage"
                total={memory.totalMemory}
                used={usedMemory}
                color="#2196F3"
            />

            <ProgressBar
                label="Storage Usage"
                total={storage.totalStorage}
                used={usedStorage}
                color="#FF9800"
            />
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    valueText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    progressContainer: {
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        color: '#BBB',
        fontSize: 14,
    },
    value: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    details: {
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
    },
});

export default PerformanceCard;
