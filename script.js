const accbtn = document.getElementById('accountbutton');
const accmenu = document.getElementById('accountmenu')
// 계정 메뉴
accbtn.addEventListener('click', function() {
    accmenu.classList.toggle('open')
    event.stopPropagation();
})

document.addEventListener('click', (event) => {
  if (!accmenu.contains(event.target)) {     // 클릭한 위치가 menu 안에 없으면 닫기
    accmenu.classList.remove('open');
  }
});
 
var tasks = []; 

// 데이터 저장
function savetasks() {
    const tasksstring = JSON.stringify(tasks);
    window.localStorage.setItem('tasks', tasksstring);
    // 로그인 상태이면 Firestore에도 저장
    if (window.userdata && window.saveTasksToFirestore) {
        window.saveTasksToFirestore(tasks).catch(err => console.error('Firestore save error', err));
    }
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
        createmessage('할일 이름이 비어 있습니다')
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