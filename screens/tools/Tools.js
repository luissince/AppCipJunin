export function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
}

export function validateEmail(value) {
    var validRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}

export function nombreMes(mes) {
    let array = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return array[mes - 1];
}

export function filterWhole(event) {
    var key = window.Event ? event.which : event.keyCode;
    var c = String.fromCharCode(key);
    if ((c < '0' || c > '9') && (c != '\b')) {
        event.preventDefault();
    }
}

export function filterFloat(event, referent) {
    var key = window.Event ? event.which : event.keyCode;
    var c = String.fromCharCode(key);
    if ((c < '0' || c > '9') && (c != '\b') && (c != '.')) {
        event.preventDefault();
    }
    if (c == '.' && referent.current.value.includes(".")) {
        event.preventDefault();
    }
}

export function filterFloatOnly(event, currentTarget) {
    var key = window.Event ? event.which : event.keyCode;
    var c = String.fromCharCode(key);
    if ((c < '0' || c > '9') && (c != '\b') && (c != '.')) {
        event.preventDefault();
    }
    if (c == '.' && currentTarget.value.includes(".")) {
        event.preventDefault();
    }
}

export function isNumeric(value) {
    if (value.trim().length == 0 || value == 'undefined') return false;
    if (isNaN(value.trim())) {
        return false;
    } else {
        return true;
    }
}

export function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

export function getDateForma(value, format = "dd/mm/yyyy") {
    var parts = value.split("-");
    let today = new Date(parts[0], parts[1] - 1, parts[2]);
    return (
        format == "dd/mm/yyyy" ? (
            (today.getDate() > 9 ? today.getDate() : "0" + today.getDate()) +
            "/" +
            (today.getMonth() + 1 > 9 ?
                today.getMonth() + 1 :
                "0" + (today.getMonth() + 1)) +
            "/" +
            today.getFullYear()) :
            today.getFullYear() + "-" + (today.getMonth() + 1 > 9 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1)) + "-" + (today.getDate() > 9 ? today.getDate() : "0" + today.getDate())
    );
}

export function getDateFormaMMYY(value) {
    var parts = value.split("-");
    let today = new Date(parts[0], parts[1] - 1, parts[2]);
    return (
        (today.getMonth() + 1 > 9 ?
            today.getMonth() + 1 :
            "0" + (today.getMonth() + 1)) +
        "/" +
        today.getFullYear());
}

export function getCurrentDate() {
    let today = new Date();
    let formatted_date = today.getFullYear() + "-" + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1)) + "-" + (today.getDate() > 9 ? today.getDate() : '0' + today.getDate());
    return formatted_date;
}

export function getCurrentTime() {
    let today = new Date();
    let formatted_time = (today.getHours() > 9 ? today.getHours() : '0' + today.getHours()) + ":" + (today.getMinutes() > 9 ? today.getMinutes() : '0' + today.getMinutes()) + ":" + (today.getSeconds() > 9 ? today.getSeconds() : '0' + today.getSeconds());
    return formatted_time;
}

export function fetch_timeout(url, header = { method: 'GET' }, timeout = 20000) {
    let primiseTime = new Promise(function (resolve, reject) {
        setTimeout(() => {
            reject({ "state": 0, "message": "Tiempo de espera agotado, intente nuevamente en un par de minutos." });
        }, timeout);
    });

    let promiseFetch = new Promise(function (resolve, reject) {
        fetch(url, header).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw '';
            }
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject({ "state": 0, "message": 'Se produjo un error al tratar de resolver la petición, intente nuevamente en un par de minutos.' });
        })
    })
    return Promise.race([primiseTime, promiseFetch]).then(result => result).catch(error => error);
}