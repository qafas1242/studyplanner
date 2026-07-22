// 주의 문구 띄우기
function createwarning(content) {
    let warningelement = document.createElement('div');
    warningelement.classList.add('warning');
    warningelement.innerHTML = `<span class='material-symbols-rounded'>warning</span>
    <span>${content}</span>`
    document.getElementById('warnings').appendChild(warningelement);
    warningelement.addEventListener('animationend', function() {
        warningelement.remove();
    })
}
 
var tasks = []; 

// 데이터 저장
function savetasks() {
    const tasksstring = JSON.stringify(tasks);
    window.localStorage.setItem('tasks', tasksstring);
}

// 할일 목록을 바탕으로 렌더링
function rendertasklist() {
    const tasklist = document.getElementById('tasklist');
    tasklist.innerHTML = '';                                       // 기존 목록 초기화 후 새로 목록 그리기

    tasks.forEach(task => {
        addtask(task);
    })

    savetasks(); // 렌더 후 자동 저장
}

// 할일 추가 함수
function addtodo() {
    const taskname = document.getElementById('taskinput').value.trim();
    const taskdate = document.getElementById('taskdate').value;
    const taskdue = document.getElementById('taskdue').value;
    if (!taskname) {
        createwarning('할일 이름이 비어 있습니다')
        return; // 빈 입력은 추가하지 않음
    }
    const newtask = {"name": taskname, "completed": false, "date": taskdate, "due": taskdue}
    tasks.push(newtask); // 할일 추가
    addtask(newtask);
    document.getElementById('taskinput').value = ''; // 입력란 초기화
}

document.getElementById('addtaskbutton').addEventListener('click', addtodo)                // 추가 버튼으로 추가
document.getElementById('taskinput').addEventListener('keydown', function(e) {          // 입력창에서 엔터 눌러서 추가
    const keyName = e.key;
    if (keyName === 'Enter') {
        addtodo()
    }
})


// localstorage에서 가져오기
const savedata_tasks = window.localStorage.getItem('tasks');
if (savedata_tasks) {
    tasks = JSON.parse(savedata_tasks)
}

rendertasklist()