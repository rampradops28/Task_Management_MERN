export const validLogin = function(req, res, next) {
    const {email, password} = req.body; 

        // Validation
        if(!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Please provide Email or Password"
        });
    }
  next();
};