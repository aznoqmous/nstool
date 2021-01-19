import Notifier from "./notifier";
import Rigged from "rigged";
import Cookies from "./cookies";

export default class Nstool extends Rigged {

    constructor(container=null) {
        super({ container, template: `
        div .nstool
            div .search
                input #searchInput [autofocus="true"] [placeholder="www.yoursite.com"]
                div #suggests
            input #mail [type="mail"] [placeholder="mail"]
            div #dnsResults
            div #certResults
        ` })

        this.history = Cookies.get('history')
        if(this.history) this.history = JSON.parse(this.history)
        else this.history = []

        this.watchTimeout = 5000

        this.bind()
    }

    bind(){

        this.searchInput.addEventListener('focusin', ()=>{
            this.updateSuggests()
            setTimeout(()=>{ this.suggests.classList.add('active')}, 100)
        })

        this.searchInput.addEventListener('focusout', ()=>{
            setTimeout(()=>{ this.suggests.classList.remove('active')}, 100)
        })

        this.searchInput.addEventListener('keyup', (e)=>{

            this.updateSuggests()

            if(e.key !== 'Enter') return;

            this.searchInput.value = this.searchInput.value
                .replace('https://', '')
                .replace('http://', '')

            this.search(this.searchInput.value)
        })
    }

    updateSuggests(){
        let historyMatches = this.matchHistory(this.searchInput.value)
        this.suggests.innerHTML = ''

        if(historyMatches.length){
            historyMatches.map(domain => {
                let newEl = document.createElement('span')
                newEl.innerHTML = domain
                this.suggests.appendChild(newEl)
                newEl.addEventListener('click', ()=>{
                    this.search(newEl.innerText)
                })
            })
        }
    }

    search(value){
        this.searchInput.value = value

        this.addToHistory(value)

        this.nslookup(value)
            .then(res => {
                this.dnsResults.innerHTML = ''
                this.dnsResults.appendChild(this.displayNSLogs(res))
            })

        this.certlookup(value)
            .then(res => {
                this.certResults.innerHTML = ''
                this.certResults.appendChild(this.displayCert(res))
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
                            else watchBtn.innerHTML = 'watch'
                            let saveLogValue = this.getRecordStringValue(logs, log.type)

                            let domain = this.lastSearch

                            let watch = ()=>{
                                this.nslookup(domain)
                                    .then(logs => {
                                        let newValue = this.getRecordStringValue(logs, log.type)
                                        if(newValue != saveLogValue) {
                                            saveLogValue = newValue
                                            let message = `The DNS value ${log.type} for ${domain} has been changed to ${newValue}!`
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

    addToHistory(domain){
        if(!this.history.includes(domain)) this.history.push(domain)
        document.cookie = `history=${JSON.stringify(this.history)}`
    }

    matchHistory(value){
        return this.history.filter(domain => {
            return domain.match(value)
        }).sort()
    }
}