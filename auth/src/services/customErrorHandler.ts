class CustomErrorHandler extends Error {
    status: number;
    success: boolean;
  
    constructor(status: number, msg: string) {
      super(msg); 
      this.status = status;
      this.message = msg;
      this.success = false;
  
      
      Error.captureStackTrace(this, this.constructor);
    }
  
    static alreadyExist(message: string): CustomErrorHandler {
      return new CustomErrorHandler(409, message);
    }
  
    static wrongCredentials(message = "Your email & password is wrong"): CustomErrorHandler {
      return new CustomErrorHandler(401, message);
    }
  
    static unAuthorized(message = "Unauthorised User"): CustomErrorHandler {
      return new CustomErrorHandler(403, message);
    }
  
    static notFound(message = "404 Not Found"): CustomErrorHandler {
      return new CustomErrorHandler(404, message);
    }
  
    static serverError(message = "Internal Server Error"): CustomErrorHandler {
      return new CustomErrorHandler(500, message);
    }
  
    
  }
  
  export default CustomErrorHandler;