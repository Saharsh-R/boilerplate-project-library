/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config()
let mongoose = require("mongoose");
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
const bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
})
const Book = mongoose.model('book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find((err, data) =>{
        if (err) console.log(err)
        const result = data.map(x => ({...x.toObject(), commentcount: x.comments.length }))
        res.send(result)
      })

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title){
        return res.send('missing required field title')
      }
      //response will contain new book object including atleast _id and title
      var book = new Book({title})
      book.save((err, data) => {
        if (err) console.error(err)
        return res.send({...data.toObject(), commentcount: data.comments.length})
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany((err) =>{
        if (err) console.log(err)
        res.send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, (err, data) => {
        if (err) console.error(err)
        if (!data){
          return res.send('no book exists')
        }
        return res.send(data)
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment){
        return res.send('missing required field comment')
      }
      Book.findByIdAndUpdate(
        bookid, 
        {$push : {comments: comment}}, 
        {new: true},
        (err, data) =>{
          if (err) console.error(err)
          if(!data){
            return res.send('no book exists')
          }
          return res.send(data)
        })
      //json res format same as .get

    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid, (err, data) => {
        if (err) console.error(err)
        if (!data) return res.send('no book exists')
        return res.send('delete successful')
      })


      //if successful response will be 'delete successful'
    });
  
};
