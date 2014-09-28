package com.wearhacks.posturetracker;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import android.app.Activity;
import android.app.Fragment;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

public class MainActivity extends Activity {

	public static final int SERVERPORT = 3000;
	private static final String[] SERVER_IPS = { "192.168.1.41", "192.168.1.40","192.168.1.185" };
	private Date timeOfLastRequestToServer = null;
	private HashMap<String, String> gRequestBodyValue = new HashMap<String, String>();
	
	private static final double[] PERFECT_ACCELS_VALUES = {-0.2341552734375, -0.9552734375, 0.2481689453125, -0.1943603515625, -0.911591796875, 0.36657226562500006, -0.1851171875, -0.82001953125, 0.5460498046874998, -0.107548828125, -0.7589892578125, 0.6297607421875003};
	private static final double WORST_VARIATION  = 0.3;
	
	private final BroadcastReceiver dataReceiver = new BroadcastReceiver() {
		private int countVals = 0;
		@Override
		public void onReceive(Context context, Intent intent) {
			Log.v("PostureTracker",
					"At beginning of onReceive for BroadcastReceiver!");
			double[] accels = intent.getDoubleArrayExtra(BT.EXTRA_DATA);
			long time = intent.getLongExtra(BT.EXTRA_TIME, 0);
			TextView dataText = (TextView) findViewById(R.id.text_data);
			
			// Get perfect data
			/*
			if(countVals < 50){
				Log.v("PostureTrackerPerfect",
						"COUNT VALS: " + countVals);
				for(int i = 0; i < PERFECT_ACCELS_VALUES.length; i++)
				{
					PERFECT_ACCELS_VALUES[i] = ((PERFECT_ACCELS_VALUES[i] * countVals) + accels[i])/(countVals+1); 
				}
				countVals++;
			}
			else{
				String str = "[ ";
				for(double d: PERFECT_ACCELS_VALUES)
					str += d + ", ";
				str += "]";
				Log.v("PostureTrackerPerfect",
						"PERFECT VALS: " + str);
			}
			*/
			
			long[] ratings = new long[accels.length];
			for(int i = 0; i < accels.length; i++){
				double diff = Math.abs(PERFECT_ACCELS_VALUES[i] - accels[i]);
				if(diff > WORST_VARIATION){
					ratings[i] = 0;
				}
				else{
					ratings[i] = 100 - Math.round((diff/WORST_VARIATION)*100);
				}
			}
			double ratingsAverage = 0;
			for(long r : ratings)
				ratingsAverage += r;
			ratingsAverage /= ratings.length;
			ratingsAverage =Math.round(ratingsAverage*1000)/1000.0;		

			FrameLayout container = (FrameLayout) findViewById(R.id.container);
			
			if(ratingsAverage > 75) // GOOD
			{
				//container.setBackgroundColor(getResources().getColor(R.color.green));
				container.setBackgroundDrawable(getResources().getDrawable(R.drawable.background_good));
				
			}else if(ratingsAverage < 61) // BAD
			{
				//container.setBackgroundColor(getResources().getColor(R.color.red));
				container.setBackgroundDrawable(getResources().getDrawable(R.drawable.background_bad));
			}else{ // NEUTRAL

				//container.setBackgroundColor(getResources().getColor(R.color.yellow));
				container.setBackgroundDrawable(getResources().getDrawable(R.drawable.background_neutral));
			}
	
			if (timeOfLastRequestToServer == null)
				timeOfLastRequestToServer = new Date();
			else {
				if (new Date().getTime() - timeOfLastRequestToServer.getTime() < 1000)
					return;
				timeOfLastRequestToServer = new Date();
			}
			
			dataText.setText("\n\nTime: " + time + "\nAccels: " + Arrays.toString(accels) +"\nRatings: " + Arrays.toString(ratings) + "\nRatings Average: " + ratingsAverage);

			// Setting request data
			String accelsJson = "[";
			String[] keys = { "x", "y", "z" };
			int keysIndex = 0;
			for (int i = 0; i < accels.length; i++) {
				if (keysIndex == 0) {
					accelsJson += "{\"" + keys[keysIndex] + "\":\"" + accels[i]
							+ "\"";
				} else {
					accelsJson += ",";
					if (keysIndex == 1)
						accelsJson += "\"" + keys[keysIndex] + "\":\""
								+ accels[i] + "\"";
					else if (keysIndex == 2) {
						accelsJson += "\"" + keys[keysIndex] + "\":\""
								+ accels[i] + "\",\"rating\":"+ratings[i]+"}";
						if (i < accels.length - 1)
							accelsJson += ",";
					}
				}
				keysIndex = (keysIndex + 1) % 3;
			}
			accelsJson += "]";
			gRequestBodyValue.put("event", "message");
			gRequestBodyValue.put("source", "PostureTrackerApp");
			gRequestBodyValue.put("payload", "{\"time\":\"" + time
					+ "\",\"accels\":" + accelsJson + ",\"rating\":\""+ratingsAverage+"\"}");
				
			// Doing http request in separate thread
			// Sending to server(s)
			new Thread(new Runnable() {
				@Override
				public void run() {
					HashMap<String,String> requestBodyValue = gRequestBodyValue;
					Log.i("PostureTracker", "Sending: " + requestBodyValue);
					for (String serverIP : SERVER_IPS)
						sendToServer("http://" + serverIP + ":" + SERVERPORT + "/api/android",requestBodyValue);
				}

				private void sendToServer(String serverUrl,HashMap<String,String> requestBodyValue){
					try {
						HttpClient client = new DefaultHttpClient();
						HttpPost post = new HttpPost(serverUrl);
						List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(
								1);
						for (String s : requestBodyValue.keySet())
							nameValuePairs.add(new BasicNameValuePair(s,
									requestBodyValue.get(s)));

						post.setEntity(new UrlEncodedFormEntity(nameValuePairs));

						HttpResponse response = client.execute(post);
						BufferedReader rd = new BufferedReader(
								new InputStreamReader(response.getEntity()
										.getContent()));
						String line = "";
						while ((line = rd.readLine()) != null) {
							System.out.println(line);
						}

					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			// end sending to server
		}
	};

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		if (savedInstanceState == null) {
			getFragmentManager().beginTransaction()
					.add(R.id.container, new PlaceholderFragment()).commit();
		}
	}

	@Override
	protected void onResume() {
		IntentFilter filter = new IntentFilter(BT.INTENT_FILTER);
		registerReceiver(dataReceiver, filter);
		super.onResume();
	}

	@Override
	protected void onPause() {
		unregisterReceiver(dataReceiver);
		super.onPause();
	}

	public static class PlaceholderFragment extends Fragment {
		public PlaceholderFragment() {
		}

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			View rootView = inflater.inflate(R.layout.fragment_main, container,
					false);
			return rootView;
		}
	}

}