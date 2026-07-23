// (auth 관련 함수는 "firebase/auth"에서, Firestore 함수는 "firebase/firestore"에서 옵니다)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

        // 로그인한 유저 정보를 Firestore에 저장 (users 컬렉션, 문서 ID = uid)
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: new Date()
        });
    } catch (error) {
        console.error("로그인 실패:", error.message);
    }
});

// 4) 로그아웃 버튼
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth);
});

// // 5) 로그인 상태 감지
onAuthStateChanged(auth, (user) => {
    window.userdata = user;
    if (user) {
        createmessage(`${user.displayName} (${user.email}) 로그인됨`)
        document.getElementById('accountmenu').classList.add('logined');
        document.getElementById('logineduser').innerHTML = `(${user.displayName})`;
        // 로그인하면 Firestore에서 저장된 task 불러오기 (있으면 로컬 tasks 대체)
        if (window.getTasksFromFirestore) {
            window.getTasksFromFirestore().then(fetched => {
                if (fetched && Array.isArray(fetched) && fetched.length > 0) {
                    window.tasks = fetched;
                    if (window.rendertasklist) window.rendertasklist();
                    createmessage('Firestore에서 할일 불러옴');
                }
            }).catch(err => console.error('getTasksFromFirestore error', err));
        }
    } else {
        createmessage("로그인되어 있지 않음")
        document.getElementById('accountmenu').classList.remove('logined');
        document.getElementById('logineduser').innerHTML = '';
    }
});

// Firestore에 tasks 배열을 저장 (문서 ID = uid)
async function saveTasksToFirestore(tasks) {
    try {
        const user = auth.currentUser || window.userdata;
        if (!user) throw new Error('사용자 로그인 필요');
        await setDoc(doc(db, 'tasks', user.uid), {
            tasks: tasks,
            updatedAt: serverTimestamp()
        });
        console.log('Tasks saved to Firestore for', user.uid);
    } catch (err) {
        console.error('saveTasksToFirestore', err);
        throw err;
    }
}
window.saveTasksToFirestore = saveTasksToFirestore;

// Firestore에서 tasks 배열을 불러옴 (문서 ID = uid)
async function getTasksFromFirestore() {
    try {
        const user = auth.currentUser || window.userdata;
        if (!user) throw new Error('사용자 로그인 필요');
        const snap = await getDoc(doc(db, 'tasks', user.uid));
        if (snap.exists()) {
            return snap.data().tasks || [];
        }
        return [];
    } catch (err) {
        console.error('getTasksFromFirestore', err);
        return [];
    }
}
window.getTasksFromFirestore = getTasksFromFirestore;