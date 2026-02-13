package com.devicereport.performance

import android.app.ActivityManager
import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.StatFs
import com.facebook.react.bridge.*
import java.io.File

class PerformanceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "PerformanceModule"

    @ReactMethod
    fun getMemoryInfo(promise: Promise) {
        try {
            val actManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val memInfo = ActivityManager.MemoryInfo()
            actManager.getMemoryInfo(memInfo)

            val map = Arguments.createMap()
            map.putDouble("totalMemory", memInfo.totalMem.toDouble())
            map.putDouble("availableMemory", memInfo.availMem.toDouble())
            map.putBoolean("lowMemory", memInfo.lowMemory)
            
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("MEMORY_ERROR", e)
        }
    }

    @ReactMethod
    fun getStorageInfo(promise: Promise) {
        try {
            val internalPath = Environment.getDataDirectory()
            val stat = StatFs(internalPath.path)
            
            val blockSize = stat.blockSizeLong
            val totalBlocks = stat.blockCountLong
            val availableBlocks = stat.availableBlocksLong

            val totalStorage = totalBlocks * blockSize
            val availableStorage = availableBlocks * blockSize

            val map = Arguments.createMap()
            map.putDouble("totalStorage", totalStorage.toDouble())
            map.putDouble("availableStorage", availableStorage.toDouble())

            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("STORAGE_ERROR", e)
        }
    }

    @ReactMethod
    fun getCpuInfo(promise: Promise) {
        try {
            val cores = Runtime.getRuntime().availableProcessors()
            val map = Arguments.createMap()
            map.putInt("cpuCores", cores)
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("CPU_ERROR", e)
        }
    }
}
