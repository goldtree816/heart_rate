package expo.modules.stepcounter

import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorManager
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class StepCounterModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("StepCounter")

    AsyncFunction("isAvailable") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      val manager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
      manager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) != null
    }

    AsyncFunction("startTracking") {
      val context = appContext.reactContext
        ?: throw Exception("Android context is unavailable")

      val manager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
      if (manager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) == null) {
        throw Exception("This phone does not have a hardware step-counter sensor.")
      }

      val serviceIntent = Intent(context, StepCounterService::class.java)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(serviceIntent)
      } else {
        context.startService(serviceIntent)
      }
      true
    }

    AsyncFunction("getTodaySteps") {
      val context = appContext.reactContext
        ?: throw Exception("Android context is unavailable")
      StepCounterStore.getTodaySteps(context)
    }

    AsyncFunction("stopTracking") {
      val context = appContext.reactContext
        ?: throw Exception("Android context is unavailable")
      context.stopService(Intent(context, StepCounterService::class.java))
      true
    }
  }
}
