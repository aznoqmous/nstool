export default class Cookies {

    static getAll(){
        let cookies = document.cookie
        if(!cookies) return {}

        let res = {}

        cookies.split(';').map(strCookie => {
            let splitted = strCookie.split('=')
            let key = splitted[0].trim().replace(/\"/gs, '')
            let value = splitted[1]
            return res[key] = value;
        })

        return res
    }

    static get(key){
        let value = Cookies.getAll()[key]
        if(!value) return null
        return JSON.parse(value)
    }

    static set(key, value, expires=864000000000000, path=null){
        let cookie = `${key}=${JSON.stringify(value)};expires=${new Date(expires).toUTCString()}`
        if(path) cookie += `;path=${path}`
        document.cookie = cookie
    }

}