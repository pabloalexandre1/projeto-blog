//basics requires
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const session = require("express-session");

//importing router
const categoriesController = require("./categories/categoriesController"); 
const articlesController = require("./articles/articlesController");
const usersController = require("./user/usersController");

//requiring the connection to mysql
const connection = require("./database/connection");

//load ejs as view engine
app.set("view engine", "ejs");

//configuring sessions
app.use(session({
    secret: "qualquercoisa",
    cookie: {
        maxAge: 30000
    }
}))



//loading body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// static archives setting
app.use(express.static("public"));


//connecting to database
connection.authenticate().then(() => {
    console.log("connection well seccedeed");
}).catch((error) => {
    console.log(error);
})

//defining use to the categories controller router
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

//main get routes
app.get("/", (req, res) => {
    Article.findAll({
        limit: 4,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });

        
    });
    
});

app.get("/session", (req, res) => {
    req.session.treinamento = "treinamento";
    res.send("sessão gerada");
});

app.get("/leitura", (req, res) => {
    res.json({session: req.session.treinamento});
})


app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirece("/");
        }
    }).catch( erro => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    })
});


//server inicialization
app.listen(4000, () => {
    console.log("server is running");
});