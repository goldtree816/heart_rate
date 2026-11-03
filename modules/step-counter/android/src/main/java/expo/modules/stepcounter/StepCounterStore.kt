package expo.modules.stepcounter

import android.content.Context
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

internal object StepCounterStore {
  private const val PREFS = "step_counter_storage"
  private const val KEY_DATE = "step_date"
  private const val KEY_STEPS = "today_steps"
  private const val KEY_LAST_RAW = "last_raw_steps"

  private fun prefs(context: Context) =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  private fun todayKey(): String =
    SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

  fun getTodaySteps(context: Context): Int {
    val p = prefs(context)
    if (p.getString(KEY_DATE, "") != todayKey()) return 0
    return p.getInt(KEY_STEPS, 0)
  }

  @Synchronized
  fun updateSteps(context: Context, rawSteps: Long) {
    val p = prefs(context)
    val today = todayKey()
    val savedDate = p.getString(KEY_DATE, "")
    val previousRaw = p.getLong(KEY_LAST_RAW, -1L)
    val previousSteps = p.getInt(KEY_STEPS, 0)

    // TYPE_STEP_COUNTER is cumulative since reboot while the sensor is active.
    // If it drops, the device likely rebooted and the hardware counter restarted.
    val delta = when {
      previousRaw < 0L -> 0L
      rawSteps >= previousRaw -> rawSteps - previousRaw
      else -> rawSteps
    }

    val total = if (savedDate != today) delta else previousSteps.toLong() + delta

    p.edit()
      .putString(KEY_DATE, today)
      .putLong(KEY_LAST_RAW, rawSteps)
      .putInt(KEY_STEPS, total.coerceAtMost(Int.MAX_VALUE.toLong()).toInt())
      .apply()
  }
}
