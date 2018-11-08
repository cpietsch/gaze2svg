var fs = require("fs");
var csv = require("fast-csv");

var args = process.argv.slice(2);
var file = args[0];
var num = +args[1];
var mode = +args[2];

var width = 1280;
var height = 720;
console.log(args);

var i = 0;
var total = 0;
var svg = require("svg-builder")
	.width(width)
	.height(height);

var x2 = (y2 = 0);

csv.fromPath(file, { headers: true })
	.on("data", function(data, a) {
		var x = data.gaze_point_3d_x;
		var y = data.gaze_point_3d_y;
		// var x = data.norm_pos_x * width;
		// var y = data.norm_pos_y * height;

		if (!x && !y) return;
		if (i++ % num == 0) {
			// console.log(total, x, y);
			if (mode === 0) {
				svg.line({
					x1: x,
					y1: y,
					x2: x2,
					y2: y2,
					stroke: "#000",
					"stroke-width": 1
				});
			} else {
				svg.circle({ cx: +x, cy: +y, fill: "#000", r: 1 });
			}

			x2 = x;
			y2 = y;
			total++;
		}
	})
	.on("end", function(data) {
		console.log("datapoints", total);

		fs.writeFileSync(file.replace(".csv", ".svg"), svg.render(), "utf8");
		// console.log(svg.render());
		// console.log(svg);
	});
