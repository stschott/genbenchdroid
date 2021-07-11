package com.generated.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Context;
import android.telephony.TelephonyManager;
import android.content.Intent;
import android.telephony.SmsManager;

public class MainActivity extends Activity {
  private Context context = this;

  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity);
    String sensitiveData = "clear";
    TelephonyManager tm0 = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    sensitiveData = tm0.getDeviceId(); // statementId: 0
    Intent i1 = new Intent(context, NextActivity2.class);
    i1.putExtra("leak", sensitiveData);
    context.startActivity(i1);
  }

}
