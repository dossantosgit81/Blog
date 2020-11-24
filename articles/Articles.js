const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = require("../categories/Categorie");

const Article = connection.define('articles', {
    title:{
        type:Sequelize.STRING,
        allownull:false
    },slug:{
        type: Sequelize.STRING,
        allownull: false
    },
    body:{
        type: Sequelize.TEXT,
        allownull: false
    }
});

//Uma categoria tem muitos artigos
Category.hasMany(Article);

/*
    Um artigo pertence a uma categoria
*/
Article.belongsTo(Category); 

/*Quando houver relacionamentos, 
procurar sempre em um unico arquivo*/



module.exports = Article;