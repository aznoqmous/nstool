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
        return Cookies.getAll()[key]
    }

}