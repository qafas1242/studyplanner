// 데이터 저장
function savetasks() {
    const tasksstring = JSON.stringify(tasks);
    window.localStorage.setItem('tasks', tasksstring);
    const user = window.userdata;
    await setDoc(doc(db, "users", user.uid), {
        tasks: tasks
    });
}

// 데이터 가져오기
function gettasks() {
    const snapshot = await getDoc(doc(db, "users", user.uid));
    return snapshot;
}