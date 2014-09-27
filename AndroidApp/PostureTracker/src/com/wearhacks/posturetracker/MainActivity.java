package com.wearhacks.posturetracker;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import android.app.Activity;
import android.app.Fragment;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

public class MainActivity extends Activity {

	public static final int SERVERPORT = 3000;
	private static final String SERVER_IP = "192.168.1.41";
	
	private HashMap<String,String> gRequestBodyValue = new HashMap<String,String>();
	
	private final BroadcastReceiver dataReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			Log.v("PostureTracker",
					"At beginning of onReceive for BroadcastReceiver!");
			double[] accels = intent.getDoubleArrayExtra(BT.EXTRA_DATA);
			long time = intent.getLongExtra(BT.EXTRA_TIME, 0);
			TextView dataText = (TextView) findViewById(R.id.text_data);
			dataText.setText("" + time + "\n" + Arrays.toString(accels));

			// Setting request data
			String accelsJson = "[";
			for (int i = 0; i < accels.length; i++) {
				if (i > 0)
					accelsJson += ",";
				accelsJson += accels[i];
			}
			accelsJson += "]";
			gRequestBodyValue.put("event", "message");
			gRequestBodyValue.put("source", "PostureTrackerApp");
			gRequestBodyValue.put("payload", "{\"time\": \""+ time + "\",\"accels\":" + accelsJson + "}");
			
			// Doing http request in separate thread
			// Sending to server
			new Thread(new Runnable(){
				@Override
				public void run() {
					try {
						HttpClient client = new DefaultHttpClient();
						HttpPost post = new HttpPost(
								"http://"+SERVER_IP+":"+SERVERPORT+"/api/android");
						List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(
								1);
						for(String s: gRequestBodyValue.keySet())
							nameValuePairs.add(new BasicNameValuePair(s,gRequestBodyValue.get(s)));

						post.setEntity(new UrlEncodedFormEntity(nameValuePairs));

						HttpResponse response = client.execute(post);
						BufferedReader rd = new BufferedReader(new InputStreamReader(
								response.getEntity().getContent()));
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