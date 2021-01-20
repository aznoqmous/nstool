export default class Notifier {

    static requestPermission(){
        return Notification.requestPermission()
    }

    static prompt(message){
        return Notifier.requestPermission().then(()=>{
            this.notify(message)
        })
    }

    static notify(message){
        let notification = new Notification(message)
        let notified = false
        notification.onclose = ()=>{
            notified = true
        }

        document._title = document.title
        let blink = (state=false)=>{
            if(state) document.title = document._title
            else document.title = `* ${message}`
            if(!notified) setTimeout(()=>{ blink(!state) }, 1000)
            else document.title = document._title
        }
        blink()

    }
}