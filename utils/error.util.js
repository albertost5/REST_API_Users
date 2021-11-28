let errorResponse = function (code, description, message){
    return {
        "code": code,
        "description": description,
        "message": message
    }
}

module.exports = errorResponse;