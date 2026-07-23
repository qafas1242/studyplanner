// (auth 관련 함수는 "firebase/auth"에서, Firestore 함수는 "firebase/firestore"에서 옵니다)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

var tasks = []; 

//  문구 띄우기
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

// 1) Firebase 앱 초기화 (아까 복사한 config 붙여넣기)
const firebaseConfig = {
    apiKey: "AIzaSyAlg2oGp_gFugeRBc-xtYd2pkNH4dyDA4Y",
    authDomain: "study-planner-853d7.firebaseapp.com",
    projectId: "study-planner-853d7",
    storageBucket: "study-planner-853d7.firebasestorage.app",
    messagingSenderId: "125484878652",
    appId: "1:125484878652:web:24eec83e351f10a2486c39",
    measurementId: "G-XD3HLDZ4TQ"
};
const app = initializeApp(firebaseConfig);

// 2) 각 서비스 인스턴스 생성
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 3) 로그인 버튼 클릭 → 구글 팝업 로그인
document.getElementById("login").addEventListener("click", async () => {
    try {
        const authresult = await signInWithPopup(auth, provider);
        const user = authresult.user;
        console.log("로그인 성공:", user.displayName);
    } catch (error) {
        console.error("로그인 실패:", error.message);
    }
});

// 4) 로그아웃 버튼
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth);
});

// 데이터 저장
async function savetasks() {
    const tasksstring = JSON.stringify(tasks);
    window.localStorage.setItem('tasks', tasksstring);
    if (!window.userdata) { return 'Not logined'}
    await setDoc(doc(db, "users", window.userdata.uid), {
        tasks: tasksstring
    });
}

// 데이터 가져오기
async function gettasks() {
    const snapshot = await getDoc(doc(db, "users", window.userdata.uid));
    return snapshot.data().tasks;
}

// 로그인 상태 감지
onAuthStateChanged(auth, async (user) => {
    window.userdata = user;
    if (user) {
        createmessage(`${user.displayName} (${user.email}) 로그인됨`)
        document.getElementById('accountmenu').classList.add('logined');
        document.getElementById('logineduser').innerHTML = `(${user.displayName})`;
        const tasksraw = await gettasks();
        tasks = JSON.parse(tasksraw);
        console.log(tasks);
        rendertasklist();
    } else {
        createmessage("로그인되어 있지 않음")
        document.getElementById('accountmenu').classList.remove('logined');
        document.getElementById('logineduser').innerHTML = '';
        tasks = [];
        rendertasklist();
    }
});

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
    
    // #3-2-1 할일 날짜 래퍼
    const taskdatewrap = document.createElement('div');
    taskdatewrap.classList.add('taskduewrap');
    taskdatewrap.setAttribute('data-wrap', '');
    taskdetail.append(taskdatewrap);

        // 아이콘
        const taskdateicon = document.createElement('span');
        taskdateicon.classList.add('material-symbols-rounded');
        taskdateicon.innerHTML = 'calendar_today';
        taskdatewrap.append(taskdateicon);

        // 실제 input
        const taskdate = document.createElement('input');
        taskdate.classList.add('taskdate');
        taskdate.type = 'text'
        taskdate.value = taskDate;
        taskdate.placeholder = '예정일...'
        taskdate.setAttribute('data-input', '');
        taskdatewrap.append(taskdate);

            // 3-2-1에 fletpickr 적용
            flatpickr(taskdatewrap, {
                wrap: true,
                dateFormat: "Y-m-d",
                disableMobile: true,
                altInput: true,
                altFormat: "m월 d일",
                altInputClass: "taskdate-alt",
                appendTo: document.getElementById('flatpickr'),
                onChange: function() {
                    task.date = taskdate.value
                    savetasks()
                }
            })
    
    // #3-2-2 할일 기한 래퍼
    const taskduewrap = document.createElement('div');
    taskduewrap.classList.add('taskduewrap');
    taskduewrap.setAttribute('data-wrap', '');
    taskdetail.append(taskduewrap);

        // 아이콘
        const taskdueicon = document.createElement('span');
        taskdueicon.classList.add('material-symbols-rounded');
        taskdueicon.innerHTML = 'flag_2';
        taskduewrap.append(taskdueicon);

        // 실제 input
        const taskdue = document.createElement('input');
        taskdue.classList.add('taskdue');
        taskdue.type = 'text'
        taskdue.value = taskDue;
        taskdue.placeholder = '마감일...'
        taskdue.setAttribute('data-input', '');
        taskduewrap.append(taskdue);

            // 3-2-2에 fletpickr 적용
            flatpickr(taskduewrap, {
                wrap: true,
                dateFormat: "Y-m-d",
                disableMobile: true,
                altInput: true,
                altFormat: "m월 d일",
                altInputClass: "taskdue-alt",
                appendTo: document.getElementById('flatpickr'),
                onChange: function() {
                    task.due = taskdue.value
                    savetasks()
                }
            });

    

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


// // localstorage에서 가져오기
// const savedata_tasks = window.localStorage.tasks;
// console.log(window.localStorage.tasks)
// if (savedata_tasks) {
//     tasks = JSON.parse(savedata_tasks)
// }


// 계정 메뉴
const accbtn = document.getElementById('accountbutton');
const accmenu = document.getElementById('accountmenu')
accbtn.addEventListener('click', function() {
    accmenu.classList.toggle('open')
    event.stopPropagation();
})

document.addEventListener('click', (event) => {
  if (!accmenu.contains(event.target)) {     // 클릭한 위치가 menu 안에 없으면 닫기
    accmenu.classList.remove('open');
  }
});

document.getElementById('save').addEventListener('click', function() {
    savetasks()
})
