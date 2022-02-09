class BaseModel {
    constructor(data, message) {

        if (typeof data === 'string') {
            this.message = data
        }
        if (data) {
            this.data = data
            data = null
            message = null
            console.log(this) //SuccessModel { data: { id: 16 } }
            console.log(data, message, '........>>>>>>>>>>>>>>>>>>>2') //null null ........>>>>>>>>>>>>>>>>>>>2
        }
        if (message) {
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0 //成功
        console.log(data, '........>>>>>>>') //{ id: 16 } ........>>>>>>>
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1 //失败
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}