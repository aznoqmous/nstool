export default class Notifier {
    /**
     * Display a notification
     */
    static prompt(message){
        return Notification.requestPermission().then(()=>{ new Notification(message) })
    }
}