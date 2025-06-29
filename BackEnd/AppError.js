class AppError extends Error {
    constructor(status, error_data){
        super()
        this.error_data = error_data
        this.status = status
    }
    
}

module.exports = AppError