import { auth, db, storage } from "./firebase.js";

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


/* =========================================================
   GENEL
========================================================= */

const $ = id => document.getElementById(id);

const path = window.location.pathname.toLowerCase();

const isIndex =
    path.endsWith("index.html") ||
    path === "/" ||
    path.endsWith("/");

const isStudent =
    path.endsWith("student.html");

const isTeacher =
    path.endsWith("teacher.html");


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function show(element) {

    if (element) {
        element.classList.remove("hidden");
    }

}


function hide(element) {

    if (element) {
        element.classList.add("hidden");
    }

}


function showToast(message, type = "student") {

    const element =
        type === "teacher"
            ? $("teacherToast")
            : $("studentToast");

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");

    clearTimeout(element._timer);

    element._timer = setTimeout(() => {

        element.classList.remove("show");

    }, 3000);

}


function showLoading(type, value) {

    const element =
        type === "teacher"
            ? $("teacherLoading")
            : $("studentLoading");

    if (!element) return;

    element.classList.toggle("hidden", !value);

}


function firebaseMessage(error) {

    const messages = {

        "auth/invalid-credential":
            "E-posta veya şifre yanlış.",

        "auth/wrong-password":
            "Şifre yanlış.",

        "auth/user-not-found":
            "Kullanıcı bulunamadı.",

        "auth/email-already-in-use":
            "Bu e-posta zaten kayıtlı.",

        "auth/invalid-email":
            "Geçerli bir e-posta adresi gir.",

        "auth/weak-password":
            "Şifre en az 6 karakter olmalı.",

        "auth/network-request-failed":
            "İnternet bağlantısını kontrol et."

    };

    return messages[error.code] || "Bir hata oluştu.";

}


/* =========================================================
   INDEX / AUTH
========================================================= */

if (isIndex) {

    const loginForm = $("loginForm");
    const registerForm = $("registerForm");

    const loginTab = $("loginTab");
    const registerTab = $("registerTab");

    if (loginTab && registerTab) {

        loginTab.addEventListener("click", () => {

            loginTab.classList.add("active");
            registerTab.classList.remove("active");

            show(loginForm);
            hide(registerForm);

            if ($("authTitle")) {
                $("authTitle").textContent = "Hoş Geldin";
            }

            if ($("authDescription")) {
                $("authDescription").textContent =
                    "Beray Eğitim Platformu'na giriş yap";
            }

        });


        registerTab.addEventListener("click", () => {

            registerTab.classList.add("active");
            loginTab.classList.remove("active");

            hide(loginForm);
            show(registerForm);

            if ($("authTitle")) {
                $("authTitle").textContent =
                    "Hesap Oluştur";
            }

            if ($("authDescription")) {
                $("authDescription").textContent =
                    "Beray ailesine katıl";
            }

        });

    }


    if ($("toggleLoginPassword")) {

        $("toggleLoginPassword").onclick = () => {

            const input = $("loginPassword");

            input.type =
                input.type === "password"
                    ? "text"
                    : "password";

        };

    }


    if ($("toggleRegisterPassword")) {

        $("toggleRegisterPassword").onclick = () => {

            const input = $("registerPassword");

            input.type =
                input.type === "password"
                    ? "text"
                    : "password";

        };

    }


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const email =
                    $("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();

                const password =
                    $("loginPassword")
                    .value;

                const error =
                    $("loginError");

                hide(error);

                try {

                    $("loginButton")
                        ?.classList.add("loading-btn");

                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                } catch (err) {

                    if (error) {

                        error.textContent =
                            firebaseMessage(err);

                        show(error);

                    }

                } finally {

                    $("loginButton")
                        ?.classList.remove("loading-btn");

                }

            }
        );

    }


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const error =
                    $("registerError");

                hide(error);


                const name =
                    $("registerName")
                    .value
                    .trim();

                const email =
                    $("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();

                const password =
                    $("registerPassword")
                    .value;

                const confirm =
                    $("registerPasswordConfirm")
                    .value;


                if (password !== confirm) {

                    error.textContent =
                        "Şifreler aynı değil.";

                    show(error);

                    return;

                }


                try {

                    $("registerButton")
                        ?.classList.add("loading-btn");


                    const credential =
                        await createUserWithEmailAndPassword(
                            auth,
                            email,
                            password
                        );


                    await updateProfile(
                        credential.user,
                        {
                            displayName: name
                        }
                    );


                    await setDoc(
                        doc(
                            db,
                            "users",
                            credential.user.uid
                        ),
                        {

                            uid:
                                credential.user.uid,

                            name,

                            email,

                            role:
                                "student",

                            points:
                                0,

                            completedLessons:
                                [],

                            completedTests:
                                [],

                            createdAt:
                                serverTimestamp()

                        }
                    );


                } catch (err) {

                    error.textContent =
                        firebaseMessage(err);

                    show(error);

                } finally {

                    $("registerButton")
                        ?.classList.remove(
                            "loading-btn"
                        );

                }

            }
        );

    }


    if ($("forgotPassword")) {

        $("forgotPassword").onclick = () => {

            show($("forgotModal"));

            const currentEmail =
                $("loginEmail")?.value?.trim();

            if (currentEmail) {

                $("resetEmail").value =
                    currentEmail;

            }

        };

    }


    if ($("closeForgotModal")) {

        $("closeForgotModal").onclick = () => {

            hide($("forgotModal"));

        };

    }


    if ($("forgotModal")) {

        $("forgotModal").addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("forgotModal")
                ) {

                    hide($("forgotModal"));

                }

            }
        );

    }


    if ($("resetButton")) {

        $("resetButton").onclick =
            async () => {

                const email =
                    $("resetEmail")
                    .value
                    .trim()
                    .toLowerCase();

                if (!email) {

                    $("resetMessage").textContent =
                        "E-posta adresini gir.";

                    return;

                }

                try {

                    await sendPasswordResetEmail(
                        auth,
                        email
                    );

                    $("resetMessage").textContent =
                        "Şifre yenileme bağlantısı e-posta adresine gönderildi.";

                } catch (err) {

                    $("resetMessage").textContent =
                        firebaseMessage(err);

                }

            };

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        try {

            if (!user) {

                if (isStudent) {

                    hide($("studentApp"));

                }

                if (isTeacher) {

                    hide($("teacherApp"));

                }

                return;

            }


            const snapshot =
                await getDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    )
                );


            if (!snapshot.exists()) {

                await signOut(auth);

                return;

            }


            const profile =
                snapshot.data();


            /* Ana giriş */

            if (isIndex) {

                if (profile.role === "student") {

                    window.location.href =
                        "./student.html";

                } else {

                    window.location.href =
                        "./teacher.html";

                }

                return;

            }


            /* Öğrenci */

            if (isStudent) {

                if (profile.role !== "student") {

                    window.location.href =
                        "./teacher.html";

                    return;

                }

                await initStudent(
                    user,
                    profile
                );

                return;

            }


            /* Öğretmen/Admin */

            if (isTeacher) {

                if (
                    profile.role !== "teacher" &&
                    profile.role !== "admin"
                ) {

                    window.location.href =
                        "./student.html";

                    return;

                }

                await initTeacher(
                    user,
                    profile
                );

            }

        } catch (error) {

            console.error(error);

        } finally {

            if (isStudent) {
                showLoading("student", false);
            }

            if (isTeacher) {
                showLoading("teacher", false);
            }

        }

    }
);


/* =========================================================
   ÖĞRENCİ SİSTEMİ
========================================================= */

let studentState = {

    courses: [],
    tests: [],
    results: [],
    announcements: [],
    profile: null

};


async function initStudent(user, profile) {

    show($("studentApp"));

    studentState.profile =
        profile;


    const name =
        profile.name ||
        user.displayName ||
        "Öğrenci";


    const initial =
        name.charAt(0).toUpperCase();


    if ($("studentName")) {
        $("studentName").textContent =
            name;
    }


    if ($("studentAvatar")) {
        $("studentAvatar").textContent =
            initial;
    }


    if ($("profileAvatar")) {
        $("profileAvatar").textContent =
            initial;
    }


    if ($("profileName")) {
        $("profileName").textContent =
            name;
    }


    if ($("profileEmail")) {
        $("profileEmail").textContent =
            user.email;
    }


    if ($("welcomeName")) {
        $("welcomeName").textContent =
            name.split(" ")[0];
    }


    $("studentLogout").onclick =
        () => signOut(auth);


    $("studentMenu").onclick =
        () => {

            $("studentSidebar")
                ?.classList.toggle("open");

        };


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.onclick = () => {

                openStudentPage(
                    button.dataset.page,
                    button
                );

            };

        });


    document
        .querySelectorAll("[data-go-page]")
        .forEach(button => {

            button.onclick = () => {

                openStudentPage(
                    button.dataset.goPage
                );

            };

        });


    if ($("courseSearch")) {

        $("courseSearch")
            .addEventListener(
                "input",
                renderStudentCourses
            );

    }


    if ($("courseFilter")) {

        $("courseFilter")
            .addEventListener(
                "change",
                renderStudentCourses
            );

    }


    if ($("notificationButton")) {

        $("notificationButton").onclick =
            () => {

                show(
                    $("notificationPanel")
                );

            };

    }


    if ($("closeNotificationPanel")) {

        $("closeNotificationPanel").onclick =
            () => {

                hide(
                    $("notificationPanel")
                );

            };

    }


    document
        .querySelectorAll("[data-test-filter]")
        .forEach(button => {

            button.onclick = () => {

                document
                    .querySelectorAll(
                        "[data-test-filter]"
                    )
                    .forEach(
                        b => b.classList.remove("active")
                    );


                button.classList.add("active");

                renderStudentTests(
                    button.dataset.testFilter
                );

            };

        });


    if ($("backFromQuiz")) {

        $("backFromQuiz").onclick = () => {

            openStudentPage("tests");

        };

    }


    await refreshStudent();

}


function openStudentPage(
    pageName,
    clickedButton = null
) {

    document
        .querySelectorAll(".student-page")
        .forEach(section => {

            section.classList.remove("active");

        });


    const target =
        $("student-" + pageName);


    if (target) {

        target.classList.add("active");

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove("active");

        });


    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        const matchingButton =
            document.querySelector(
                `.nav-btn[data-page="${pageName}"]`
            );

        matchingButton?.classList.add("active");

    }


    const titles = {

        dashboard:
            "Ana Sayfa",

        courses:
            "Dersler",

        tests:
            "Testler",

        results:
            "Sonuçlarım",

        announcements:
            "Duyurular",

        profile:
            "Profilim",

        quiz:
            "Test"

    };


    if ($("studentPageTitle")) {

        $("studentPageTitle")
            .textContent =
            titles[pageName] ||
            "Beray";

    }


    $("studentSidebar")
        ?.classList.remove("open");

}


async function refreshStudent() {

    const uid =
        auth.currentUser?.uid;


    if (!uid) return;


    const userSnapshot =
        await getDoc(
            doc(
                db,
                "users",
                uid
            )
        );


    studentState.profile =
        userSnapshot.data();


    const coursesSnapshot =
        await getDocs(
            query(
                collection(
                    db,
                    "courses"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(100)
            )
        );


    const testsSnapshot =
        await getDocs(
            query(
                collection(
                    db,
                    "tests"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(100)
            )
        );


    const resultsSnapshot =
        await getDocs(
            query(
                collection(
                    db,
                    "results"
                ),
                where(
                    "studentId",
                    "==",
                    uid
                ),
                limit(200)
            )
        );


    const announcementsSnapshot =
        await getDocs(
            query(
                collection(
                    db,
                    "announcements"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(50)
            )
        );


    studentState.courses =
        coursesSnapshot.docs.map(
            document => ({
                id: document.id,
                ...document.data()
            })
        );


    studentState.tests =
        testsSnapshot.docs.map(
            document => ({
                id: document.id,
                ...document.data()
            })
        );


    studentState.results =
        resultsSnapshot.docs
            .map(
                document => ({
                    id: document.id,
                    ...document.data()
                })
            )
            .sort(
                (a,b) =>
                    (b.createdAt?.seconds || 0)
                    -
                    (a.createdAt?.seconds || 0)
            );


    studentState.announcements =
        announcementsSnapshot.docs.map(
            document => ({
                id: document.id,
                ...document.data()
            })
        );


    updateStudentDashboard();

    renderStudentCourses();

    renderStudentTests("all");

    renderStudentResults();

    renderStudentAnnouncements();

    updateNotificationCount();

}


function updateStudentDashboard() {

    const profile =
        studentState.profile || {};


    const lessons =
        (
            profile.completedLessons ||
            []
        ).length;


    const tests =
        (
            profile.completedTests ||
            []
        ).length;


    const results =
        studentState.results;


    const average =
        results.length
            ? Math.round(
                results.reduce(
                    (total,result) =>
                        total +
                        Number(
                            result.score || 0
                        ),
                    0
                ) / results.length
            )
            : 0;


    if ($("dashboardLessons")) {

        $("dashboardLessons")
            .textContent = lessons;

    }


    if ($("dashboardTests")) {

        $("dashboardTests")
            .textContent = tests;

    }


    if ($("dashboardAverage")) {

        $("dashboardAverage")
            .textContent =
            average + "%";

    }


    if ($("dashboardPoints")) {

        $("dashboardPoints")
            .textContent =
            profile.points || 0;

    }


    if ($("profilePoints")) {

        $("profilePoints")
            .textContent =
            profile.points || 0;

    }


    if ($("profileLessons")) {

        $("profileLessons")
            .textContent =
            lessons;

    }


    if ($("profileTests")) {

        $("profileTests")
            .textContent =
            tests;

    }

}


function renderStudentCourses() {

    const container =
        $("studentCourses");

    const dashboard =
        $("dashboardCourses");


    if (!container) return;


    const search =
        (
            $("courseSearch")?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const filtered =
        studentState.courses.filter(
            course => {

                const title =
                    String(
                        course.title || ""
                    )
                    .toLowerCase();


                return !search ||
                    title.includes(search);

            }
        );


    const profile =
        studentState.profile || {};


    const completed =
        profile.completedLessons || [];


    const makeCard =
        course => `

        <article class="card">

            <div class="card-icon">
                ${escapeHTML(
                    course.icon || "📚"
                )}
            </div>

            <h3>
                ${escapeHTML(
                    course.title || "Ders"
                )}
            </h3>

            <p class="muted">
                ${escapeHTML(
                    course.description || ""
                )}
            </p>

            ${
                course.videoUrl
                    ? `
                    <a
                        class="ghost-button"
                        href="${escapeHTML(course.videoUrl)}"
                        target="_blank"
                        rel="noopener">
                        ▶ Videoyu Aç
                    </a>
                    `
                    : ""
            }

            ${
                course.fileUrl
                    ? `
                    <a
                        class="ghost-button"
                        href="${escapeHTML(course.fileUrl)}"
                        target="_blank"
                        rel="noopener">
                        📄 İçeriği Aç
                    </a>
                    `
                    : ""
            }

            <button
                class="ghost-button"
                data-complete-course="${course.id}">

                ${
                    completed.includes(course.id)
                        ? "Tamamlandı ✓"
                        : "Dersi Tamamla"
                }

            </button>

        </article>

    `;


    container.innerHTML =
        filtered
            .map(makeCard)
            .join("")
        ||
        `<div class="card">
            <h3>Ders bulunamadı</h3>
            <p class="muted">
                Henüz yayınlanmış bir ders yok.
            </p>
        </div>`;


    if (dashboard) {

        dashboard.innerHTML =
            studentState.courses
                .slice(0,3)
                .map(makeCard)
                .join("")
            ||
            `<div class="card">
                <h3>Henüz ders yok</h3>
                <p class="muted">
                    Öğretmenin ders eklediğinde burada görünecek.
                </p>
            </div>`;

    }


    document
        .querySelectorAll(
            "[data-complete-course]"
        )
        .forEach(button => {

            button.onclick =
                () =>
                    completeStudentCourse(
                        button.dataset.completeCourse
                    );

        });

}


async function completeStudentCourse(courseId) {

    const uid =
        auth.currentUser?.uid;


    if (!uid) return;


    const reference =
        doc(
            db,
            "users",
            uid
        );


    const snapshot =
        await getDoc(reference);


    const profile =
        snapshot.data();


    const completed =
        [
            ...(profile.completedLessons || [])
        ];


    if (completed.includes(courseId)) {

        showToast(
            "Bu ders zaten tamamlandı."
        );

        return;

    }


    completed.push(courseId);


    await updateDoc(
        reference,
        {

            completedLessons:
                completed,

            points:
                (profile.points || 0)
                + 10

        }
    );


    showToast(
        "Ders tamamlandı. +10 puan ⭐"
    );


    await refreshStudent();

}


function renderStudentTests(filter = "all") {

    const container =
        $("studentTests");


    const tests =
        studentState.tests;


    const results =
        studentState.results;


    let filtered =
        tests;


    if (filter === "new") {

        filtered =
            tests.filter(
                test =>
                    !results.some(
                        result =>
                            result.testId === test.id
                    )
            );

    }


    if (filter === "done") {

        filtered =
            tests.filter(
                test =>
                    results.some(
                        result =>
                            result.testId === test.id
                    )
            );

    }


    container.innerHTML =
        filtered.map(
            test => {

                const previous =
                    results.find(
                        result =>
                            result.testId === test.id
                    );


                return `

                <article class="test-item">

                    <div>

                        <h3>
                            ${escapeHTML(
                                test.title
                            )}
                        </h3>

                        <p class="muted">
                            ${escapeHTML(
                                test.description || ""
                            )}
                        </p>

                        <small class="muted">
                            ${(test.questions || []).length}
                            soru
                        </small>

                    </div>

                    <div class="test-action">

                        ${
                            previous
                                ? `
                                <span class="score-pill">
                                    Sonuç: ${previous.score}%
                                </span>
                                `
                                : ""
                        }

                        <button
                            class="primary-button"
                            data-start-test="${test.id}">

                            ${
                                previous
                                    ? "Tekrar Çöz"
                                    : "Teste Başla"
                            }

                        </button>

                    </div>

                </article>
            `;

            }
        ).join("")
        ||
        `<div class="card">
            <h3>Test bulunamadı</h3>
            <p class="muted">
                Henüz uygun test bulunmuyor.
            </p>
        </div>`;


    document
        .querySelectorAll(
            "[data-start-test]"
        )
        .forEach(button => {

            button.onclick = () => {

                const test =
                    tests.find(
                        item =>
                            item.id ===
                            button.dataset.startTest
                    );


                startStudentQuiz(test);

            };

        });

}


function renderStudentResults() {

    const container =
        $("studentResults");


    const results =
        studentState.results;


    const scores =
        results.map(
            result =>
                Number(
                    result.score || 0
                )
        );


    const average =
        scores.length
            ? Math.round(
                scores.reduce(
                    (a,b)=>a+b,
                    0
                ) / scores.length
            )
            : 0;


    const best =
        scores.length
            ? Math.max(...scores)
            : 0;


    if ($("resultAverage")) {

        $("resultAverage")
            .textContent =
            average + "%";

    }


    if ($("resultBest")) {

        $("resultBest")
            .textContent =
            best + "%";

    }


    if ($("resultTotal")) {

        $("resultTotal")
            .textContent =
            results.length;

    }


    container.innerHTML =
        results.map(
            result => `

            <article class="test-item">

                <div>

                    <h3>
                        ${escapeHTML(
                            result.testTitle
                        )}
                    </h3>

                    <p class="muted">

                        ${result.correct || 0}
                        doğru ·

                        ${result.wrong || 0}
                        yanlış

                    </p>

                </div>

                <strong>
                    ${result.score || 0}%
                </strong>

            </article>

        `
        ).join("")
        ||
        `<div class="card">
            <h3>Henüz sonuç yok</h3>
            <p class="muted">
                Bir test çözdüğünde sonuçların burada görünecek.
            </p>
        </div>`;

}


function renderStudentAnnouncements() {

    const container =
        $("studentAnnouncements");


    container.innerHTML =
        studentState.announcements.map(
            announcement => `

            <article class="announcement-card">

                <div class="announcement-icon">
                    📢
                </div>

                <div>

                    <h3>
                        ${escapeHTML(
                            announcement.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            announcement.body
                        )}
                    </p>

                </div>

            </article>

        `
        ).join("")
        ||
        `<div class="card">
            <h3>Henüz duyuru yok</h3>
        </div>`;

}


function updateNotificationCount() {

    const count =
        studentState.announcements.length;


    if ($("announcementBadge")) {

        $("announcementBadge")
            .textContent =
            count;

        $("announcementBadge")
            .classList.toggle(
                "hidden",
                count === 0
            );

    }


    if ($("notificationCount")) {

        $("notificationCount")
            .textContent =
            count;

        $("notificationCount")
            .classList.toggle(
                "hidden",
                count === 0
            );

    }


    if ($("notificationList")) {

        $("notificationList").innerHTML =
            studentState.announcements
                .slice(0,10)
                .map(
                    announcement => `

                    <div class="notification-item">

                        <strong>
                            ${escapeHTML(
                                announcement.title
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                announcement.body
                            )}
                        </p>

                    </div>

                `
                )
                .join("")
            ||
            `
            <div class="notification-empty">
                Bildirim yok.
            </div>
            `;

    }

}


/* =========================================================
   QUIZ
========================================================= */

async function startStudentQuiz(test) {

    if (
        !test ||
        !test.questions ||
        !test.questions.length
    ) {

        showToast(
            "Bu testte soru bulunmuyor."
        );

        return;

    }


    openStudentPage("quiz");


    let currentQuestion = 0;

    let correct = 0;

    let answered = false;


    function renderQuestion() {

        answered = false;


        const question =
            test.questions[
                currentQuestion
            ];


        const total =
            test.questions.length;


        $("quizBox").innerHTML = `

            <div class="quiz-top">

                <div>

                    <span class="eyebrow">
                        TEST
                    </span>

                    <h1>
                        ${escapeHTML(
                            test.title
                        )}
                    </h1>

                </div>

                <strong>
                    ${currentQuestion + 1}
                    /
                    ${total}
                </strong>

            </div>


            <div class="quiz-progress">

                <div
                    class="quiz-progress-bar"
                    style="
                        width:
                        ${
                            (
                                (currentQuestion + 1)
                                /
                                total
                            ) * 100
                        }%
                    ">

                </div>

            </div>


            <div class="quiz-question">

                <h2>
                    ${escapeHTML(
                        question.question
                    )}
                </h2>


                <div class="quiz-answers">

                    ${
                        (
                            question.options || []
                        )
                        .map(
                            (
                                option,
                                index
                            ) => `

                            <button
                                class="answer"
                                data-answer="${index}">

                                <span>
                                    ${
                                        String.fromCharCode(
                                            65 + index
                                        )
                                    }
                                </span>

                                ${escapeHTML(option)}

                            </button>

                        `
                        )
                        .join("")
                    }

                </div>

            </div>

        `;


        document
            .querySelectorAll(
                "[data-answer]"
            )
            .forEach(button => {

                button.onclick = () => {

                    if (answered) {
                        return;
                    }


                    answered = true;


                    const selected =
                        Number(
                            button.dataset.answer
                        );


                    const correctIndex =
                        Number(
                            question.correctAnswer
                        );


                    document
                        .querySelectorAll(
                            "[data-answer]"
                        )
                        .forEach(
                            (
                                answerButton,
                                index
                            ) => {

                                answerButton
                                    .disabled =
                                    true;


                                if (
                                    index ===
                                    correctIndex
                                ) {

                                    answerButton
                                        .classList
                                        .add("correct");

                                }


                                if (
                                    index ===
                                    selected &&
                                    index !==
                                    correctIndex
                                ) {

                                    answerButton
                                        .classList
                                        .add("wrong");

                                }

                            }
                        );


                    if (
                        selected ===
                        correctIndex
                    ) {

                        correct++;

                    }


                    const next =
                        document.createElement(
                            "button"
                        );


                    next.className =
                        "primary-button";


                    next.style.marginTop =
                        "20px";


                    next.textContent =
                        currentQuestion ===
                        total - 1
                            ? "Testi Bitir"
                            : "Sonraki Soru";


                    next.onclick = () => {

                        currentQuestion++;


                        if (
                            currentQuestion <
                            total
                        ) {

                            renderQuestion();

                        } else {

                            finishQuiz();

                        }

                    };


                    $("quizBox")
                        .appendChild(next);

                };

            });

    }


    async function finishQuiz() {

        const total =
            test.questions.length;


        const score =
            Math.round(
                correct / total * 100
            );


        const wrong =
            total - correct;


        const uid =
            auth.currentUser.uid;


        await addDoc(
            collection(
                db,
                "results"
            ),
            {

                studentId:
                    uid,

                studentName:
                    auth.currentUser
                        .displayName || "",

                testId:
                    test.id,

                testTitle:
                    test.title,

                correct,

                wrong,

                score,

                createdAt:
                    serverTimestamp()

            }
        );


        const userRef =
            doc(
                db,
                "users",
                uid
            );


        const userSnap =
            await getDoc(userRef);


        const profile =
            userSnap.data();


        const completed =
            [
                ...(profile.completedTests || [])
            ];


        if (
            !completed.includes(test.id)
        ) {

            completed.push(test.id);

        }


        await updateDoc(
            userRef,
            {

                completedTests:
                    completed,

                points:
                    (
                        profile.points || 0
                    )
                    +
                    (
                        correct * 5
                    )

            }
        );


        $("quizBox").innerHTML = `

            <div class="quiz-result">

                <div class="result-icon">

                    ${
                        score >= 80
                            ? "🏆"
                            : score >= 50
                            ? "⭐"
                            : "📚"
                    }

                </div>

                <h1>
                    Test Tamamlandı
                </h1>

                <p class="muted">

                    ${correct}
                    /
                    ${total}
                    doğru cevap

                </p>

                <strong class="big-score">

                    ${score}%

                </strong>

                <p class="yellow-text">

                    +${correct * 5} puan

                </p>

                <button
                    id="quizReturn"
                    class="primary-button">

                    Testlere Dön

                </button>

            </div>

        `;


        $("quizReturn").onclick = () => {

            openStudentPage("tests");

            refreshStudent();

        };

    }


    renderQuestion();

}


/* =========================================================
   ÖĞRETMEN / ADMİN
========================================================= */

let teacherState = {

    profile: null,
    courses: [],
    tests: [],
    students: [],
    results: [],
    announcements: [],
    users: []

};


async function initTeacher(user,profile) {

    show($("teacherApp"));


    teacherState.profile =
        profile;


    const name =
        profile.name ||
        user.displayName ||
        "Yönetici";


    const role =
        profile.role;


    if ($("teacherName")) {

        $("teacherName")
            .textContent =
            name;

    }


    if ($("dashboardTeacherName")) {

        $("dashboardTeacherName")
            .textContent =
            name.split(" ")[0];

    }


    const initial =
        name.charAt(0).toUpperCase();


    if ($("teacherAvatar")) {

        $("teacherAvatar")
            .textContent =
            initial;

    }


    if ($("sidebarTeacherAvatar")) {

        $("sidebarTeacherAvatar")
            .textContent =
            initial;

    }


    if ($("sidebarTeacherName")) {

        $("sidebarTeacherName")
            .textContent =
            name;

    }


    if ($("sidebarTeacherRole")) {

        $("sidebarTeacherRole")
            .textContent =
            role === "admin"
                ? "Admin"
                : "Öğretmen";

    }


    if ($("teacherRole")) {

        $("teacherRole")
            .textContent =
            role === "admin"
                ? "Admin"
                : "Öğretmen";

    }


    if ($("teacherRoleLabel")) {

        $("teacherRoleLabel")
            .textContent =
            role === "admin"
                ? "ADMİN PANELİ"
                : "ÖĞRETMEN PANELİ";

    }


    if (role === "admin") {

        show($("adminUsersNav"));

    }


    $("teacherLogout").onclick =
        () => signOut(auth);


    $("teacherMenu").onclick =
        () => {

            $("teacherSidebar")
                ?.classList.toggle("open");

        };


    document
        .querySelectorAll(".teacher-nav")
        .forEach(button => {

            button.onclick = () => {

                openTeacherPage(
                    button.dataset.page,
                    button
                );

            };

        });


    document
        .querySelectorAll("[data-modal]")
        .forEach(button => {

            button.onclick = () => {

                openTeacherModal(
                    button.dataset.modal
                );

            };

        });


    if ($("closeModal")) {

        $("closeModal").onclick =
            () => hide($("modal"));

    }


    await refreshTeacher();

}


function openTeacherPage(
    pageName,
    button = null
) {

    document
        .querySelectorAll(".teacher-page")
        .forEach(section => {

            section.classList.remove("active");

        });


    const target =
        $("teacher-" + pageName);


    if (target) {

        target.classList.add("active");

    }


    document
        .querySelectorAll(".teacher-nav")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    } else {

        document
            .querySelector(
                `.teacher-nav[data-page="${pageName}"]`
            )
            ?.classList.add("active");

    }


    const titles = {

        dashboard:
            "Genel Bakış",

        courses:
            "Dersler",

        lessons:
            "Konu / İçerik",

        tests:
            "Testler",

        students:
            "Öğrenciler",

        results:
            "Sonuçlar",

        announcements:
            "Duyurular",

        users:
            "Kullanıcılar"

    };


    if ($("teacherPageTitle")) {

        $("teacherPageTitle")
            .textContent =
            titles[pageName] ||
            "Beray";

    }


    $("teacherSidebar")
        ?.classList.remove("open");

}


async function refreshTeacher() {

    const profileSnap =
        await getDoc(
            doc(
                db,
                "users",
                auth.currentUser.uid
            )
        );


    const profile =
        profileSnap.data();


    teacherState.profile =
        profile;


    const [
        coursesSnap,
        testsSnap,
        studentsSnap,
        resultsSnap,
        announcementsSnap
    ] = await Promise.all([

        getDocs(
            query(
                collection(db,"courses"),
                orderBy("createdAt","desc"),
                limit(100)
            )
        ),

        getDocs(
            query(
                collection(db,"tests"),
                orderBy("createdAt","desc"),
                limit(100)
            )
        ),

        getDocs(
            query(
                collection(db,"users"),
                where("role","==","student"),
                limit(500)
            )
        ),

        getDocs(
            query(
                collection(db,"results"),
                orderBy("createdAt","desc"),
                limit(500)
            )
        ),

        getDocs(
            query(
                collection(db,"announcements"),
                orderBy("createdAt","desc"),
                limit(100)
            )
        )

    ]);


    teacherState.courses =
        coursesSnap.docs.map(
            document=>({
                id:document.id,
                ...document.data()
            })
        );


    teacherState.tests =
        testsSnap.docs.map(
            document=>({
                id:document.id,
                ...document.data()
            })
        );


    teacherState.students =
        studentsSnap.docs.map(
            document=>({
                id:document.id,
                ...document.data()
            })
        );


    teacherState.results =
        resultsSnap.docs.map(
            document=>({
                id:document.id,
                ...document.data()
            })
        );


    teacherState.announcements =
        announcementsSnap.docs.map(
            document=>({
                id:document.id,
                ...document.data()
            })
        );


    updateTeacherStats();

    renderTeacherCourses();

    renderTeacherTests();

    renderTeacherStudents();

    renderTeacherResults();

    renderTeacherAnnouncements();


    if (profile.role === "admin") {

        await loadAdminUsers();

    }

}


function updateTeacherStats() {

    $("adminStudentCount").textContent =
        teacherState.students.length;


    $("adminCourseCount").textContent =
        teacherState.courses.length;


    $("adminTestCount").textContent =
        teacherState.tests.length;


    $("adminResultCount").textContent =
        teacherState.results.length;


}


function renderTeacherCourses() {

    const container =
        $("teacherCourses");


    container.innerHTML =
        teacherState.courses
            .map(
                course => `

                <article class="card">

                    <div class="card-icon">
                        ${escapeHTML(
                            course.icon || "📚"
                        )}
                    </div>

                    <h3>
                        ${escapeHTML(
                            course.title
                        )}
                    </h3>

                    <p class="muted">
                        ${escapeHTML(
                            course.description || ""
                        )}
                    </p>

                    ${
                        course.videoUrl
                        ?
                        `
                        <a
                            href="${escapeHTML(course.videoUrl)}"
                            target="_blank"
                            class="ghost-button">

                            ▶ Video

                        </a>
                        `
                        : ""
                    }

                    ${
                        course.fileUrl
                        ?
                        `
                        <a
                            href="${escapeHTML(course.fileUrl)}"
                            target="_blank"
                            class="ghost-button">

                            📄 Dosya

                        </a>
                        `
                        : ""
                    }

                    <button
                        class="ghost-button danger"
                        data-delete-course="${course.id}">

                        Dersi Sil

                    </button>

                </article>

            `
            )
            .join("")
        ||
        `
        <div class="card">

            <h3>
                Henüz ders yok
            </h3>

            <p class="muted">
                Yeni ders ekleyerek başlayabilirsin.
            </p>

        </div>
        `;


    document
        .querySelectorAll(
            "[data-delete-course]"
        )
        .forEach(button => {

            button.onclick =
                () =>
                    deleteTeacherCourse(
                        button.dataset.deleteCourse
                    );

        });

}


async function deleteTeacherCourse(id) {

    if (
        !confirm(
            "Bu dersi silmek istediğine emin misin?"
        )
    ) return;


    await deleteDoc(
        doc(
            db,
            "courses",
            id
        )
    );


    showToast(
        "Ders silindi.",
        "teacher"
    );


    await refreshTeacher();

}


function renderTeacherTests() {

    const container =
        $("teacherTests");


    container.innerHTML =
        teacherState.tests
            .map(
                test => `

                <article class="test-item">

                    <div>

                        <h3>
                            ${escapeHTML(
                                test.title
                            )}
                        </h3>

                        <p class="muted">
                            ${escapeHTML(
                                test.description || ""
                            )}
                        </p>

                        <small>
                            ${
                                (
                                    test.questions || []
                                ).length
                            }
                            soru
                        </small>

                    </div>


                    <button
                        class="ghost-button danger"
                        data-delete-test="${test.id}">

                        Sil

                    </button>

                </article>

            `
            )
            .join("")
        ||
        `
        <div class="card">
            Henüz test yok.
        </div>
        `;


    document
        .querySelectorAll(
            "[data-delete-test]"
        )
        .forEach(button => {

            button.onclick =
                () =>
                    deleteTeacherTest(
                        button.dataset.deleteTest
                    );

        });

}


async function deleteTeacherTest(id) {

    if (
        !confirm(
            "Bu testi silmek istediğine emin misin?"
        )
    ) return;


    await deleteDoc(
        doc(
            db,
            "tests",
            id
        )
    );


    showToast(
        "Test silindi.",
        "teacher"
    );


    await refreshTeacher();

}


function renderTeacherStudents() {

    const container =
        $("teacherStudents");


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Ad Soyad
                    </th>

                    <th>
                        E-posta
                    </th>

                    <th>
                        Puan
                    </th>

                    <th>
                        Ders
                    </th>

                    <th>
                        Test
                    </th>

                </tr>

            </thead>


            <tbody>

                ${
                    teacherState.students
                        .map(
                            student => `

                            <tr>

                                <td>
                                    ${escapeHTML(
                                        student.name
                                    )}
                                </td>

                                <td>
                                    ${escapeHTML(
                                        student.email
                                    )}
                                </td>

                                <td>
                                    ${student.points || 0}
                                </td>

                                <td>
                                    ${
                                        (
                                            student.completedLessons
                                            || []
                                        ).length
                                    }
                                </td>

                                <td>
                                    ${
                                        (
                                            student.completedTests
                                            || []
                                        ).length
                                    }
                                </td>

                            </tr>

                        `
                        )
                        .join("")
                }

            </tbody>

        </table>

    `;

}


function renderTeacherResults() {

    const container =
        $("teacherResults");


    const scores =
        teacherState.results.map(
            result =>
                Number(
                    result.score || 0
                )
        );


    const average =
        scores.length
            ? Math.round(
                scores.reduce(
                    (a,b)=>a+b,
                    0
                ) / scores.length
            )
            : 0;


    const best =
        scores.length
            ? Math.max(...scores)
            : 0;


    $("teacherAverage").textContent =
        average + "%";


    $("teacherBest").textContent =
        best + "%";


    $("teacherTotalResults").textContent =
        teacherState.results.length;


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Öğrenci
                    </th>

                    <th>
                        Test
                    </th>

                    <th>
                        Doğru
                    </th>

                    <th>
                        Yanlış
                    </th>

                    <th>
                        Başarı
                    </th>

                </tr>

            </thead>


            <tbody>

                ${
                    teacherState.results
                    .map(
                        result => `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    result.studentName
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    result.testTitle
                                )}
                            </td>

                            <td>
                                ${result.correct || 0}
                            </td>

                            <td>
                                ${result.wrong || 0}
                            </td>

                            <td>

                                <strong>
                                    ${result.score || 0}%
                                </strong>

                            </td>

                        </tr>

                    `
                    )
                    .join("")
                }

            </tbody>

        </table>

    `;

}


function renderTeacherAnnouncements() {

    $("teacherAnnouncements").innerHTML =
        teacherState.announcements
            .map(
                announcement=>`

                <article class="announcement-card">

                    <div
                        class="announcement-icon">

                        📢

                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(
                                announcement.title
                            )}
                        </h3>

                        <p>

                            ${escapeHTML(
                                announcement.body
                            )}

                        </p>

                    </div>

                </article>

            `
            )
            .join("")
        ||
        `
        <div class="card">
            <h3>Henüz duyuru yok</h3>
        </div>
        `;

}


/* =========================================================
   ÖĞRETMEN MODALLARI
========================================================= */

function openTeacherModal(type) {

    show($("modal"));


    if (type === "course") {

        $("modalBody").innerHTML = `

            <span class="eyebrow">
                İÇERİK
            </span>

            <h2>
                Yeni Ders
            </h2>

            <label>
                Ders adı

                <input
                    id="newCourseTitle"
                    maxlength="120">

            </label>


            <label>
                İkon

                <input
                    id="newCourseIcon"
                    value="📚"
                    maxlength="4">

            </label>


            <label>
                Açıklama

                <textarea
                    id="newCourseDescription">
                </textarea>

            </label>


            <label>
                Video URL

                <input
                    id="newCourseVideo"
                    placeholder="https://...">

            </label>


            <label>
                PDF / İçerik URL

                <input
                    id="newCourseFile"
                    placeholder="https://...">

            </label>


            <button
                id="saveCourse"
                class="primary-button full">

                Dersi Yayınla

            </button>

        `;


        $("saveCourse").onclick =
            saveTeacherCourse;

    }


    if (type === "lesson") {

        openLessonModal();

    }


    if (type === "test") {

        openTestCreationModal();

    }


    if (type === "announcement") {

        $("modalBody").innerHTML = `

            <span class="eyebrow">
                İLETİŞİM
            </span>

            <h2>
                Yeni Duyuru
            </h2>

            <label>
                Başlık

                <input id="newAnnouncementTitle">

            </label>


            <label>
                Duyuru

                <textarea
                    id="newAnnouncementBody">
                </textarea>

            </label>


            <button
                id="saveAnnouncement"
                class="primary-button full">

                Duyuruyu Yayınla

            </button>

        `;


        $("saveAnnouncement").onclick =
            saveTeacherAnnouncement;

    }

}


async function saveTeacherCourse() {

    const title =
        $("newCourseTitle")
        .value
        .trim();


    if (!title) {

        showToast(
            "Ders adı gerekli.",
            "teacher"
        );

        return;

    }


    await addDoc(
        collection(
            db,
            "courses"
        ),
        {

            title,

            icon:
                $("newCourseIcon")
                .value
                .trim()
                || "📚",

            description:
                $("newCourseDescription")
                .value
                .trim(),

            videoUrl:
                $("newCourseVideo")
                .value
                .trim(),

            fileUrl:
                $("newCourseFile")
                .value
                .trim(),

            teacherId:
                auth.currentUser.uid,

            teacherName:
                auth.currentUser
                    .displayName || "",

            createdAt:
                serverTimestamp()

        }
    );


    hide($("modal"));


    showToast(
        "Ders yayınlandı ✓",
        "teacher"
    );


    await refreshTeacher();

}


async function openLessonModal() {

    if (!teacherState.courses.length) {

        $("modalBody").innerHTML = `

            <h2>
                Önce ders oluştur
            </h2>

            <p class="muted">
                Konu eklemek için önce en az bir ders oluşturmalısın.
            </p>

        `;

        return;

    }


    $("modalBody").innerHTML = `

        <span class="eyebrow">
            DERS İÇERİĞİ
        </span>

        <h2>
            Yeni Konu / İçerik
        </h2>


        <label>
            Ders

            <select id="lessonCourse">

                ${
                    teacherState.courses
                        .map(
                            course => `

                            <option
                                value="${course.id}">

                                ${escapeHTML(
                                    course.title
                                )}

                            </option>

                        `
                        )
                        .join("")
                }

            </select>

        </label>


        <label>
            Konu başlığı

            <input
                id="lessonTitle">

        </label>


        <label>
            İçerik

            <textarea
                id="lessonBody">
            </textarea>

        </label>


        <label>
            Video URL

            <input
                id="lessonVideo">

        </label>


        <label>
            PDF / Dosya URL

            <input
                id="lessonFile">

        </label>


        <button
            id="saveLesson"
            class="primary-button full">

            İçeriği Yayınla

        </button>

    `;


    $("saveLesson").onclick =
        async () => {

            const courseId =
                $("lessonCourse")
                .value;


            const title =
                $("lessonTitle")
                .value
                .trim();


            if (!title) {

                showToast(
                    "Konu başlığı gerekli.",
                    "teacher"
                );

                return;

            }


            await addDoc(
                collection(
                    db,
                    "lessons"
                ),
                {

                    courseId,

                    title,

                    body:
                        $("lessonBody")
                        .value
                        .trim(),

                    videoUrl:
                        $("lessonVideo")
                        .value
                        .trim(),

                    fileUrl:
                        $("lessonFile")
                        .value
                        .trim(),

                    teacherId:
                        auth.currentUser.uid,

                    createdAt:
                        serverTimestamp()

                }
            );


            hide($("modal"));


            showToast(
                "Konu yayınlandı ✓",
                "teacher"
            );

        };

}


function openTestCreationModal() {

    let questionNumber = 0;


    $("modalBody").innerHTML = `

        <span class="eyebrow">
            SINAV
        </span>

        <h2>
            Yeni Test Oluştur
        </h2>


        <label>
            Test adı

            <input
                id="newTestTitle"
                maxlength="120">

        </label>


        <label>
            Açıklama

            <textarea
                id="newTestDescription">
            </textarea>

        </label>


        <div
            id="questionEditors">
        </div>


        <button
            id="addQuestion"
            class="ghost-button">

            ＋ Soru Ekle

        </button>


        <button
            id="saveTest"
            class="primary-button full"
            style="margin-top:15px">

            Testi Yayınla

        </button>

    `;


    const addQuestion = () => {

        questionNumber++;


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "question-editor";


        wrapper.innerHTML = `

            <div class="question-editor-title">

                Soru ${questionNumber}

            </div>


            <input
                class="question-text"
                placeholder="Soruyu yaz">


            <div class="option-grid">

                <input
                    class="question-a"
                    placeholder="A şıkkı">

                <input
                    class="question-b"
                    placeholder="B şıkkı">

                <input
                    class="question-c"
                    placeholder="C şıkkı">

                <input
                    class="question-d"
                    placeholder="D şıkkı">

            </div>


            <select class="question-correct">

                <option value="0">
                    Doğru cevap: A
                </option>

                <option value="1">
                    Doğru cevap: B
                </option>

                <option value="2">
                    Doğru cevap: C
                </option>

                <option value="3">
                    Doğru cevap: D
                </option>

            </select>

        `;


        $("questionEditors")
            .appendChild(wrapper);

    };


    $("addQuestion").onclick =
        addQuestion;


    addQuestion();


    $("saveTest").onclick =
        async () => {

            const title =
                $("newTestTitle")
                .value
                .trim();


            if (!title) {

                showToast(
                    "Test adı gerekli.",
                    "teacher"
                );

                return;

            }


            const rows =
                [
                    ...document
                        .querySelectorAll(
                            ".question-editor"
                        )
                ];


            if (!rows.length) {

                showToast(
                    "En az bir soru ekle.",
                    "teacher"
                );

                return;

            }


            const questions =
                rows.map(
                    row => ({

                        question:
                            row
                            .querySelector(
                                ".question-text"
                            )
                            .value
                            .trim(),

                        options: [

                            row
                            .querySelector(
                                ".question-a"
                            )
                            .value
                            .trim(),

                            row
                            .querySelector(
                                ".question-b"
                            )
                            .value
                            .trim(),

                            row
                            .querySelector(
                                ".question-c"
                            )
                            .value
                            .trim(),

                            row
                            .querySelector(
                                ".question-d"
                            )
                            .value
                            .trim()

                        ],

                        correctAnswer:
                            Number(
                                row
                                .querySelector(
                                    ".question-correct"
                                )
                                .value
                            )

                    })
                );


            const invalid =
                questions.some(
                    question =>
                        !question.question ||
                        question.options.some(
                            option =>
                                !option
                        )
                );


            if (invalid) {

                showToast(
                    "Soruları eksiksiz doldur.",
                    "teacher"
                );

                return;

            }


            await addDoc(
                collection(
                    db,
                    "tests"
                ),
                {

                    title,

                    description:
                        $("newTestDescription")
                        .value
                        .trim(),

                    questions,

                    teacherId:
                        auth.currentUser.uid,

                    teacherName:
                        auth.currentUser
                            .displayName || "",

                    createdAt:
                        serverTimestamp()

                }
            );


            hide($("modal"));


            showToast(
                "Test yayınlandı ✓",
                "teacher"
            );


            await refreshTeacher();

        };

}


async function saveTeacherAnnouncement() {

    const title =
        $("newAnnouncementTitle")
        .value
        .trim();


    const body =
        $("newAnnouncementBody")
        .value
        .trim();


    if (!title || !body) {

        showToast(
            "Başlık ve duyuru gerekli.",
            "teacher"
        );

        return;

    }


    await addDoc(
        collection(
            db,
            "announcements"
        ),
        {

            title,

            body,

            teacherId:
                auth.currentUser.uid,

            teacherName:
                auth.currentUser
                    .displayName || "",

            createdAt:
                serverTimestamp()

        }
    );


    hide($("modal"));


    showToast(
        "Duyuru yayınlandı ✓",
        "teacher"
    );


    await refreshTeacher();

}


/* =========================================================
   ADMIN
========================================================= */

async function loadAdminUsers() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "users"
            )
        );


    teacherState.users =
        snapshot.docs.map(
            document => ({
                id:document.id,
                ...document.data()
            })
        );


    renderAdminUsers();

}


function renderAdminUsers() {

    const container =
        $("teacherUsers");


    if (!container) return;


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Ad
                    </th>

                    <th>
                        E-posta
                    </th>

                    <th>
                        Rol
                    </th>

                    <th>
                        İşlem
                    </th>

                </tr>

            </thead>


            <tbody>

                ${
                    teacherState.users
                        .map(
                            user => `

                            <tr>

                                <td>
                                    ${escapeHTML(
                                        user.name
                                    )}
                                </td>

                                <td>
                                    ${escapeHTML(
                                        user.email
                                    )}
                                </td>

                                <td>
                                    <strong>
                                        ${escapeHTML(
                                            user.role
                                        )}
                                    </strong>
                                </td>

                                <td>

                                    ${
                                        user.id !==
                                        auth.currentUser.uid

                                        ?

                                        `

                                        <button
                                            class="ghost-button"
                                            data-change-role="${user.id}"
                                            data-current-role="${user.role}">

                                            ${
                                                user.role ===
                                                "teacher"

                                                ? "Öğrenci Yap"

                                                : "Öğretmen Yap"
                                            }

                                        </button>

                                        `

                                        :

                                        "Mevcut hesap"

                                    }

                                </td>

                            </tr>

                        `
                        )
                        .join("")
                }

            </tbody>

        </table>

    `;


    document
        .querySelectorAll(
            "[data-change-role]"
        )
        .forEach(button => {

            button.onclick =
                () =>
                    changeUserRole(
                        button.dataset.changeRole,
                        button.dataset.currentRole
                    );

        });

}


async function changeUserRole(
    uid,
    currentRole
) {

    const newRole =
        currentRole === "teacher"
            ? "student"
            : "teacher";


    await updateDoc(
        doc(
            db,
            "users",
            uid
        ),
        {
            role:newRole
        }
    );


    showToast(
        "Kullanıcı rolü değiştirildi.",
        "teacher"
    );


    await loadAdminUsers();


    await refreshTeacher();

}


/* =========================================================
   STORAGE YÜKLEME YARDIMCISI
========================================================= */

export async function uploadTeacherFile(
    file,
    folder = "courses"
) {

    if (!file) {
        throw new Error(
            "Dosya seçilmedi."
        );
    }


    const uid =
        auth.currentUser.uid;


    const safeName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


    const fileRef =
        ref(
            storage,
            `${folder}/${uid}/${Date.now()}-${safeName}`
        );


    await uploadBytes(
        fileRef,
        file
    );


    return await getDownloadURL(
        fileRef
    );

}


/* =========================================================
   DİĞER
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (
            auth.currentUser
        ) {
            /*
             * Firebase Auth oturumu tarayıcıda
             * kendi persistence mekanizması ile
             * yönetilir.
             */
        }

    }
);
