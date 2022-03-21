import {parse} from 'querystring'

export function getPOSTInfo(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}