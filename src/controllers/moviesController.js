const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, Association } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: [{association: "actors"}]
        })
            .then(movies => {
                res.send(movies)
                /* res.render('moviesList.ejs', {movies}) */
            })
            
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        // TODO
        res.render('moviesAdd')   
    },
    create: function (req, res) {
       // TODO
       let errors = validationResult(req);

       
       if(errors.isEmpty()){
           // Guardamos los datos en DB
           const {title, rating, release_date, awards, length} = req.body;
           db.Movie.create({
               title,
               rating,
               length,
               awards,
               release_date,
           })
           .then(movie => res.redirect('/movies'))
           .catch(error => res.send(error))

       }else{
           // Mostramos errores en form
           res.send(errors)
       }

    },
    edit: function(req, res) {
        // TODO
        db.Movie.findByPk(req.params.id)
            .then(Movie => res.render('moviesEdit', {
                Movie,
            }))
            .catch(error => res.send(error))
    },
    update: function (req,res) {
        // TODO
       let errors = validationResult(req);

        
       if(errors.isEmpty()){
           // Guardamos los datos en DB
           const {title, rating, release_date, awards, length} = req.body;
           db.Movie.update({
               title,
               rating,
               length,
               awards,
               release_date,
           }, {
               where: {
                   id: req.params.id,
               }
           })
           .then((response) => {
               if(response == 1){
                   res.redirect('/movies')
               }else{
                   res.send('no se pudo actualizar la pelicula')
               }
           })
           .catch(error => res.send(error))
       }else{
           // Mostramos errores en form
           res.send(errors)
       }
    },
    delete: function (req, res) {
        // TODO
        db.Movie.findByPk(req.params.id)
            .then((Movie) => res.render('moviesDelete', {
                Movie,
            }))
            .catch(error => res.send(error))
    },
    destroy: function (req, res) {
        // TODO
        db.Movie.destroy({
            where: {
                id: req.params.id,
            }
        })
        .then(result => {
            if(result == 1){
                res.redirect('/movies')
            }else{
                res.send('No se pudo eliminar la pelicula')
            }
        })
        .catch(error => res.send(error))
    }
}

module.exports = moviesController;