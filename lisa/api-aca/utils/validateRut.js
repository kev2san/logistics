module.exports = function checkRut(rutCompleto) {

    if (!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto))
    return false;
    var tmp = rutCompleto.split('-');
    var digv = tmp[1];
    if (digv == 'K') digv = 'k';
    var rut = tmp[0];
    return (dv(rut) == digv);

}
function dv(T) {
    var M = 0,
        S = 1;
    for (; T; T = Math.floor(T / 10))
        S = (S + T % 10 * (9 - M++ % 6)) % 11;
    return S ? S - 1 : 'k';
}
