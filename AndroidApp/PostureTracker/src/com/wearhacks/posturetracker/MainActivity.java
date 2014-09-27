package com.wearhacks.posturetracker;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.Socket;
import java.net.URL;
import java.net.UnknownHostException;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends Activity {

    private Socket socket;
    public static final int SERVERPORT = 3000;
    private static final String SERVER_IP = "192.168.1.41";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        new Thread(new ClientThread()).start();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    public void onClick(View view){
    	try{
    		Log.i("PostureTracker", "Clicked Button!");
    		EditText et = (EditText) findViewById(R.id.EditText01);
    		String str = et.getText().toString();
    		str = "[\"broadcast\",{\"payload\":\""+str+"\",\"source\":\"PostureTrackerApp\"}]";
    		
    		PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(socket.getOutputStream())), true);
    		out.println(str);
    		
    		// Displaying Toast
    		Context context = getApplicationContext();
    		CharSequence text = "Sent message " + str + " to server!";
    		int duration = Toast.LENGTH_SHORT;
    		Toast toast = Toast.makeText(context, text, duration);
    		toast.show();
    		
    		Log.i("PostureTracker", text.toString());
    		et.setText("");
    		
    	}catch(UnknownHostException e){
    		e.printStackTrace();
    	}catch(IOException e){
    		e.printStackTrace();
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    }
    
    class ClientThread implements Runnable{
    	@Override
    	public void run(){
    		try{
    			InetAddress serverAddr = InetAddress.getByName(SERVER_IP);
    			socket = new Socket(serverAddr, SERVERPORT);
    		}catch(UnknownHostException e1){
    			e1.printStackTrace();
    		}catch(IOException e2){
    			e2.printStackTrace();
    		}
    	}
    }
}
