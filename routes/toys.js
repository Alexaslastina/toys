const express = require('express');
const { authToken } = require('../middlewares/auth');
const {ToyModel,validToy} = require("../models/toyModel");
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
    let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
    let page = req.query.page;
    let sortQ = req.query.sort;
    let qString =req.query.s;
    let qReg= new RegExp(qString, "i")
    let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
    try {

      let data= await ToyModel.find({$or:[{info:qReg}, {name:qReg}]})
      .sort({[sortQ]:ifReverse})
      .limit(perPage)
      .skip(page * perPage)
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });


  router.get('/cat/:catname', async (req, res) => {
    let catname = req.params.catname;
    try {
      let data = await ToyModel.find({category:catname});
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });
  
//add
router.post("/", authToken , async(req,res) => {
  let validBody = validToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new ToyModel(req.body);
    toy.user_id = req.userData._id;
    await toy.save();
    res.status(201).json(toy);
  } 
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  } 
})

//edit
router.put("/:editId", authToken , async(req,res) => {
    let editId = req.params.editId;
    let validBody = validToy(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let toy = await ToyModel.updateOne({_id:editId,user_id:req.userData._id},req.body);
      res.json(toy);
    } 
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    } 
  })

  //del
  router.delete("/:delId", authToken , async(req,res) => {
    let delId = req.params.delId;
    try{
      let toy = await ToyModel.deleteOne({_id:delId,user_id:req.userData._id});
      res.json(toy);
    } 
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    } 
  })

module.exports = router;
