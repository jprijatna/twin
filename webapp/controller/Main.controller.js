sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/model/json/JSONModel"
], function(Controller, ContentResource, JSONModel) {
	"use strict";

	var cycleChart;
	var cycleChart2;
	var cycleChart3;

	var tempChart;

	var count = 0;

	var interval;

	var peopleText;
	var equipText;
	var enviText;
	var safety1;
	var safety2;
	var safety3;

	var peopleTextValue;
	var equipTextValue;
	var enviTextValue;
	var safety1Value;
	var safety2Value;
	var safety3Value;

	var sourceData;

	var model3d;
	var stat;

	var Main = this;

	var loadModelIntoViewer = function(viewer, remoteUrl, sourceType, localFile) {
		//what is currently loaded in the view is destroyed
		viewer.destroyContentResources();

		var source = remoteUrl || localFile;

		if (source) {
			//content of viewer is replaced with new data
			var contentResource = new ContentResource({
				source: source,
				sourceType: sourceType,
				sourceId: "abc"
			});

			//content: chosen path. content added to the view
			viewer.addContentResource(contentResource);
		}
	};

	return Controller.extend("DPROP.controller.Main", {

		onInit: function() {
			cycleChart = this.getView().byId("cycleChart");
			cycleChart2 = this.getView().byId("cycleChart2");
			cycleChart3 = this.getView().byId("cycleChart3");

			tempChart = this.getView().byId("temperatureChart");

			peopleText = this.getView().byId("peopleText");
			equipText = this.getView().byId("equipText");
			enviText = this.getView().byId("carText");
			safety1 = this.getView().byId("safety1");

			var view2 = this.getView().byId("statistics_panel");
			var view1 = this.getView().byId("model_panel");
			var view3 = this.getView().byId("options_panel");
			var option1 = this.getView().byId("option1");
			var option1_details = this.getView().byId("option1_details");
			var option2 = this.getView().byId("option2");
			var option2_details = this.getView().byId("option2_details");
			var confirmation = this.getView().byId("confirmation");
			var option1_finance = this.getView().byId("option1_finance");

			model3d = this.getView().byId("viewer");
			stat = this.getView().byId("damageStat");

			var data = {
				labels: [],
				datasets: [{
					label: "Number of People",
					fill: false,
					lineTension: 0.1,
					backgroundColor: "rgba(75,192,192,0.4)",
					borderColor: "rgba(75,192,192,1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba(75,192,192,1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 5,
					pointHitRadius: 10,
					data: []
				}]
			};

			var chartColors = {
				red: 'rgb(255, 0, 0)',
				orange: 'rgb(255, 159, 64)',
				yellow: 'rgb(255, 205, 86)',
				green: 'rgb(75, 192, 192)',
				blue: 'rgb(54, 162, 235)',
				purple: 'rgb(153, 102, 255)',
				grey: 'rgb(231,233,237)'
			};

			var randomScalingFactor = function() {
				return (Math.random() > 0.5 ? 1.0 : 0.0) * Math.round(Math.random() * 25);
			};

			var labels = ["Jan '17", "Feb '17", "Mar '17", "Apr '17", "May '17", "Jun '17", "Jul '17", "Aug '17", "Sep '17", "Oct '17",
				"Nov '17", "Dec '17"
			];
			var labels2 = ["Jan '18", "Feb '18", "Mar '18", "Apr '18", "May '18", "Jun '18", "Jul '18", "Aug '18", "Sep '18", "Oct '18",
				"Nov '18", "Dec '18"
			];

			var config = {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
						label: "Max Temp",
						backgroundColor: chartColors.red,
						borderColor: chartColors.red,
						pointRadius: 4,
						data: [
							538,
							530,
							533,
							539,
							527,
							525,
							537,
							532,
							538,
							536,
							512,
							538
						],
						fill: false
					}, {
						label: "Min Temp",
						fill: false,
						backgroundColor: chartColors.blue,
						borderColor: chartColors.blue,
						pointRadius: 4,
						data: [
							150,
							260,
							330,
							525,
							515,
							537,
							380,
							200,
							510,
							148,
							370,
							470
						]
					}]
				}

			};

			var config2 = {
				type: 'bar',
				data: {
					labels: labels,
					datasets: [{
						label: "Hot Starts",
						backgroundColor: chartColors.red,
						borderColor: chartColors.red,
						data: [12, 14, 11, 7, 8, 15, 14, 10, 9, 5, 13, 16],
						fill: false
					}, {
						label: "Warm Starts",
						backgroundColor: chartColors.orange,
						borderColor: chartColors.orange,
						data: [21, 22, 26, 25, 35, 15, 12, 25, 23, 22, 19, 23],
						fill: false
					}, {
						label: "Cool Temp",
						fill: false,
						backgroundColor: chartColors.blue,
						borderColor: chartColors.blue,
						data: [38, 29, 33, 31, 26, 30, 25, 21, 19, 12, 10, 15]
					}]
				}
			};

			var config3 = {
				type: 'line',
				data: {
					labels: labels2,
					datasets: [{
						label: "Baseline",
						backgroundColor: chartColors.grey,
						borderColor: chartColors.grey,
						pointRadius: 4,
						data: [
							84,
							68,
							53,
							59,
							27,
							25,
							87,
							62,
							48,
							36,
							82,
							78
						],
						fill: false
					}, {
						label: "Option A",
						fill: false,
						backgroundColor: chartColors.purple,
						borderColor: chartColors.purple,
						pointRadius: 4,
						data: [
							78,
							57,
							30,
							55,
							15,
							25,
							80,
							60,
							50,
							40,
							80,
							70
						]
					}]
				}

			};
			
			var config4 = {
				type: 'line',
				data: {
					labels: labels2,
					datasets: [{
						label: "Baseline",
						backgroundColor: chartColors.grey,
						borderColor: chartColors.grey,
						pointRadius: 4,
						data: [
							84,
							68,
							53,
							59,
							27,
							25,
							87,
							62,
							48,
							36,
							82,
							78
						],
						fill: false
					}, {
						label: "Option A",
						fill: false,
						backgroundColor: chartColors.purple,
						borderColor: chartColors.purple,
						pointRadius: 4,
						data: [
							74,
							67,
							35,
							45,
							19,
							25,
							70,
							70,
							60,
							36,
							70,
							78
						]
					}]
				}

			};

			cycleChart.setData(config.data);
			cycleChart2.setData(config3.data);
			cycleChart3.setData(config4.data);

			tempChart.setData(config2.data);
			// this._loadVideo();

			var oTable = this.getView().byId("alertsTable");
			var oModel = new sap.ui.model.json.JSONModel();
			var tableData = [{
				Date: "Fri, 17-11-2017 | 01:12:59 PM",
				Priority: "Medium",
				Description: "The number of people and safety equipment do no match.",
				Type: "E338 - Missing Safety Gear",
				State: "Warning",
				StatusIcon: 'sap-icon://alert'
			}, {
				Date: "Fri, 17-11-2017 | 11:38:35 AM",
				Priority: "High",
				Description: "Misuse of Power Equipment",
				Type: "E404 - Equipment Mishandle",
				State: "Error",
				StatusIcon: 'sap-icon://sys-cancel-2'
			}, {
				Date: "Thu, 16-11-2017 | 10:33:04 AM",
				Priority: "Low",
				Description: "The number of people and safety equipment do no match.",
				Type: "E338 - Missing Safety Gear",
				State: "Warning",
				StatusIcon: 'sap-icon://alert'
			}];
			// oModel.setData(tableData);
			// oTable.setModel(oModel);

			sourceData = {
				localFile: undefined,
				remoteUrl: undefined
			};
			var model = new JSONModel();
			model.setData(sourceData);
			this.getView().setModel(model, "source");

			this.loadFromURL();

			var socket = io('http://35.184.43.189:3000');
			socket.on('connect', function() {
				//socket.emit('customer', "testing dual emit");
				console.log(socket.id);
				console.log('SUCCESS');
			});

			var model = this.getView().byId("viewer");
			var stat = this.getView().byId("damageStat");

			var twinText = this.getView().byId("twinText");
			var soundIcon = this.getView().byId("soundIcon");

			socket.on('twin', function(msg) {
				//finalString = finalString + "\n" + "Agent: " + msg + "\n";

				console.log("MESSSGAE" + msg);
				twinText.setText(msg);
				soundIcon.setColor("#728CD4");

				/*if (msg.includes("damage") || msg.includes("condition")) {
					view2.setBusy(true);
					setTimeout(function() {
						view2.setBusy(false);
						view2.setVisible(false);
						view1.setVisible(true);
						view3.setVisible(false);
					}, 2000);
				} else if (msg.includes("options") || msg.includes("solution")) {
					view2.setBusy(true);
					setTimeout(function() {
						view2.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(false);
						view3.setVisible(true);
						cycleChart2.update();
						cycleChart3.update();
					}, 2000);
				} else if (msg.includes("overview") || msg.includes("dashboard")) {
					view3.setBusy(true);
					setTimeout(function() {
						model3d._stepNavigation.playStep('i0000000500000000', false, false);
						stat.setVisible(false);
						view3.setBusy(false);
						view1.setVisible(true);
						view2.setVisible(false);
						view3.setVisible(false);
					}, 2000);
				} else if (msg.includes("detail") || msg.includes("impact")) {
					model3d._stepNavigation.playStep('i0000000500000004', false, false);
					stat.setVisible(true);
				}*/

				var that = this;
				/*if (msg === "The number of Hot Starts I've experienced has increased by 28%, up from 12 earlier this year.") {
					view1.setBusy(true);
					setTimeout(function() {
						view1.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(true);
						cycleChart.update();
						tempChart.update();
						view3.setVisible(false);
					}, 2000);
				} else if (msg === "The damage rate has increased fourfold over the past 6 monhts. This will result in a decrease in my useful life by 58.3%") {
					view2.setBusy(true);
					var that = this;
					setTimeout(function() {
						view2.setBusy(false);
						view3.setVisible(false);
						view1.setVisible(true);
						model._stepNavigation.playStep('i0000000500000004', false, false);
						stat.setVisible(true);
						view2.setVisible(false);
					}, 2000);
				} else if (msg === "Through historical data, predictive analytics, and my current condition, I have compiled two options. Option A involves manually refining machine startups to reduce wear and damage to the rotor, while Option B requires you to download SAP Software to configure and apply proper stress controls.") {
					view1.setBusy(true);
					setTimeout(function() {
						view1.setBusy(false);
						view2.setVisible(false);
						view1.setVisible(false);
						view3.setVisible(true);
						cycleChart2.update();
						cycleChart3.update();
					}, 2000);
				} else if (msg === "Using the PAL algorithm, 3000 simulation runs, and 184 external data points, I am 94% confident of my recommendations.") {
					option2.setBusy(true);
					setTimeout(function() {
						option2.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(false);
						view3.setVisible(true);
						option1.setVisible(true);
						option2.setVisible(false);
						option1_details.setVisible(true);
					}, 2000);
				} else if (msg.includes("select") || msg.includes("implement")) {
					view3.setBusy(true);
					setTimeout(function() {
						view3.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(false);
						view3.setVisible(true);
						option1.setVisible(true);
						option1.removeStyleClass("floatSubPanel3");
						option1.addStyleClass("floatSubPanel3Select");
						option2.setVisible(false);
						option1_details.setVisible(false);
						confirmation.setVisible(true);
					}, 2000);
				}*/

				if (msg === "The number of Hot Starts I've experienced has increased by 28%, up from 12 earlier this year.") {
					view1.setBusy(true);
					setTimeout(function() {
						view1.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(true);
						cycleChart.update();
						tempChart.update();
						view3.setVisible(false);
						soundIcon.setColor("#F2F2F2");
					}, 2000);
				} else if (msg ===
					"The damage rate has increased fourfold over the past 6 monhts. This will result in a decrease in my useful life by 58.3%") {
					view2.setBusy(true);
					var that = this;
					setTimeout(function() {
						view2.setBusy(false);
						view3.setVisible(false);
						view1.setVisible(true);
						model3d._stepNavigation.playStep('i0000000500000004', false, false);
						console.log(model);
						stat.setVisible(true);
						view2.setVisible(false);
						soundIcon.setColor("#F2F2F2");
					}, 2000);
				} else if (msg ===
					"Based on historical data and predictive analytics, I have compiled two options. Option A involves manually refining machine startups to reduce wear and damage to the rotor, while Option B requires you to download Deloitte software to configure and apply proper stress controls."
				) {
					view1.setBusy(true);
					setTimeout(function() {
						stat.setVisible(false);

						view1.setBusy(false);
						view2.setVisible(false);
						view1.setVisible(false);
						view3.setVisible(true);
						cycleChart2.update();
						cycleChart3.update();
						soundIcon.setColor("#F2F2F2");

					}, 2000);
				} else if (msg ===
					"Using the PAL algorithm, 3000 simulation runs, and 184 external data points, I am 94% confident of my recommendations.") {
					option2.setBusy(true);
					setTimeout(function() {
						option2.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(false);
						view3.setVisible(true);
						option1.setVisible(true);
						option2.setVisible(false);
						option1_details.setVisible(true);
						soundIcon.setColor("#F2F2F2");

					}, 2000);
				} else if (msg ===
					"Option A will allow us to reduce rotor stress by 25%, reduce fuel consumption by 37%, and also prevent a potential $10 Million outage cost."
				) {
					option1_details.setBusy(true);
					setTimeout(function() {
						option1_details.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(false);
						view3.setVisible(true);
						option1.setVisible(true);
						option2.setVisible(false);
						option1_details.setVisible(false);
						option1_finance.setVisible(true);
						soundIcon.setColor("#F2F2F2");

					}, 2000);
				} else if (msg === "I will immediately implement Option A and create an alert to all relevant operators. Good Day.") {
					view3.setBusy(true);
					setTimeout(function() {
						view3.setBusy(false);
						view1.setVisible(false);
						view2.setVisible(false);
						view3.setVisible(true);
						option1.setVisible(true);
						option1.removeStyleClass("floatSubPanel3");
						option1.addStyleClass("floatSubPanel3Select");
						option2.setVisible(false);
						option1_details.setVisible(false);
						option1_finance.setVisible(false);
						confirmation.setVisible(true);
						soundIcon.setColor("#F2F2F2");

					}, 2000);
				} else if (msg === "A change in my mission is causing damage to my turbine rotor. If this continues, my lifespan will be greatly reduced.") {
					view3.setBusy(true);
					setTimeout(function() {
						view3.setBusy(false);
						view1.setVisible(true);
						option1.addStyleClass("floatSubPanel3");
						option1.removeStyleClass("floatSubPanel3Select");
						view2.setVisible(false);
						view3.setVisible(false);
						option1.setVisible(true);
						option2.setVisible(true);
						option1_details.setVisible(false);
						confirmation.setVisible(false);
						soundIcon.setColor("#F2F2F2");
					}, 2000);
				}
			});

		},

		onPressLoadRemoteModel: function(event) {
			var view = this.getView();
			var sourceData = view.getModel("source").oData;
			var viewer = view.byId("viewer");
			if (sourceData.remoteUrl) {
				loadModelIntoViewer(viewer, sourceData.remoteUrl, "vds");
			} else {
				// handleEmptyUrl(view);
				console.log("Blank");
			}
		},

		loadFromURL: function() {
			var view = this.getView();
			//var vdsURL = "http://localhost:58810/VisaulAsset/vdsfiles/transmission.vds";
			var vdsURL = "/webapp/assets/transmission.vds";
			var viewer = view.byId("viewer");
			if (vdsURL) {
				loadModelIntoViewer(viewer, vdsURL, "vds");
			} else {
				// handleEmptyUrl(view);
				console.log("Blank");

			}
		},

		onAfterRendering: function() {
			// cycleChart.update();
			// tempChart.update();

			// vid.onplay = function() {
			// 	count = 0;
			// 	chart.getProperty("data").labels = [];
			// 	chart.getProperty("data").datasets[0].data = [];
			// 	chart.update();
			// 	interval = setInterval(that.updateChart, 1000);
			// };
			//interval = setInterval(this.updateChart, 1000);
			//setTimeout(this.clearInterval, 35 * 1000);
		},

		breakOpenModel: function() {
			var model = this.getView().byId("viewer");
			console.log(model);
			//model._stepNavigation.playStep('i0000000500000004', false, false);
			//var stat = this.getView().byId("damageStat");
			//stat.setVisible(true);
		},

		changeView: function() {
			var view2 = this.getView().byId("statistics_panel");
			var view1 = this.getView().byId("model_panel");
			var view3 = this.getView().byId("options_panel");
			var option1 = this.getView().byId("option1");
			var option1_details = this.getView().byId("option1_details");
			var option2 = this.getView().byId("option2");
			var option2_details = this.getView().byId("option2_details");
			var confirmation = this.getView().byId("confirmation");
			var option1_finance = this.getView().byId("option1_finance");

			/*if (view1.getVisible() === true) {
				view1.setBusy(true);
				var that = this;
				setTimeout(function() {
					view1.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(true);
					view3.setVisible(false);
				}, 2000);
			} else if (view2.getVisible() === true) {
				view2.setBusy(true);
				setTimeout(function() {
					view2.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					cycleChart2.update();
					cycleChart3.update();
				}, 2000);
			} else if (view3.getVisible() === true && option1.getVisible() === false) {
				view3.setBusy(true);
				setTimeout(function() {
					view3.setBusy(false);
					view1.setVisible(true);
					view2.setVisible(false);
					view3.setVisible(false);
				}, 2000);
			} else if (option1.getVisible() === true && view3.getVisible() === true) {
				option2.setBusy(true);
				setTimeout(function() {
					option2.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option2.setVisible(false);
					option1_details.setVisible(true);
				}, 2000);
			}*/

			if (count === 0) {
				view1.setBusy(true);
				setTimeout(function() {
					view1.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(true);
					cycleChart.update();
					tempChart.update();
					view3.setVisible(false);
				}, 2000);
			} else if (count === 1) {
				view2.setBusy(true);
				var that = this;
				setTimeout(function() {
					view2.setBusy(false);
					view3.setVisible(false);
					view1.setVisible(true);
					that.breakOpenModel();
					view2.setVisible(false);
				}, 2000);
			} else if (count === 2) {
				view1.setBusy(true);
				setTimeout(function() {
					view1.setBusy(false);
					view2.setVisible(false);
					view1.setVisible(false);
					view3.setVisible(true);
					cycleChart2.update();
					cycleChart3.update();
				}, 2000);
			} else if (count === 3) {
				option2.setBusy(true);
				setTimeout(function() {
					option2.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option2.setVisible(false);
					option1_details.setVisible(true);
				}, 2000);
			} else if (count === 4) {
				option1_details.setBusy(true);
				setTimeout(function() {
					option1_details.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option2.setVisible(false);
					option1_details.setVisible(false);
					option1_finance.setVisible(true);
				}, 2000);
			} else if (count === 5) {
				view3.setBusy(true);
				setTimeout(function() {
					view3.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option1.removeStyleClass("floatSubPanel3");
					option1.addStyleClass("floatSubPanel3Select");
					option2.setVisible(false);
					option1_details.setVisible(false);
					option1_finance.setVisible(false);
					confirmation.setVisible(true);
				}, 2000);
			} else if (count === 6) {
				view3.setBusy(true);
				setTimeout(function() {
					view3.setBusy(false);
					view1.setVisible(true);
					option1.addStyleClass("floatSubPanel3");
					option1.removeStyleClass("floatSubPanel3Select");
					view2.setVisible(false);
					view3.setVisible(false);
					option1.setVisible(true);
					option2.setVisible(true);
					option1_details.setVisible(false);
					confirmation.setVisible(false);
					count = 0;
				}, 2000);
			}

			count += 1;

		},

		buttonPress: function() {
			var vid = document.getElementById("videoPlyr");
			alert(vid.duration);
		},

		clearInterval: function() {
			count = 0;
			clearInterval(interval);
		},

		updateChart: function() {

			console.log(count);

			if (count === 34) {
				count = 0;
				clearInterval(interval);
			}

			var json = {
				"data": [{
					"people": "2",
					"vehicle": "3",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "1",
					"vehicle": "1",
					"high-vis-suit": "0",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "2",
					"high-vis-suit": "3",
					"saw": "1",
				}, {
					"people": "3",
					"vehicle": "0",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "3",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "3",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "3",
					"vehicle": "2",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "2",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "3",
					"vehicle": "0",
					"high-vis-suit": "3",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "1",
					"vehicle": "1",
					"high-vis-suit": "1",
					"saw": "0",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "1",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "1",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "1",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "0",
					"vehicle": "0",
					"high-vis-suit": "0",
					"saw": "0",
				}]
			};
			chart.getProperty("data").labels.push("");

			chart.getProperty("data").datasets[0].data[count] = json.data[count].people;

			chart.update();

			peopleTextValue = peopleText.getValue();
			equipTextValue = equipText.getValue();
			enviTextValue = enviText.getValue();
			safety1Value = safety1.getValue();

			peopleText.setValue(json.data[count].people);
			equipText.setValue(json.data[count].saw);
			enviText.setValue(json.data[count].vehicle);
			safety1.setValue(json.data[count]['high-vis-suit']);

			if (parseInt(peopleTextValue) < parseInt(json.data[count].people)) {
				peopleText.setIndicator("Up");
			} else if (parseInt(peopleTextValue) > parseInt(json.data[count].people)) {
				peopleText.setIndicator("Down");
			} else if (parseInt(peopleTextValue) === parseInt(json.data[count].people)) {
				peopleText.setIndicator("None");
			}

			if (parseInt(equipTextValue) < parseInt(json.data[count].saw)) {
				equipText.setIndicator("Up");
			} else if (parseInt(equipTextValue) > parseInt(json.data[count].saw)) {
				equipText.setIndicator("Down");
			} else if (parseInt(equipTextValue) === parseInt(json.data[count].saw)) {
				equipText.setIndicator("None");
			}

			if (parseInt(enviTextValue) < parseInt(json.data[count].vehicle)) {
				enviText.setIndicator("Up");
			} else if (parseInt(enviTextValue) > parseInt(json.data[count].vehicle)) {
				enviText.setIndicator("Down");
			} else if (parseInt(enviTextValue) === parseInt(json.data[count].vehicle)) {
				enviText.setIndicator("None");
			}

			if (parseInt(safety1Value) < parseInt(json.data[count]['high-vis-suit'])) {
				safety1.setIndicator("Up");
			} else if (parseInt(safety1Value) > parseInt(json.data[count]['high-vis-suit'])) {
				safety1.setIndicator("Down");
			} else if (parseInt(safety1Value) === parseInt(json.data[count]['high-vis-suit'])) {
				safety1.setIndicator("None");
			}

			count += 1;
		},

		changeValue: function(numericID, numericValue) {
			var textValue = this.getView().byId(numericID);
			var prevTextValue = textValue.getValue();
			textValue.setValue(numericValue);

			if (parseInt(prevTextValue) < parseInt(numericValue)) {
				textValue.setIndicator("Up");
			} else if (parseInt(prevTextValue) > parseInt(numericValue)) {
				textValue.setIndicator("Down");
			} else if (parseInt(prevTextValue) === parseInt(numericValue)) {
				textValue.setIndicator("None");
			}
		},

		_loadVideo: function() {
			var videoURL = "https://storage.googleapis.com/demovids/powersawRawInception3.mp4";
			var html1 = new sap.ui.core.HTML({
				content: "<video controls autoplay id='videoPlyr' width='100%' height='100%'>" +
					"<source src='" + videoURL + "' type='video/mp4'>" +
					"Your browser does not support the video tag." +
					"</video>"
			});
			var gridPanel = this.getView().byId("vidPlayer");
			gridPanel.removeAllItems();
			// var videoName =  new sap.m.Text({text: 'Check out the video'}).addStyleClass("fontMedium sapUiTinyMarginBottom sapUiTinyMarginTop sapUiTinyMarginBegin");
			//var videoDesc =  new sap.m.Text({text: videoDescription}).addStyleClass("descText sapUiTinyMarginBottom sapUiTinyMarginBegin");
			var videoBoxContent = new sap.m.VBox({
				//items: [html1, videoName, videoDesc],
				items: [html1],
				fitContainer: true
			}).addStyleClass("");
			var videoBox = new sap.m.HBox({
				items: [videoBoxContent],
				justifyContent: "Center",
				alignItems: "Center"
			}).addStyleClass("videoHBox");
			gridPanel.addItem(videoBox);
		}

	});
});