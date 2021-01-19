import Notifier from "./notifier";
import Rigged from "rigged";

export default class Nstool extends Rigged {
    constructor(container=null) {
        super({ container, template: `
        div .nstool
            input #search [autofocus="true"] [placeholder="www.yoursite.com"]
            input #mail [type="mail"] [placeholder="mail"]
            div #dnsResults
            div #certResults
        ` })

        this.watchTimeout = 5000

        this.bind()
    }

    bind(){
        this.search.addEventListener('keyup', (e)=>{
            if(e.key !== 'Enter') return;

            this.search.value = this.search.value
                .replace('https://', '')
                .replace('http://', '')

            this.nslookup(this.search.value)
                .then(res => {
                    this.dnsResults.innerHTML = ''
                    this.dnsResults.appendChild(this.displayNSLogs(res))
                })

            this.certlookup(this.search.value)
                .then(res => {
                    this.certResults.innerHTML = ''
                    this.certResults.appendChild(this.displayCert(res))
                })
        })
    }

    nslookup(value){
        this.lastSearch = value
        return this.post('ns-lookup.php', value)
    }

    certlookup(value){
        this.lastSearch = value
        return this.post('cert.php', value)
    }

    sendmail(destination, content){
        return this.post('mail.php', {
            destination, content
        })
    }

    post(url, query){
        let data = new FormData()
        data.append('query', JSON.stringify(query))
        return fetch(`/services/${url}`, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
    }



    displayNSLogs(logs){
        let logEl = document.createElement('table')
        let attributes = 'host,class,ttl,type,pri,value,watch'.split(',')

        let line = document.createElement('tr')
        attributes.map(attr => {
            let td = document.createElement('th')
            td.innerHTML = attr
            line.appendChild(td)
        })
        logEl.appendChild(line)

        logs
            .sort((a, b)=>{
                return a.type > b.type ? 1 : -1
            })
            .map(log => {
                line = document.createElement('tr')
                line.setAttribute('data-type', log.type)
                attributes.map(attr => {
                    let td = document.createElement('td')
                    td.innerHTML = log[attr] ? log[attr] : ''
                    line.appendChild(td)

                    // build watch btn
                    if(attr === 'watch') {
                        let watchBtn = document.createElement('button')
                        watchBtn.innerHTML = 'watch'
                        watchBtn.addEventListener('click', ()=>{
                            watchBtn.classList.toggle('active')
                            if(watchBtn.classList.contains('active'))  watchBtn.innerHTML = 'watching...'
                            else  watchBtn.innerHTML = 'watch'
                            let saveLogValue = this.getRecordStringValue(logs, log.type)
                            let watch = ()=>{
                                this.nslookup(this.lastSearch)
                                    .then(logs => {
                                        let newValue = this.getRecordStringValue(logs, log.type)
                                        if(newValue != saveLogValue) {
                                            saveLogValue = newValue
                                            let message = `The DNS value ${log.type} for ${this.lastSearch} has been changed to ${newValue}!`
                                            Notifier.prompt(message)
                                            if(this.mail.value) this.sendmail(this.mail.value, message)
                                        }
                                    })
                                if(watchBtn.classList.contains('active')) setTimeout(()=>{watch()}, this.watchTimeout)
                            }
                            watch()
                        })
                        td.appendChild(watchBtn)
                    }
                })
                logEl.appendChild(line)
            })
        return logEl
    }

    displayCert(cert){
        let certEl = document.createElement('table')
        if(!cert) {
            certEl.innerHTML = 'No SSL'
            return certEl;
        }

        let attributes = 'from,to,verified,issuer,names'.split(',')
        let line = document.createElement('tr')
        let contentLine = document.createElement('tr')
        certEl.appendChild(line)
        certEl.appendChild(contentLine)

        attributes.map(attr => {
            let th = document.createElement('th')
            let td = document.createElement('td')
            th.innerHTML = attr
            td.innerHTML = cert[attr]
            line.appendChild(th)
            contentLine.appendChild(td)
        })

        return certEl
    }

    filterLogs(logs, type){
        return logs.filter(log => log.type === type)
    }

    getRecordStringValue(logs, type){
        this.filterLogs(logs, type).map(log => log.value).sort().join('')
    }
}