window.onload = () => {
    window.fetch('/api/test.do', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8;', ajax: true},
        body: {}
    }).then(res => {
        return res.json()
    }).then(result => {
        console.log('result', result)
    });

    window.fetch('/api/person', {
        method: 'POST',
        headers: {'Content-Type':'application/json;charset=utf-8;', ajax: true},
    }).then(res => {
        return res.json()
    }).then(result => {
        console.log('person', result)
    })
}
