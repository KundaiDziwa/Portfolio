zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
zingchart.LICENSE = ["569d52cefae586f634c54f86dc99e6a9","b55b025e438fa8a98e32482b5f768ff5"];

window.feed = function(callback) {
    var tick = {
    };
    tick.plot0 = Math.ceil(350 + (Math.random() * 500));
    callback(JSON.stringify(tick));
  };
   
  var myConfig = {
    type: "gauge",
    alpha:0,
    globals: {
      fontSize: 7.5,
    },
    plotarea: {
      marginTop: 30
    },
    plot: {
      size: '100%',
      valueBox: {
        placement: 'center',
        text: '%v', //default
        fontSize: 7.5,
        rules: [{
            rule: '%v >= 700',
            text: '%v<br>EXCELLENT'
          },
          {
            rule: '%v < 700 && %v > 640',
            text: '%v<br>Good'
          },
          {
            rule: '%v < 640 && %v > 580',
            text: '%v<br>Fair'
          },
          {
            rule: '%v <  580',
            text: '%v<br>Bad'
          }
        ]
      }
    },
    tooltip: {
      borderRadius: 5
    },
    scaleR: {
      aperture: 200,
      minValue: 300,
      maxValue: 850,
      step: 50,
      center: {
        visible: false
      },
      tick: {
        visible: false
      },
      item: {
        offsetR: 0,
        rules: [{
          rule: '%i == 9',
          offsetX: 15
        }]
      },
      labels: ['300', '', '', '', '', '', '580', '640', '700', '750', '', '850'],
      ring: {
        size: 15,
        rules: [{
            rule: '%v <= 580',
            backgroundColor: '#E53935'
          },
          {
            rule: '%v > 580 && %v < 640',
            backgroundColor: '#EF5350'
          },
          {
            rule: '%v >= 640 && %v < 700',
            backgroundColor: '#FFA726'
          },
          {
            rule: '%v >= 700',
            backgroundColor: '#29B6F6'
          }
        ]
      }
    },
    refresh: {
        type: "feed",
        transport: "js",
        url: "feed()",
        interval: 15000,
        resetTimeout: 1000
    },
    series: [{
        values: [755], // starting value
        backgroundColor: 'black',
        indicator: [2.5, 2.5, 2.5, 2.5, 0.6],
        animation: {
        effect: 2,
        method: 1,
        sequence: 4,
        speed: 900
        },
    }]
};
window.feed = function(callback) {
    var tick = {
    };
    tick.plot0 = Math.ceil(350 + (Math.random() * 500));
    callback(JSON.stringify(tick));
  };
   
  var myConfig1 = {
    type: "radar",
    alpha:0,
    plot: {
      aspect: "area"
    },
    'scale-v': {
      values: "0:100:25",
      labels: [ '', '', '', '', '' ],
      'ref-line': {
        'line-color': "none"
      },
      guide: {
        'line-style': "solid"
      }
    },
    'scale-k': {
      values: "0:330:30",
      format: "%v°",
      aspect: "circle", //To set the chart shape to circular.
      guide: {
        'line-style': "dashed"
      }
    },
    scale: {
      'size-factor':1   //Provide a decimal or percentage value.
    }
};

window.feed = function(callback) {
    var tick = {
    };
    tick.plot0 = Math.ceil(350 + (Math.random() * 500));
    callback(JSON.stringify(tick));
  };
   
  var myConfig2 = {
    type: "gauge",
    alpha:0,
    globals: {
      fontSize: 0
    },
    scale: {
      'size-factor':0.7   //Provide a decimal or percentage value.
    },
    'scale-2': {
      'size-factor':1
    },
    'scale-r': { //Default Scale
      aperture:200,     //Provide your gauge chart's range.
      aperture:200,
      minValue: 0,
      maxValue: 200,
      center: {
        size:2,
        'background-color': "#66CCFF #FFCCFF",
        'border-color': "none"
      },
      ring: {
        size: 2
      },
      tick: {
        visible: true,
        size: 4
      }
    },
    'scale-r-2': { //Additional Scale
      aperture:250,
      minValue: 0,
      maxValue: 200,
      step: 20,
      center: {
        size:4,
        'background-color': "#66CCFF #FFCCFF",
        'border-color': "none"
      },
      ring: {
        size: 2
      },
      tick: {
        visible: true,
        size: 4
      },
      guide: {
        alpha:0     // Make sure your larger scale's background is set to transparent.
      }
    },
    refresh: {
        type: "feed",
        transport: "js",
        url: "feed()",
        interval: 15000,
        resetTimeout: 1000
    },
    series: [
      {
        values: [50],
        indicator: [2, .5, 2.5, 2.5, 5],
        animation: {
          effect: 2,
          method: 1,
          sequence: 4,
          speed: 900
        }
      },
      {
        values: [100],
        scales: "scale-2,scale-r-2", //Specify which scale your data should plot to.
        indicator: [2, .5, 2.5, 2.5, 5],
        animation: {
          effect: 2,
          method: 1,
          sequence: 4,
          speed: 900
        }
      }
    ]
};
window.feed = function(callback) {
    var tick = {
    };
    tick.plot0 = Math.ceil(350 + (Math.random() * 500));
    callback(JSON.stringify(tick));
  };
   
  var myConfigC = {
    type: "gauge",
    alpha:0,
    globals: {
      fontSize: 7.5
    },
    plotarea: {
      marginTop: 30
    },
    plot: {
      size: '100%',
      valueBox: {
        placement: 'center',
        text: '%v', //default
        fontSize: 7.5,
        rules: [{
            rule: '%v >= 700',
            text: '%v<br>EXCELLENT'
          },
          {
            rule: '%v < 700 && %v > 640',
            text: '%v<br>Good'
          },
          {
            rule: '%v < 640 && %v > 580',
            text: '%v<br>Fair'
          },
          {
            rule: '%v <  580',
            text: '%v<br>Bad'
          }
        ]
      }
    },
    tooltip: {
      borderRadius: 5
    },
    scaleR: {
      aperture: 220,
      minValue: 300,
      maxValue: 850,
      step: 50,
      center: {
        visible: false
      },
      tick: {
        visible: true,
        size: 5
      },
      item: {
        offsetR: 0,
        rules: [{
          rule: '%i == 9',
          offsetX: 15
        }]
      },
      labels: ['300', '', '', '', '', '', '580', '640', '700', '750', '', '850'],
      ring: {
        size: 2,
        rules: {
            backgroundColor: '#989898'
          }
      }
    },
    refresh: {
        type: "feed",
        transport: "js",
        url: "feed()",
        interval: 15000,
        resetTimeout: 1000
    },
    series: [{
        values: [755], // starting value
        backgroundColor: 'black',
        indicator: [1.5, .5, 2.5, 2.5, 6],
        animation: {
        effect: 2,
        method: 1,
        sequence: 4,
        speed: 900
        },
    }]
};


// Displaying the gauges
window.onload=function() {
    // initail animation gauge
    zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: 125,
        width: '100%'
    });
    // Normal gauge
    zingchart.render({
        id: 'myChart1',
        data: myConfig1,
        height: 125,
        width: '100%'
    });
    // Normal gauge
    zingchart.render({
        id: 'myChart2',
        data: myConfig2,
        height: 125,
        width: '100%'
    });
    // Compass
    zingchart.render({
        id: 'compass',
        data: myConfigC,
        height: 125,
        width: '100%'
    });
};