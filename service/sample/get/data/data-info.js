module.exports.getInfo = () => {

    return {
        "stringValue": "test",
        "numberValue": 12345,
        "booleanValue": true,
        "jsonValue": {
            "test": "aaaa"
        },
        "profileValue": process.env.PROFILE
    };;
}
