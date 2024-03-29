import Notifier from "./notifier";
import Rigged from "rigged";
import Cookies from "./cookies";

export default class Nstool extends Rigged {

    constructor() {
        super({ template: `
        div .nstool
            h1 (nstool)
            div .search.mb-2
                input @searchInput #searchInput .form-control [autofocus="true"] [placeholder="www.yoursite.com"]
                div @suggests #suggests
            input @mailInput #mailInput .mb-2.form-control [type="mail"] [placeholder="mail"]
            h2 (DNS)
            div @dnsResults #dnsResults
            h2 (Certificate)
            div @certResults #certResults
            h2 (Whois)
            div @whoisResults #whoisResults
        ` })

        /**
         * Set up saved informations
         */
        this.history = Cookies.get('history')
        if(!this.history) this.history = []

        this.mailInput.value = Cookies.get('mail')

        /**
         * Asks for notification permission
         */
        Notifier.requestPermission()


        this.watchTimeout = 5000

        document.body.appendChild(this.element)

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
            let url = new URL(`http://${this.searchInput.value}`)
            this.searchInput.value = url.hostname

            this.search(this.searchInput.value)
        })

        this.mailInput.addEventListener('focusout', ()=>{
            this.addMail(this.mailInput.value)
        })
    }

    updateSuggests(){
        let historyMatches = this.matchHistory(this.searchInput.value)
        this.suggests.innerHTML = ''

        if(historyMatches.length){
            historyMatches.map(domain => {
                let newEl = new Rigged({template: `
                    div .suggest
                        span @name (${domain}) 
                        i @delete .delete
                `})

                this.suggests.appendChild(newEl.element)
                newEl.name.addEventListener('click', ()=>{
                    this.search(domain)
                })
                newEl.delete.addEventListener('click', ()=>{
                    this.removeFromSuggests(domain)
                })
            })
        }
    }

    search(value){
        this.searchInput.value = value

        this.nslookup(value)
            .then(res => {
                if(res) this.addToSuggests(value)
                this.dnsResults.innerHTML = ''
                this.dnsResults.appendChild(this.displayNSLogs(res))
            })

        this.certlookup(value)
            .then(res => {
                this.certResults.innerHTML = ''
                this.certResults.appendChild(this.displayCert(res))
            })
            
        this.whoisLookup(value)
            .then(res => {
                this.whoisResults.innerHTML = ''
                this.whoisResults.appendChild(this.displayWhois(res))
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

    whoisLookup(value){
        this.lastSearch = value
        return this.post('whois.php', value)
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
        let rigged = (new Rigged({template: `
            table .table.table-bordered
                thead
                    tr
                tbody
        `}))
        let logEl = rigged.element

        let attributes = 'host,class,ttl,type,pri,value,watch'.split(',')

        let line = rigged.selectOne('thead > tr')

        attributes.map(attr => {
            let td = document.createElement('th')
            td.innerHTML = attr
            line.appendChild(td)
        })

        let body = rigged.selectOne('tbody')
        logs
            .sort((a, b)=>{
                return a.type > b.type ? 1 : -1
            })
            .map(log => {
                line = document.createElement('tr')
                line.setAttribute('data-type', log.type)
                attributes.map(attr => {
                    let td = document.createElement('td')
                    td.setAttribute('data-attr', attr)
                    td.innerHTML = log[attr] ? log[attr] : ''
                    line.appendChild(td)

                    // build watch btn
                    if(attr === 'watch') {
                        let watchBtn = new Rigged({
                            container: td,
                            template: 'button .btn.btn-primary (watch)'
                        })
                        watchBtn.element.addEventListener('click', ()=>{
                            watchBtn.element.classList.toggle('active')
                            if(watchBtn.element.classList.contains('active'))  watchBtn.element.innerHTML = 'watching...'
                            else watchBtn.element.innerHTML = 'watch'
                            let saveLogValue = this.getRecordStringValue(logs, log.type)

                            let domain = this.lastSearch

                            let watch = ()=>{
                                this.nslookup(domain)
                                    .then(watchLogs => {
                                        let newValue = this.getRecordStringValue(watchLogs, log.type)
                                        if(newValue != saveLogValue) {
                                            saveLogValue = newValue
                                            let message = `The DNS value ${log.type} for ${domain} has been changed to ${newValue}!`
                                            Notifier.prompt(message)

                                            if(this.mailInput.value) this.sendmail(this.mailInput.value, message)
                                            let value = line.querySelector('[data-attr="value"]')
                                            value.innerHTML += `<br>${newValue} ${(new Date()).toLocaleTimeString()}`
                                        }
                                    })
                                if(watchBtn.element.classList.contains('active')) setTimeout(()=>{watch()}, this.watchTimeout)
                            }
                            watch()
                        })
                    }
                })
                body.appendChild(line)
            })
        return logEl
    }

    displayCert(cert){
        let rigged = (new Rigged({template: `
            table .table.table-bordered
                thead
                    tr
                tbody
        `}))
        let certEl = rigged.element

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

    displayWhois(whois){
        let rigged = (new Rigged({template: `
            table .table.table-bordered
                thead
                    tr
                tbody @tbody
        `}))
        let whoisEl = rigged.element

        if(!whois){
            whoisEl.innerHTML = "No Who is"
        }

        Object.keys(whois).map(key => {
            const line = document.createElement('tr')
            let th = document.createElement('th')
            let td = document.createElement('td')
            th.innerHTML = key
            td.innerHTML = whois[key]
            line.appendChild(th)
            line.appendChild(td)
            rigged.tbody.appendChild(line)

        })

        return whoisEl
    }

    filterLogs(logs, type){
        return logs.filter(log => log.type === type)
    }

    getRecordStringValue(logs, type){
        return this.filterLogs(logs, type)
            .map(log => log.value).sort().join('')
    }

    addToSuggests(domain){
        if(!domain) return;
        if(!this.history.includes(domain)) this.history.push(domain)
        Cookies.set('history', this.history)
    }

    removeFromSuggests(domain){
        if(this.history.includes(domain)) this.history.splice(this.history.indexOf(domain), 1)
        Cookies.set('history', this.history)
    }

    addMail(mail){
        Cookies.set('mail', mail)
    }

    matchHistory(value){
        return this.history.filter(domain => {
            return domain.match(value)
        }).sort()
    }
}