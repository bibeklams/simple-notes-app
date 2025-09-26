const express=require('express');
const app=express();
const {MongoClient,ObjectId}=require('mongodb');
const port=3001;

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:false}));

const client=new MongoClient('mongodb://127.0.0.1:27017');
let noteCollection;

async function run() {
  try{
    await client.connect();
    console.log('mongoDb is connected');
    const db=client.db('NoteDB');
    noteCollection=db.collection('notes');
  }catch(err){
    console.log(err);
  }
}
run();

app.get('/',async(req,res)=>{
 const notes= await noteCollection.find().toArray();
  res.render('index',{notes:notes});
});

app.post('/add',async(req,res)=>{
  await noteCollection.insertOne({task:req.body.task});
  res.redirect('/');
});
app.get('/update/:id',async(req,res)=>{
  const id=req.params.id;
  const node=await noteCollection.findOne({_id:new ObjectId(id)});
  res.render('update',{node:node});
});
app.post('/update/:id',async(req,res)=>{
  const id=req.params.id;
  await noteCollection.updateOne({_id:new ObjectId(id)},{$set:{task:req.body.task}});
  res.redirect('/');
});
app.get('/view/:id',async(req,res)=>{
  const id=req.params.id;
  const node=await noteCollection.findOne({_id:new ObjectId(id)});
  res.render('view',{node:node});
});

app.post("/delete/:id",async(req,res)=>{
  const id=req.params.id;
  await noteCollection.deleteOne({_id:new ObjectId(id)});
  res.redirect('/');
})

app.listen(port,()=>{
  console.log(`server is running at http://localhost:${port}`);
})
