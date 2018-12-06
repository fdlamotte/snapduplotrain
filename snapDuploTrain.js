const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();
const http = require('http');
const url = require('url');
const fs = require('fs');

var i = 0;
var duploTrain;
var lastColor = 0;

poweredUP.on("discover", async (hub) => { // Wait to discover a Hub

    await hub.connect(); // Connect to the Hub

    console.log(`Connected to ${hub.name}!`);                                                  

    await hub.sleep(3000); // Sleep for 3 seconds before starting

	hub.on("color", async (port, color) => {
		console.log("color event %d", color);
		lastColor = color;
	});

	duploTrain = hub;
});

poweredUP.scan(); // Start scanning for Hubs

http.createServer(function (req, res) {
	var p = url.parse (req.url, true);
	var q = p.query;
	var pathname = p.pathname;

	// We serve snap sources from synced repo from github in ../Snap
	// except for libraries because we'll provide our own 
	if (pathname === "/") pathname = "/snap.html"; 
	if (pathname.startsWith("/snap.html") 
		|| pathname.startsWith("/src")
		|| pathname.startsWith("/Sounds")
		|| pathname.startsWith("/Costumes")
		|| pathname.startsWith("/Backgrounds")
		|| pathname.startsWith("/locale")
		|| pathname.startsWith("/help")
		|| pathname.startsWith("/Examples")
		|| pathname.startsWith("/libraries")) {

		var prefix = ".";		

		try { // try with local files or revert to Snap repo
			fs.statSync(prefix + pathname);
		} catch (err) {
			prefix = "../Snap";
		}

		console.log("serving snap : %s" , prefix + pathname);

		fs.readFile(prefix + pathname, function(err, data) { 

			if (err) { 
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found");
			}

			if (pathname.endsWith("js")) {
    			res.writeHead(200, {'Content-Type': 'text/javascript'});
			} else if (pathname.endsWith("html")) {
    			res.writeHead(200, {'Content-Type': 'text/html'});
			} else {
				res.writeHead(200);
			}

			res.write(data);

			return res.end();
		});

	} else {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type', 'text/html');

		if (pathname.startsWith ("/setMotor")) {
			if (duploTrain != null) 
				duploTrain.setMotorSpeed("MOTOR", q.s, q.t);	
			console.log("setMotor speed : %d time : %d", q.s, q.t);
			res.writeHead(200);		
			return res.end();
		} else if (pathname.startsWith ("/playSound")) {
			console.log("playing sound : %d", q.v);
			if (duploTrain != null)
				duploTrain.playSound(q.v);
			res.writeHead(200);		
			return res.end();
		} else if (pathname.startsWith ("/setLED")) {
			console.log("setting LED Color to : %d", q.v);
			if (duploTrain != null)
				duploTrain.setLEDColor(5);
			res.writeHead(200);		
			return res.end();
		} else if (pathname.startsWith ("/getColor")) {
			console.log("getColor returning %d", lastColor);
			res.writeHead(200);		
			return res.end("" + lastColor);
		} else if (pathname.startsWith ("/getSpeed")) {
			console.log("getSpeed : %d", i);
			res.writeHead(200);		
			return res.end("" + i++);
		} else {
			console.log("unk url : %s", req.url);
			res.writeHead(200);
			return res.end("");
		}
	}

}).listen(8001);

