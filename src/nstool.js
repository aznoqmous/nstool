import Notifier from "./notifier";

export default class Nstool {
    constructor(container=null) {
        this.container = container || document.body

        this.watchTimeout = 5000

        this.build()
        this.bind()
    }

    build(){
        this.search = document.createElement('input')
        this.search.autofocus = true

        this.result = document.createElement('div')

        this.container.appendChild(this.search)
        this.container.appendChild(this.result)
    }

    bind(){
        this.search.addEventListener('keyup', (e)=>{
            if(e.key !== 'Enter') return;
            this.result.innerHTML = ''

            this.search.value = this.search.value
                .replace('https://', '')
                .replace('http://', '')

            this.nslookup(this.search.value)
                .then(res => {
                    this.result.appendChild(this.displayNSLogs(res))
                })

            this.certlookup(this.search.value)
                .then(res => {
                    this.result.appendChild(this.displayCert(res))
                })
        })
    }

    nslookup(value){
        this.lastSearch = value
        return this.post('/ns-lookup.php', value)
    }
    certlookup(value){
        this.lastSearch = value
        return this.post('/cert.php', value)
    }

    post(url, query){
        let data = new FormData()
        data.append('query', query)
        return fetch(url, {
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
                                            Notifier.prompt(`The DNS value ${log.type} for ${this.lastSearch} has been changed to ${newValue}!`)
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