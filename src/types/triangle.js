// Box Annotation implementation
module.exports = function (Chart) {
	/* eslint-disable global-require */
	var helpers = require('../helpers.js')(Chart);
	/* eslint-enable global-require */

	var BoxAnnotation = Chart.Annotation.Element.extend({
		// je retourne rien je suis appeller pour configurer l'espace pris par la forme
		// geographique par rapport au scale de la chart
		setDataLimits: function () {
			var model = this._model;
			var options = this.options;
			var chartInstance = this.chartInstance;

			var xScale = chartInstance.scales[options.xScaleID];
			var yScale = chartInstance.scales[options.yScaleID];
			var chartArea = chartInstance.chartArea;

			// Set the data range for this annotation
			model.ranges = {};

			if (!chartArea) {
				return;
			}

			if (xScale) {

				var x1 = helpers.isValid(options.points[0].x) ? options.points[0].x : xScale.getValueForPixel(chartArea.left);
				var x2 = helpers.isValid(options.points[1].x) ? options.points[1].x : xScale.getValueForPixel(chartArea.right);
				var x3 = helpers.isValid(options.points[2].x) ? options.points[2].x : xScale.getValueForPixel(chartArea.right);


				model.ranges[options.xScaleID] = {
					min: Math.min(x1, x2, x3),
					max: Math.max(x1, x2, x3)
				};
			}

			if (yScale) {
				var y1 = helpers.isValid(options.points[0].y) ? options.points[0].y : yScale.getValueForPixel(chartArea.bottom);
				var y2 = helpers.isValid(options.points[1].y) ? options.points[1].y : yScale.getValueForPixel(chartArea.bottom);
				var y3 = helpers.isValid(options.points[2].y) ? options.points[2].y : yScale.getValueForPixel(chartArea.bottom);

				model.ranges[options.yScaleID] = {
					min: Math.min(y1, y2, y3),
					max: Math.max(y1, y2, y3)
				};
			}
		},
		// appeller chaque frame pour configurer ???
		configure: function () {
			var model = this._model;
			var options = this.options;
			var chartInstance = this.chartInstance;

			var xScale = chartInstance.scales[options.xScaleID];
			var yScale = chartInstance.scales[options.yScaleID];
			var chartArea = chartInstance.chartArea;

			// clip annotations to the chart area
			model.clip = {
				x1: chartArea.left,
				x2: chartArea.right,
				y1: chartArea.top,
				y2: chartArea.bottom
			};

			if (xScale && yScale) {
				model.points = options.points.map(function (point) {
					return { x: xScale.getPixelForValue(point.x), y: yScale.getPixelForValue(point.y) };
				});
			}

			// Stylistic options
			model.borderColor = options.borderColor;
			model.borderWidth = options.borderWidth;
			model.backgroundColor = options.backgroundColor;
		},
		inRange: function (mouseX, mouseY) {
			var model = this._model;
			return model && pointInTriangle({x: mouseX, y: mouseY}, model.points[0], model.points[1], model.points[2]);
		},
		getCenterPoint: function () {
			var model = this._model;
			return {
				x: (model.points[0].x + model.points[1].x + model.points[2].x) / 3,
				y: (model.points[0].y + model.points[1].y + model.points[2].y) / 3
			};
		},
		getWidth: function () {
			var model = this._model;
			console.log('WIDTH');
			return Math.abs(model.right - model.left);
		},
		getHeight: function () {
			var model = this._model;
			console.log('HEIGHT');
			return Math.abs(model.bottom - model.top);
		},
		getArea: function () {
			console.log('AREA');
			return this.getWidth() * this.getHeight();
		},
		draw: function () {
			var model = this._model;
			var ctx = this.chartInstance.chart.ctx;

			ctx.save();

			ctx.beginPath();

			ctx.lineWidth = model.borderWidth;
			ctx.strokeStyle = model.borderColor;
			ctx.fillStyle = model.backgroundColor;

			ctx.moveTo(model.points[0].x, model.points[0].y);
			ctx.lineTo(model.points[1].x, model.points[1].y);
			ctx.lineTo(model.points[2].x, model.points[2].y);
			ctx.closePath();

			ctx.stroke();
			ctx.fill();
			ctx.restore();
		}
	});

	return BoxAnnotation;
};


function sign(p1, p2, p3 ) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

 function pointInTriangle(point, v1, v2, v3) {
    var b1, b2, b3;
    b1 = sign(point, v1, v2) <= 0.0;
    b2 = sign(point, v2, v3) <= 0.0;
    b3 = sign(point, v3, v1) <= 0.0;
    return ((b1 == b2) && (b2 == b3));
  }