package com.wearhacks.posturetracker;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class DataReceiver extends BroadcastReceiver {

	@Override
	public void onReceive(Context context, Intent intent) {
		double[] accels = intent.getDoubleArrayExtra(BT.EXTRA_DATA);
		long time = intent.getLongExtra(BT.EXTRA_TIME, 0);
	}
	
}
