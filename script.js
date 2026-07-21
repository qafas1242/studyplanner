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

// todolist 섹션
var tasks = []; 

// 데이터 저장
function savetasks() {
    const tasksstring = JSON.stringify(tasks);
    window.localStorage.setItem('tasks', tasksstring);
}

function addtask(task) {
    // 할일 데이터
    const taskName = task.name;
    const taskCompleted = task.completed;
    const taskDate = task.date;
    const taskDue = task.due;

    // #1 할일 요소 생성
    const taskitem = document.createElement('li');
    taskitem.classList.add('taskitem');
    tasklist.appendChild(taskitem);

    // #2 할일 체크박스 요소
    const taskcheckbox = document.createElement('button');
    taskcheckbox.classList.add('taskcheckbox');
    if (taskCompleted) { 
        taskcheckbox.classList.add('completed'); // 완료 여부 클래스 -> CSS에서 처리
    }
    taskcheckbox.addEventListener('click', function() {         // 완료 여부 토글
        task.completed = !task.completed;
        taskcheckbox.classList.toggle('completed')
        savetasks()  // 토글 후 자동 저장
    })
    taskitem.append(taskcheckbox);

    // #3 taskdata 요소
    const taskdata = document.createElement('div');
    taskdata.classList.add('taskdata')
    taskitem.append(taskdata);

    // #3-1 할일 이름 요소
    const taskname = document.createElement('input');
    taskname.classList.add('taskname');
    taskname.name = 'tasknamedisplay'
    taskname.type = 'text'
    taskname.value = taskName;
    taskname.addEventListener('focusout', function() {
        task.name = taskname.value     // 이름 자동 변경
        savetasks()                                 // 변경 후 자동 저장
    })
    taskdata.append(taskname);

    // #3-2 할일 세부사항 요소
    const taskdetail = document.createElement('div');
    taskdetail.classList.add('taskdetail')
    taskdetail.style.display = 'flex'
    taskdetail.style.gap = 'var(--spacing)'
    taskdata.append(taskdetail);

    // #3-2-1 할일 기한 요소
    const taskdue = document.createElement('input');
    taskdue.classList.add('taskdue');
    taskdue.name = 'taskdatedisplay'
    taskdue.type = 'date'
    taskdue.value = taskDue;
    taskdue.addEventListener('focusout', function() {
        task.due = taskdue.value         // 기한 자동 변경
        savetasks()                                 // 변경 후 자동 저장
    })
    taskdetail.append(taskdue);

    // #3-2-2 할일 날짜 요소
    const taskdate = document.createElement('input');
    taskdate.classList.add('taskdate');
    taskdate.name = 'taskdatedisplay'
    taskdate.type = 'date'
    taskdate.value = taskDate;
    taskdate.addEventListener('focusout', function() {
        task.date = taskdate.value;        // 날짜 자동 변경
        savetasks();                                 // 변경 후 자동 저장
    })
    taskdetail.append(taskdate);

    // #4 스페이싱
    const spacer = document.createElement('div');
    spacer.style.flexGrow = 1;
    taskitem.append(spacer)

    // #5 할일 삭제 버튼
    const taskdelete = document.createElement('button');
    taskdelete.classList.add('taskdelete');
    taskdelete.innerHTML = `<span class='material-symbols-rounded'>close</span>`;
    taskdelete.addEventListener('click', function(){
        tasks = tasks.filter(item => item !== task)
        savetasks();                                        // 삭제 후 자동 저장
        taskitem.classList.add('deleting');    // 삭제 클래스 -> CSS 애니메이션
        taskitem.addEventListener('animationend', function(){  // 애니메이션 끝나면 실제로 삭제
            tasklist.removeChild(taskitem)
        })
    })
    taskitem.append(taskdelete)
    savetasks();
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
    tasks.push({"name": taskname, "completed": false, "date": taskdate, "due": taskdue}); // 할일 추가
    addtask({"name": taskname, "completed": false, "date": taskdate, "due": taskdue})
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