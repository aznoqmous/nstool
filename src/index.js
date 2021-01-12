document.addEventListener('DOMContentLoaded', ()=>{
  let search = document.getElementById('search')
  let result = document.getElementById('result')

  search.addEventListener('keyup', (e)=>{
    if(e.key != 'Enter') return;
    result.innerHTML = ''

    search.value = search.value
    .replace('https://', '')
    .replace('http://', '')

    post('/ns-lookup.php', search.value)
    .then(res => {
      result.appendChild(displayNSLogs(res))
    })

    post('/cert.php', search.value)
    .then(res => {
      result.appendChild(displayCert(res))
    })
  })

})

function post(url, query){
  let data = new FormData()
  data.append('query', query)
  return fetch(url, {
    method: 'POST',
    body: data
  })
  .then(res => res.json())
}

function displayNSLogs(logs){
  let logEl = document.createElement('table')
  let attributes = 'host,class,ttl,type,pri,value'.split(',')

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
    attributes.map(attr => {
      let td = document.createElement('td')
      td.innerHTML = log[attr] ? log[attr] : '-'
      line.appendChild(td)
    })
    logEl.appendChild(line)
  })
  return logEl
}

function displayCert(cert){
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
