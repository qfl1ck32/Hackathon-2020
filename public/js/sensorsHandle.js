const script = document.createElement('script')
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
document.getElementsByTagName('head')[0].appendChild(script)

// Uses a formula to scale a value from the interval [min, max] to the iterval [a, b]
function scaleDown(v, min, max, a, b) {
    console.log (v, min, max, a, b)
    return ((b - a) * (v - min)) / (max - min) + a
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min
}

function howBad(v, min, max)
{
    let between = max - min
    if (between < 0)
        return 
    
    if (v < min || v > max)
        return 3 // BLACK :<
    else if (v <= min + between * 0.1 || v >= max - between * 0.1)
        return 2 // RED :(
    else if (v <= between / 2 - between * 0.1 || v >= between / 2 + between * 0.1)
        return 1 // YELLOW :|
    else
        return 0 // GREEN :D
}

// Uses a formula to scale a value from the interval [min, max] to the iterval [a, b]
function scaleDown(v, min, max, a, b) {
    return ((b - a) * (v - min)) / (max - min) + a
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min
}

function howBad(v, min, max)
{
    let between = max - min
    if (between < 0)
        return 
    
    if (v < min || v > max)
        return 3 // BLACK :<
    else if (v <= min + between * 0.1 || v >= max - between * 0.1)
        return 2 // RED :(
    else if (v <= between / 2 - between * 0.1 || v >= between / 2 + between * 0.1)
        return 1 // YELLOW :|
    else
        return 0 // GREEN :D
}

class SensorHandle extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options)
        this._group = null
        this._button = null
        this._sensorReference = {}
        this._placeHolder = "placeHolderSensor" // PLACE HOLDER FOR THE SENSORS
        this.selected = undefined
        this.currentButton = undefined
        this.sensors = []
        this.datapts = {}
        this.chart
        this.warnings = {}

        this.sensorsData = []

        this.main()
    }


    async main() {

        const ans = await this.getData()

        let id = 0

        const buttonHolder = document.getElementsByClassName('sensorList')[0]

        

        for (let i in ans) {
            const button = document.createElement('button')
            button.className = 'btn btn-light btnCustom'
            button.innerHTML = ans[i].emoji + ' ' + ans[i].type

            $(button).click(() => {

                const children = buttonHolder.childNodes

                for (let elem = 1; elem < children.length; ++elem)
                    $(children[elem]).removeClass('selected')

                if (typeof this.currentButton === 'undefined') {
                    this.currentButton = ans[i]
                    $(button).toggleClass('selected')
                }
                else {
                    this.currentButton = undefined
                }
                
            })

            buttonHolder.appendChild(button)
            this.sensors.push(ans[i])
        }

        this.chart = new CanvasJS.Chart("chartContainer", {
            exportEnabled: true,
            title : {
                text: "Sensors"
            },
            legend: {
                cursor: "pointer",
                itemclick: e => {
                    if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible)
                        return e.dataSeries.visible = false
                    return e.dataSeries.visible = true
                }
            },
            backgroundColor: "#FCF7F8",
            data: [{}],
            axisY: {
                minimum: 0,
                maximum: 100
            },
            axisX: {
                valueFormatString: " "
            }
        })
        

        var xVal = 0
        var maxDataLength = 5 // number of dataPoints visible at any point
        this.chart.render()

        let green = new THREE.Vector4(0, 255, 0, 1)
        let red = new THREE.Vector4(255, 0, 0, 1)
        let yellow = new THREE.Vector4(255, 255, 0, 1)
        let black = new THREE.Vector4(0, 0, 0, 1)
        let white = new THREE.Vector4(255, 255, 255, 1)
        var self = this

        self.startUpdateView = setInterval(async () => {
            var sensors = {}
            var newVals = false
            for (const key in self._sensorReference) {

                var random = getRandom(parseInt(self._sensorReference[key].randomMin), parseInt(self._sensorReference[key].randomMax))

                if (sensors[self._sensorReference[key].id])
                    random = sensors[self._sensorReference[key].id]
                else
                    sensors[self._sensorReference[key].id] = random;

                if (self.datapts[key]) {
                    newVals = true
                    self.datapts[key].push({
                        x: xVal,
                        y: parseInt(random)
                    })
                }

                /*
                const currentDate = new Date().toLocaleString()

                self.sensorsData.push({
                    id: key,
                    date: currentDate,
                    value: random
                })
               
                if (self.sensorsData.length > maxDataLength) {
                    const ans = await Promise.resolve($.post('/postSensorsData', { data: self.sensorsData}))
                    console.log(ans)
                    self.sensorsData = []
                }

                */

               for (let key in self.datapts)
                    if (self.datapts[key].length > maxDataLength)
                        self.datapts[key].shift()
                
                self.chart.render()

                let color = howBad(random, parseInt(self._sensorReference[key].min), parseInt(self._sensorReference[key].max))

                if (color == 3)
                    color = black
                else if (color == 0)
                    color = green
                else if (color == 1)
                    color = yellow
                else if (color == 2)
                    color = red
                else
                    color = white
                
                if (color == red || color == yellow || color == black) {
                    const alertMessageBox = document.getElementsByClassName('ISSUES')[0]
                    const alert = document.createElement('p')
                    alert.style.marginLeft = '1.6em'
                    alert.innerHTML = 'Sensor with key ' + self._sensorReference[key].id

                    if (color == yellow)
                        alert.innerHTML += ' just hit an unusual value ('
                    else if (color == red)
                        alert.innerHTML += ' just hit a dangerous value ('
                    else if (color == black)
                        alert.innerHTML += ' just hit an out of bounds value ('

                    alert.innerHTML +=  + Math.round(random, 2) + ' / ' + self._sensorReference[key].max + ').'
                    alertMessageBox.appendChild(alert)

                    const issues = document.getElementById('ISSUES')
                    issues.scrollTo(0, document.querySelector('.ISSUES').scrollHeight)

                    // self.warnings[self._sensorReference[key].id] = true
                }

                viewer.setThemingColor(key, color)

                if (color == red) {
                    const currentDate = new Date().toLocaleString()
                    const ans = await Promise.resolve($.post('/sendNotification', { sensorId: key, date: currentDate, value: random, email: self._sensorReference[key].email }))
                }

            }

            if (newVals)
                ++xVal
            
        }, 1000)
    }

    async getData() {
        return await Promise.resolve($.post('/getData'))
    }

    async load() {

        const ans = confirm('Do you want to import your last session?')

        if (!ans)
            return

        const data = await Promise.resolve($.post('/getSensorsData'))

        this._sensorReference = await JSON.parse(data['sensorsReference'])

        for (let elem in this._sensorReference) {
            
        }

        for (let elem in this._sensorReference) {

            const oneDbId = elem

            this.datapts[oneDbId] = []

            this.chart.options.data.push({
                type: "line",
                name: oneDbId.toString(),
                showInLegend: true,
                markerSize: 0,
                dataPoints: this.datapts[oneDbId]
            })

        }

        this.chart.render()


        return true
    }

    unload() {
        if (this._group) {
            this._group.removeControl(this._button)
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group)
            }
        }
        console.log('SensorHandle has been unloaded')

        $.post('/test')
        return true
    }

    

    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('allSensorHandleToolbar')

        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allSensorHandleToolbar')
            this.viewer.toolbar.addControl(this._group)
        }

        this._button = new Autodesk.Viewing.UI.Button('Add sensor')
        this._button.onClick = ev => {

            const selection = this.viewer.getSelection()
            this.viewer.clearSelection()

            if (selection.length > 0 && this.currentButton) {
                let oneDbId
                selection.forEach((dbId) => {
                    this.viewer.getProperties(dbId, (props) => {
                        this._sensorReference[dbId] = this.currentButton
                    })
                    oneDbId = dbId
                })

                this.datapts[oneDbId] = []
                this.chart.options.data.push({
                    type: "line",
                    name: oneDbId.toString(),
                    showInLegend: true,
                    markerSize: 0,
                    dataPoints: this.datapts[oneDbId]
                })
            }
            else
                alert('No sensor was selected.')
        }

        this._button.setToolTip('Add a sensor on an element')
        this._button.addClass('sensorHandleExtensionIcon')
        this._group.addControl(this._button)

        
        this._buttonSave = new Autodesk.Viewing.UI.Button("Save sensors' data")
        
        this._buttonSave.onClick = async e => {
            await Promise.resolve($.post('/storeSensorsData', this._sensorReference))

            alert('Your data was saved.')
        }

        this._buttonSave.setToolTip('Save the data from your sensors')
        this._buttonSave.addClass('sensorHandleExtensionIconSave')
        this._group.addControl(this._buttonSave)

    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('SensorHandleExtension', SensorHandle)
