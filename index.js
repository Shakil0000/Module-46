const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://organicUser2:amarnamkivai@cluster0.1tcgs.mongodb.net/organicdb5?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("organicdb5").collection("products");

  app.get("/products", (req,res) => {
    collection.find({})
    .toArray((err , documents) => {
      res.send(documents);
    })
  })

  app.get("/product/:id",(req,res) => {
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,document) => {
      res.send(document[0]);
    })
  })

  app.post("/addProducts", (req,res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result => {
      console.log("Data added successfully");
      res.redirect('/');
    })
 })

 app.patch('/update/:id',(req,res) => {
   collection.updateOne({_id:ObjectId(req.params.id)},
   {
     $set: {price:req.body.price, quantity:req.body.quantity}
   })
   .then(result => {
     console.log(result);
     res.send(result.modifiedCount > 0);
    
   })
 })
  
 app.delete('/delete/:id',(req,res) => {
   collection.deleteOne({_id:ObjectId(req.params.id)})
   .then(result => {
     console.log(result);
    res.send(result.deletedCount > 0);
   })
 })

 console.log('database connected');
});


app.listen(3000, () => console.log('listening to port 3000'));