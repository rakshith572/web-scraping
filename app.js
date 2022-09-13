const express=require('express');
const app=express();
const s=require('./scrapper');

// app.use(express.json());
app.get('/',(req,res)=>{
    res.json({"message":"wass up"});
});

app.get('/search/:title',(req,res)=>{
    const ele=s.searchMovies(req.params.title).then(result=>{res.json(result)});
    // res.json(ele);
});

app.get('/movie/:imdbID',(req,res)=>{
    s.getMovie(req.params.imdbID).then(result=>{res.json(result)});
})

const port=5000;
app.listen(port,console.log(`server listening at ${port}!!!!!!`));
