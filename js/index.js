var screenWidth = +d3.select("body").style("width").slice(0, -2);
var screenHeight = +d3.select("body").style("width").slice(0, -2);

var x = screenWidth / 2;
var y = screenHeight / 2;
var vx = 0;
var vy = 0;
var ax = 0;
var ay = 0;
var motionHandler = function(e) {
    ax = e.acceleration.x;
    ay = e.acceleration.y;
};

window.addEventListener("devicemotion", motionHandler);

var before = undefined;
function redraw(timestamp) {
    if (typeof timestamp !== "undefined") {
	var damping = 0.001;
	var multiplier = 0.01;
	if (typeof before === "undefined") {
	    before = timestamp;
	} 
	var dt = timestamp - before;
	before = timestamp;

	x += multiplier * (vx * dt + 0.5 * ax * dt * dt);
	y += multiplier * (vy * dt + 0.5 * ay * dt * dt);
	
	vx += ax * dt;
	vy += ay * dt;
	
	vx *= damping;
	vy *= damping;
	
	if (x < 0) { x = 0; vx = Math.max(0, vx); }
	if (y < 0) { y = 0; vy = Math.max(0, vy); }
	if (x > screenWidth) { x = screenWidth; vx = Math.min(0, vx); }
	if (y > screenHeight) { y = screenHeight; vy = Math.min(0, vy); }
	if (Math.abs(vx) < 1) vx = 0;
	if (Math.abs(vy) < 1) vy = 0;
	
	d3.select("#pointer")
	    .style("left", x + "px")
	    .style("top", y + "px");
	d3.select("#x")
	    .text("x " + x.toFixed(2) + ", vx " + vx.toFixed(2) + ", ax " + ax.toFixed(2));
	d3.select("#y")
	    .text("y " + y.toFixed(2) + ", vy " + vy.toFixed(2) + ", ay " + ay.toFixed(2));
    }
    
    window.requestAnimationFrame(redraw);
};

redraw();