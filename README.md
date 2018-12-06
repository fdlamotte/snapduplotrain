# snapduplotrain
node.js server which serves I/O from a duplo train to Snap!

Makes use of : [node-poweredup](https://github.com/nathankellenicki/node-poweredup) and [Snap!](https://github.com/jmoenig/Snap).

To test : 
* clone this repository and snap in the same directory
>     git clone https://github.com/jmoenig/Snap.git
>     git clone https://github.com/fdlamotte/snapduplotrain.git
* install node-poweredup 
>     npm install node-poweredup --save
* go in /snapduplotrain/ directory and launch the js file
>     cd snapduplotrain
>     sudo node snapDuploTrain.js
* if you point a browser to your server at port 8001, it should serve you the Snap! application. You can then load the tools to control your duplo train by using the "Import Tools" command from the file menu.

