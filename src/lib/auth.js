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
    }
};