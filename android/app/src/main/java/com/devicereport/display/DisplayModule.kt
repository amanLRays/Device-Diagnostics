package com.devicereport.display

import android.content.Context
import android.provider.Settings
import android.util.DisplayMetrics
import android.view.WindowManager
import com.facebook.react.bridge.*

class DisplayModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "DisplayModule"

    @ReactMethod
    fun getDisplayInfo(promise: Promise) {
        try {
            val windowManager = reactApplicationContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
            val display = windowManager.defaultDisplay
            val metrics = DisplayMetrics()
            display.getRealMetrics(metrics)

            // Get brightness
            val brightness = try {
                Settings.System.getInt(
                    reactApplicationContext.contentResolver,
                    Settings.System.SCREEN_BRIGHTNESS
                )
            } catch (e: Settings.SettingNotFoundException) {
                -1
            }

            val map = Arguments.createMap()
            
            // Screen brightness (0-255)
            map.putInt("brightness", brightness)
            map.putInt("maxBrightness", 255)
            
            // Screen dimensions
            map.putInt("width", metrics.widthPixels)
            map.putInt("height", metrics.heightPixels)
            
            // DPI
            map.putInt("densityDpi", metrics.densityDpi)
            map.putDouble("density", metrics.density.toDouble())
            
            // Screen size in inches
            val widthInches = metrics.widthPixels / metrics.xdpi
            val heightInches = metrics.heightPixels / metrics.ydpi
            val diagonalInches = Math.sqrt((widthInches * widthInches + heightInches * heightInches).toDouble())
            map.putDouble("screenSize", diagonalInches)
            
            // Refresh rate
            map.putDouble("refreshRate", display.refreshRate.toDouble())

            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("DISPLAY_ERROR", e)
        }
    }
}
