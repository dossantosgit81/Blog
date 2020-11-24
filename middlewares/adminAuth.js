function adminAuth(req, res, next){
    //O next serve pra passar a requisição do middleware, pra rota que o usuario quer acessar
    if(req.session.user != undefined){
        next();
    } else{
        res.redirect("/");
    }
}

module.exports = adminAuth;