/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

const path = require('path')
const express = require('express')
const mysql = require('mysql')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mailer = require('nodemailer')

const mysql_settings = {
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Hackathon',
    charset : 'utf8mb4'
}

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
})

const conn = mysql.createConnection(mysql_settings)

const PORT = process.env.PORT || 3000
const config = require('./config')
const { response } = require('express')
const { AppPackagesApi } = require('forge-apis')

if (config.credentials.client_id == null || config.credentials.client_secret == null)
    return console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.')
    
app.use(bodyParser.urlencoded())
app.use(express.json())
app.set('views', __dirname + '\\public')
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

app.use(express.json({ limit: '50mb' }))
app.use('/api/forge/oauth', require('./routes/oauth'))
app.use('/api/forge/oss', require('./routes/oss'))
app.use('/api/forge/modelderivative', require('./routes/modelderivative'))

app.post('/getData', async (req, res) => {
    const data = await new Promise(resolve => {
        conn.query('select * from sensors order by type;', (err, lines) => {
            if (err)
                console.log(err)
            else
                if (lines && lines[0])
                    resolve(Object.assign({}, lines))
                else
                    resolve({})
        })
    })

    res.send(data)
})

app.post('/postSensorsData', async (req, res) => {
    const data = req.body.data
    let query = 'insert into sensorsData values '
    let str = ''

    for (let elem = 0; elem < data.length; ++elem) {
        console.log(data[elem])
        str += '(' + data[elem].id + ', "' + data[elem].date + '", ' + data[elem].value + ')'
        if (elem + 1 != data.length)
            str += ', '
    }

    await Promise.resolve(conn.query(query + str + ';', (err, lines) => {
        console.log('Done query!')
    }))

    res.send(1)
})

app.post('/sendNotification', async (req, res) => {
    const data = req.body, id = data.sensorId, date = data.date, value = data.value, email = data.email

    const message = await ejs.renderFile('./public/Alert.ejs', { id: id, date: date, value: value })

    transporter.sendMail({
        from: 'algoritmiicpp@gmail.com',
        to: email,
        subject: 'Sensor #' + id + ' hit a high value.',
        html: message
    }, err => {
        if (err)
            console.error(err)
    })
    res.sendStatus(200)
})

app.post('/test', (req, res) => {
    res.send(1)
})

app.post('/storeSensorsData', async (req, res) => {
    const data = JSON.stringify(req.body)

    await new Promise(resolve => {
        conn.query("delete from sensorsdata; insert into sensorsdata values (?);", [data], (err, cv) => {
            if (err)
                console.log(err)
            resolve({})
        })
    })

    res.send(1)
})

app.post('/getSensorsData', async (req, res) => {
    const data = await new Promise(resolve => {
        conn.query("select * from sensorsdata;", (err, lines) => {
            if (err)
                console.log(err)
            else
                if (lines)
                    resolve(Object.assign({}, lines[0]))
                else
                    resolve({})
        })
    })

    res.send(data)
})

app.get('/alert', (req, res) => {
    return res.render('Alert.ejs', { date: 'test', id: 'testid', value: 'testvalue' }, (err, html) => {
        if (err)
            console.log(err)
        else
            res.send(html)
    })
})

app.listen(PORT, () => { 
    console.log(`Server listening on port ${PORT}`)
})