module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/inicio');
    },

    isLoggedInAndAdmin (req, res, next) {
        if (req.isAuthenticated()) {
            if(req.session.usuario){
                if(req.session.usuario.ES_ADMIN == 1){
                    return next();
                }
            return res.redirect('/perfil');
            }
        }
        return res.redirect('/inicio');
    },

    isAlreadyLogged (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }else{
            req.flash('success', 'Cierre sesión primero');
             return res.redirect('/perfil');
        }
    },

    isAlreadyLoggedAlter (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }else{
            req.session.seminario = null;
            req.session.seminarios = null;
            req.session.usuario = null;
            req.session.usuarios = null;
            req.logOut();
            res.redirect('inicio');
            req.flash('success', 'Se cerro su sesión');
            return res.redirect('inicio');
        }
    }

};