package com.devicereport.battery

import android.content.*
import android.os.BatteryManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class BatteryModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private var batteryReceiver: BroadcastReceiver? = null

  override fun getName() = "BatteryModule"

  @ReactMethod
  fun startListening() {
    if (batteryReceiver != null) return

    batteryReceiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {

        val level = intent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = intent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val status = intent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val temperature = intent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1) ?: -1

        if (level >= 0 && scale > 0) {
          val batteryPct = (level * 100) / scale

          val isCharging =
            status == BatteryManager.BATTERY_STATUS_CHARGING ||
            status == BatteryManager.BATTERY_STATUS_FULL

          // Create object to send to JS
          val data = Arguments.createMap()
          data.putInt("percentage", batteryPct)
          data.putBoolean("isCharging", isCharging)
          data.putDouble("temperature", temperature / 10.0) // Android gives temp * 10

          sendEvent("BatteryInfoChanged", data)
        }
      }
    }

    reactContext.registerReceiver(
      batteryReceiver,
      IntentFilter(Intent.ACTION_BATTERY_CHANGED)
    )
  }

  @ReactMethod
  fun stopListening() {
    batteryReceiver?.let {
      reactContext.unregisterReceiver(it)
      batteryReceiver = null
    }
  }

  private fun sendEvent(eventName: String, params: WritableMap) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }
}
