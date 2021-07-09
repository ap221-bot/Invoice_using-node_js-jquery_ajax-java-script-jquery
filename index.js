const path = require('path');
var all=[];
var a1=[];
const http = require('http');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const pg = require('pg');
const ejs = require('ejs');
const url = require('url');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
//Create connection
const conn = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'invoice'
});

//connect to database
conn.connect((err) => {
if (err) throw err;
console.log('Mysql Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));

app.on('updateEvent', function () {
    console.log('Update event listener');
});

app.post('/save',(req, res) =>{
    //var total1 = req.body.unit_price * req.body.quantity;
    let data = { item_no: req.body.item_no, description: req.body.description , quantity: req.body.quantity ,unit_price: req.body.unit_price, total:req.body.total};
    let sql = "SELECT * from invoice WHERE item_no = "+data.item_no;
    let query = conn.query(sql,(err, results)=>{
        if (err) throw err;
        //console.log(results);
        if(results.length==0)
        {
            let sql = "INSERT INTO invoice SET ?";
            let query = conn.query(sql, data, (err, results) => {
                if (err) throw err;
                //res.redirect('/');
                let sql1 = "SELECT * FROM invoice";
                let query1 = conn.query(sql1, (err, results) => {
                    if (err) throw err;
                    res.render('product_view.hbs', {
                        results: results
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({"response": results , "flag": 1}));
            });
            });
        }
        else
        {
            app.emit('updateEvent');
            var s = results[0].quantity + data.quantity;
            var tt = results[0].total + data.total;
            let sql1 = "UPDATE invoice SET quantity='"+s+ "',total='"+tt+"' WHERE item_no="+data.item_no;
                let query1 = conn.query(sql1, (err, results) => {
                    if (err) throw err;
                    let sql2 = "SELECT * FROM invoice";
                    let query2 = conn.query(sql2, (err, results) => {
                        if (err) throw err;
                        res.render('product_view.hbs', {
                            results: results
                        });
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({"response": results , "flag": 0}));
                });
            });
        }
});
});
    //console.log(all[0]==data.item_no);
    /*var i=0;
    var ty=0;
    var flag=0;
    var total_item=all.length;*/
    /*for (i = 0; i <= total_item; i++) {
        console.log("hi");
        if(data.item_no == all[i])
        {
            console.log("i");
            /*let sql = "SELECT quantity FROM invoice WHERE item_no = "+data.item_no;
            let query = conn.query(sql, (err, results) => {
                if (err) throw err;
                ty = results;
                ty = ty + data.quantity;
                data.quantity = ty;
                let sql1 = "UPDATE invoice SET quantity="+data.quantity+ "WHERE item_no="+data.item_no;
                let query1 = conn.query(sql1, (err, results) => {
                    if (err) throw err;
                    res.render('product_view.hbs', {
                        results: results
                        
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({"response": "anything0"}));
                });
                
            });*/
            //break;
        //}
        /*else{
            console.log("h");
            all.push(data.item_no);
            let sql = "INSERT INTO invoice SET ?";
            let query = conn.query(sql, data, (err, results) => {
                if (err) throw err;
                //res.redirect('/');
                let sql1 = "SELECT * FROM invoice";
                let query1 = conn.query(sql1, (err, results) => {
                    if (err) throw err;
                    res.render('product_view.hbs', {
                        results: results
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({"response": results}));
            });
            });
            continue;
        }
    }
    //if(flag==1)
    //{
        /*let sql = "SELECT quantity FROM invoice WHERE item_no = "+data.item_no;
            let query = conn.query(sql, (err, results) => {
                if (err) throw err;
                ty = results;
                ty = ty + data.quantity;
                data.quantity = ty;
                let sql1 = "UPDATE invoice SET quantity="+ty+"WHERE item_no="+data.item_no;
                let query1 = conn.query(sql1, (err, results) => {
                    if (err) throw err;
                    let sql2 = "SELECT * FROM invoice";
                    let query2 = conn.query(sql2, (err, results) => {
                        if (err) throw err;
                        res.render('product_view.hbs', {
                            results: results
                        });
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({"response": results}));
                    });
                });
            });*/
        /*let sql1 = "UPDATE invoice SET quantity="+data.quantity+ "WHERE item_no="+data.item_no;
        let query1 = conn.query(sql1, (err, results) => {
            if (err) throw err;
            });
            //res.setHeader('Content-Type', 'application/json');
            //res.send(JSON.stringify({"response": "anything"}));
        //});
        let sql2 = "SELECT * FROM invoice";
        let query2 = conn.query(sql2, (err, results) => {
            if (err) throw err;
            res.render('product_view.hbs', {
                results: results
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"response": results}));
        });*/
        //console.log("hi");
    //}*/
    

app.post('/delete',(req, res) =>{
    all=[];
    let sql = "DELETE FROM invoice";
    let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      //res.redirect('/');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({"response": "delete"}));
  });
});



app.get('/', (req, res) => {
    //console.log("get");
    let sql = "SELECT * FROM invoice";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('product_view.hbs', {
            results: results
            
        });
    });
});


//route for update data
//server listening
app.listen(3000, () => {
console.log('Server is running at port 3000');
});