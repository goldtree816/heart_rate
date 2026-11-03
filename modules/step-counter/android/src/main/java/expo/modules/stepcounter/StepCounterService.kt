package expo.modules.stepcounter

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.IBinder

class StepCounterService : Service(), SensorEventListener {
  private lateinit var sensorManager: SensorManager
  private var listenerRegistered = false
  private var stepSensor: Sensor? = null

  companion object {
    private const val CHANNEL_ID = "step_tracking_channel"
    private const val NOTIFICATION_ID = 501
  }

  override fun onCreate() {
    super.onCreate()
    sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
    stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    startTrackingNotification()

    val sensor = stepSensor
    if (sensor == null) {
      stopSelf()
      return START_NOT_STICKY
    }

    if (!listenerRegistered) {
      listenerRegistered = sensorManager.registerListener(
        this, sensor, SensorManager.SENSOR_DELAY_NORMAL
      )
    }

    return if (listenerRegistered) START_STICKY else START_NOT_STICKY
  }

  override fun onSensorChanged(event: SensorEvent?) {
    if (event?.values?.isNotEmpty() == true) {
      StepCounterStore.updateSteps(applicationContext, event.values[0].toLong())
    }
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        "Step Tracking",
        NotificationManager.IMPORTANCE_LOW
      ).apply {
        description = "Keeps daily step tracking active"
      }
      getSystemService(NotificationManager::class.java)
        .createNotificationChannel(channel)
    }
  }

  private fun startTrackingNotification() {
    val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Notification.Builder(this, CHANNEL_ID)
    } else {
      @Suppress("DEPRECATION")
      Notification.Builder(this)
    }

    val notification = builder
      .setSmallIcon(android.R.drawable.ic_menu_directions)
      .setContentTitle("Step tracking is active")
      .setContentText("Your daily steps are being counted.")
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setCategory(Notification.CATEGORY_SERVICE)
      .build()

    if (Build.VERSION.SDK_INT >= 34) {
      startForeground(
        NOTIFICATION_ID,
        notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH
      )
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
  }

  override fun onDestroy() {
    if (listenerRegistered) {
      sensorManager.unregisterListener(this)
      listenerRegistered = false
    }
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null
}
