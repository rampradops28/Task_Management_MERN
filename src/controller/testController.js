export const testController = function(req, res){
 try {
    res.status(200).send({
      success: true,
      message: "Test User Data"
    });
 } catch (error) {
    throw new Error("error in Test Api")
 }
};