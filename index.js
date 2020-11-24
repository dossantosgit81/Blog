const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController"); 
const articlesController = require("./articles/ArticlesController");
const usersController = require("./user/UserController");

const Article = require("./articles/Articles");
const Category = require("./categories/Categorie");
const User = require("./user/User");

//View Engine
app.set('view engine', 'ejs');

app.use(session({
    secret: "srthhsfnfhmjcj,hjkvnchkchjck,",
    cookie: {maxAge: 30000}
}))

//Static
app.use(express.static('public'));

//Body-parser
//Permite a aceitação de dados do formulario. =>aceita dados json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
    .authenticate()
    .then(()=>{
    console.log("Servidor rodando");
    }).catch((error)=>{
    console.log(error);
    });

/*
Prefixo para barra("/") é um prefixo(poderia ser qualquer outro)
Para utilizar as rotas que foram definidas em outros files
*/
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles=>{

        Category.findAll().then(categories=>{
            res.render('index', {articles: articles, categories: categories});
        });

    });
});

app.get("/:slug", (req, res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render('article', {article: article, categories: categories});
            });
        }else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        }, 
        //Equivale ao Inner Join
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories=>{
                res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    });
});

app.listen(8080, ()=>{
    console.log("O servidor está rodando");
});