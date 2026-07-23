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