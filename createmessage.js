// 문구 띄우기
function createmessage(content) {
    let warningelement = document.createElement('div');
    warningelement.classList.add('warning');
    warningelement.innerHTML = content
    document.getElementById('warnings').innerHTML = ''
    document.getElementById('warnings').appendChild(warningelement);
    warningelement.addEventListener('animationend', function() {
        warningelement.remove();
    })
    console.log(content);
}