package com.devicereport.device

import android.os.Build
import com.facebook.react.bridge.*

class DeviceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "DeviceModule"

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            val data = Arguments.createMap()
            data.putString("brand", Build.BRAND)
            data.putString("model", Build.MODEL)
            data.putString("androidVersion", Build.VERSION.RELEASE)

            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
