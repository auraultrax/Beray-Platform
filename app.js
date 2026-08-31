
import { auth, db } from "./firebase.js";

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
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   BERAY - ORTAK YARDIMCILAR
========================================================= */

const $ = (id) => document.getElementById(id);

const path = window.location.pathname.toLowerCase();

const isIndex =
    path.endsWith("index.html") ||
    path === "/" ||
    path.endsWith("/");

const isStudent = path.endsWith("student.html");
const isTeacher = path.endsWith("teacher.html");


function show(element) {
    if (element) element.classList.remove("hidden");
}


function hide(element) {
    if (element) element.classList.add("hidden");
}


function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function authErrorMessage(error) {

    const messages = {

        "auth/invalid-credential":
            "E-posta veya şifre yanlış.",

        "auth/email-already-in-use":
            "Bu e-posta zaten kayıtlı.",

        "auth/invalid-email":
            "Geçerli bir e-posta adresi gir.",

        "auth/weak-password":
            "Şifre en az 6 karakter olmalı.",

        "auth/network-request-failed":
            "İnternet bağlantısını kontrol et.",

        "auth/too-many-requests":
            "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.",

        "auth/operation-not-allowed":
            "E-posta/şifre ile kayıt Firebase Authentication'da etkin değil.",

        "auth/api-key-not-valid":
            "Firebase API anahtarı geçersiz. firebase.js ayarlarını kontrol et.",

        "auth/internal-error":
            "Firebase tarafında beklenmeyen bir hata oluştu. Konsol logunu kontrol et."

    };

    return messages[error.code]
        || error.message
        || "Bir hata oluştu.";

}


function toast(message, area = "student") {

    const element =
        area === "teacher"
            ? $("teacherToast")
            : $("studentToast");

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");

    clearTimeout(element._timer);

    element._timer = setTimeout(() => {
        element.classList.remove("show");
    }, 2800);

}


/* =========================================================
   INDEX - GİRİŞ / KAYIT
========================================================= */

if (isIndex && $("loginForm")) {

    const loginTab = $("loginTab");
    const registerTab = $("registerTab");
    const loginForm = $("loginForm");
    const registerForm = $("registerForm");

    loginTab?.addEventListener("click", () => {

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        show(loginForm);
        hide(registerForm);

        if ($("authTitle")) {
            $("authTitle").textContent = "Hoş Geldin";
        }

        if ($("authDesc")) {
            $("authDesc").textContent =
                "Beray Eğitim Platformu'na giriş yap";
        }

    });


    registerTab?.addEventListener("click", () => {

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        hide(loginForm);
        show(registerForm);

        if ($("authTitle")) {
            $("authTitle").textContent = "Hesap Oluştur";
        }

        if ($("authDesc")) {
            $("authDesc").textContent =
                "Beray ailesine katıl";
        }

    });


    /* GİRİŞ */

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const errorBox = $("loginError");

        hide(errorBox);

        const email =
            $("loginEmail")
                ?.value
                .trim()
                .toLowerCase();

        const password =
            $("loginPassword")
                ?.value || "";


        if (!email || !password) {

            if (errorBox) {

                errorBox.textContent =
                    "E-posta ve şifre gerekli.";

                show(errorBox);

            }

            return;
        }


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        } catch (error) {

            console.error(
                "Giriş hatası:",
                error
            );

            if (errorBox) {

                errorBox.textContent =
                    authErrorMessage(error);

                show(errorBox);

            }

        }

    });


    ```javascript
/* KAYIT */

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const errorBox = $("authMessage");

    if (errorBox) {
        errorBox.textContent = "";
        hide(errorBox);
    }

    // Form alanlarını güvenli şekilde al
    const nameInput = $("registerName");
    const emailInput = $("registerEmail");
    const passwordInput = $("registerPassword");
    const confirmInput = $("registerPasswordConfirm");
    const termsInput = $("terms");

    const name = nameInput?.value?.trim() || "";
    const email = emailInput?.value?.trim().toLowerCase() || "";
    const password = passwordInput?.value || "";
    const confirmPassword = confirmInput?.value || "";
    const termsAccepted = termsInput?.checked === true;

    // Alan kontrolü
    if (!name) {
        if (errorBox) {
            errorBox.textContent = "Ad Soyad alanını doldur.";
            show(errorBox);
        }
        nameInput?.focus();
        return;
    }

    if (!email) {
        if (errorBox) {
            errorBox.textContent = "E-posta alanını doldur.";
            show(errorBox);
        }
        emailInput?.focus();
        return;
    }

    if (!password) {
        if (errorBox) {
            errorBox.textContent = "Şifre alanını doldur.";
            show(errorBox);
        }
        passwordInput?.focus();
        return;
    }

    if (!confirmPassword) {
        if (errorBox) {
            errorBox.textContent = "Şifre tekrar alanını doldur.";
            show(errorBox);
        }
        confirmInput?.focus();
        return;
    }

    if (!termsAccepted) {
        if (errorBox) {
            errorBox.textContent =
                "Kayıt olmak için kullanım şartlarını kabul etmelisin.";
            show(errorBox);
        }
        termsInput?.focus();
        return;
    }

    if (name.length < 2) {
        if (errorBox) {
            errorBox.textContent = "Ad Soyad en az 2 karakter olmalı.";
            show(errorBox);
        }
        return;
    }

    if (password.length < 6) {
        if (errorBox) {
            errorBox.textContent = "Şifre en az 6 karakter olmalı.";
            show(errorBox);
        }
        passwordInput?.focus();
        return;
    }

    if (password !== confirmPassword) {
        if (errorBox) {
            errorBox.textContent = "Şifreler eşleşmiyor.";
            show(errorBox);
        }
        confirmInput?.focus();
        return;
    }

    try {
        // Firebase hesabını oluştur
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const firebaseUser = credential.user;

        // Kullanıcı adını Firebase'e kaydet
        await updateProfile(firebaseUser, {
            displayName: name
        });

        // Firestore kullanıcı profilini oluştur
        await setDoc(
            doc(db, "users", firebaseUser.uid),
            {
                uid: firebaseUser.uid,
                name: name,
                email: email,
                role: "student",
                points: 0,
                completedLessons: [],
                completedTests: [],
                createdAt: serverTimestamp()
            }
        );

        // Başarılı
        if (errorBox) {
            errorBox.textContent =
                "✅ Hesabın başarıyla oluşturuldu! Giriş yapabilirsin.";
            show(errorBox);
        }

        // Formu temizle
        registerForm.reset();

    } catch (error) {
        console.error("Kayıt hatası:", error);

        if (errorBox) {
            errorBox.textContent = authErrorMessage(error);
            show(errorBox);
        }
    }
});
```



    /* ŞİFRE GÖSTER */

    $("showLoginPassword")?.addEventListener(
        "click",
        () => {

            const input =
                $("loginPassword");

            input.type =
                input.type === "password"
                    ? "text"
                    : "password";

        }
    );


    $("showRegisterPassword")?.addEventListener(
        "click",
        () => {

            const input =
                $("registerPassword");

            input.type =
                input.type === "password"
                    ? "text"
                    : "password";

        }
    );


    /* ŞİFRE SIFIRLAMA MODALI */

    $("forgotPassword")?.addEventListener(
        "click",
        () => {

            show($("forgotModal"));

            const email =
                $("loginEmail")
                    ?.value
                    ?.trim();

            if (email && $("resetEmail")) {
                $("resetEmail").value = email;
            }

        }
    );


    $("closeForgotModal")?.addEventListener(
        "click",
        () => hide($("forgotModal"))
    );


    $("forgotModal")?.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                $("forgotModal")
            ) {

                hide($("forgotModal"));

            }

        }
    );


    $("resetButton")?.addEventListener(
        "click",
        async () => {

            const email =
                $("resetEmail")
                    ?.value
                    ?.trim()
                    ?.toLowerCase();


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
                    "Şifre yenileme bağlantısı gönderildi.";

            } catch (error) {

                $("resetMessage").textContent =
                    authErrorMessage(error);

            }

        }
    );

}


/* =========================================================
   OTURUM KONTROLÜ
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

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


            const userSnapshot =
                await getDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    )
                );


            /*
             * Eski kullanıcıda profil yoksa
             * oluşturmayı dene.
             */
            if (!userSnapshot.exists()) {

                if (isIndex) {

                    await setDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        ),
                        {
                            uid:user.uid,
                            name:user.displayName || "Öğrenci",
                            email:user.email || "",
                            role:"student",
                            points:0,
                            completedLessons:[],
                            completedTests:[],
                            createdAt:serverTimestamp()
                        }
                    );

                    location.href =
                        "./student.html";

                    return;

                }

                await signOut(auth);

                return;

            }


            const profile =
                userSnapshot.data();


            /* GİRİŞ SAYFASINDAN */

            if (isIndex) {

                if (
                    profile.role === "teacher" ||
                    profile.role === "admin"
                ) {

                    location.href =
                        "./teacher.html";

                } else {

                    location.href =
                        "./student.html";

                }

                return;

            }


            /* ÖĞRENCİ */

            if (isStudent) {

                if (
                    profile.role !==
                    "student"
                ) {

                    location.href =
                        "./teacher.html";

                    return;

                }

                await initializeStudent(
                    user,
                    profile
                );

                return;

            }


            /* ÖĞRETMEN / ADMİN */

            if (isTeacher) {

                if (
                    profile.role !== "teacher" &&
                    profile.role !== "admin"
                ) {

                    location.href =
                        "./student.html";

                    return;

                }

                await initializeTeacher(
                    user,
                    profile
                );

            }

        } catch (error) {

            console.error(
                "Auth state hatası:",
                error
            );

            if (isStudent) {
                hide($("studentLoading"));
            }

            if (isTeacher) {
                hide($("teacherLoading"));
            }

        }

    }
);


/* =========================================================
   ÖĞRENCİ STATE
========================================================= */

const studentState = {

    user:null,

    profile:null,

    courses:[],

    lessons:[],

    tests:[],

    results:[],

    announcements:[]

};


/* =========================================================
   ÖĞRENCİ BAŞLAT
========================================================= */

async function initializeStudent(
    user,
    profile
) {

    show($("studentApp"));

    studentState.user =
        user;

    studentState.profile =
        profile;


    const name =
        profile.name ||
        user.displayName ||
        "Öğrenci";


    const initial =
        name
            .charAt(0)
            .toUpperCase();


    if ($("studentName")) {

        $("studentName")
            .textContent =
            name;

    }


    if ($("studentAvatar")) {

        $("studentAvatar")
            .textContent =
            initial;

    }


    if ($("profileAvatar")) {

        $("profileAvatar")
            .textContent =
            initial;

    }


    if ($("profileName")) {

        $("profileName")
            .textContent =
            name;

    }


    if ($("profileEmail")) {

        $("profileEmail")
            .textContent =
            user.email || "";

    }


    if ($("welcomeName")) {

        $("welcomeName")
            .textContent =
            name
                .split(" ")[0];

    }


    $("studentLogout").onclick =
        () => signOut(auth);


    $("studentMenu").onclick =
        () => {

            $("studentSidebar")
                ?.classList
                .toggle("open");

        };


    document
        .querySelectorAll(".student-nav")
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


    $("backFromQuiz")?.addEventListener(
        "click",
        () => openStudentPage("tests")
    );


    $("courseSearch")?.addEventListener(
        "input",
        renderStudentCourses
    );


    $("courseFilter")?.addEventListener(
        "change",
        renderStudentCourses
    );


    document
        .querySelectorAll("[data-test-filter]")
        .forEach(button => {

            button.onclick = () => {

                document
                    .querySelectorAll(
                        "[data-test-filter]"
                    )
                    .forEach(
                        b =>
                            b.classList
                            .remove("active")
                    );


                button
                    .classList
                    .add("active");


                renderStudentTests(
                    button.dataset.testFilter
                );

            };

        });


    $("notificationButton")?.addEventListener(
        "click",
        () =>
            show(
                $("notificationPanel")
            )
    );


    $("closeNotificationPanel")
        ?.addEventListener(
            "click",
            () =>
                hide(
                    $("notificationPanel")
                )
        );


    await refreshStudent();

}


/* =========================================================
   ÖĞRENCİ SAYFALARI
========================================================= */

function openStudentPage(
    pageName,
    button = null
) {

    document
        .querySelectorAll(".student-page")
        .forEach(section => {

            section.classList
                .remove("active");

        });


    const section =
        $("student-" + pageName);


    if (section) {

        section
            .classList
            .add("active");

    }


    document
        .querySelectorAll(".student-nav")
        .forEach(item => {

            item.classList
                .remove("active");

        });


    if (button) {

        button
            .classList
            .add("active");

    } else {

        document
            .querySelector(
                `.student-nav[data-page="${pageName}"]`
            )
            ?.classList
            .add("active");

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
        ?.classList
        .remove("open");

}


/* =========================================================
   ÖĞRENCİ VERİLERİNİ ÇEK
========================================================= */

async function refreshStudent() {

    const uid =
        auth.currentUser?.uid;


    if (!uid) return;


    try {

        const userSnapshot =
            await getDoc(
                doc(
                    db,
                    "users",
                    uid
                )
            );


        if (!userSnapshot.exists()) {
            await signOut(auth);
            return;
        }


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


        const lessonsSnapshot =
            await getDocs(
                query(
                    collection(
                        db,
                        "lessons"
                    ),
                    orderBy(
                        "createdAt",
                        "desc"
                    ),
                    limit(200)
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


        const announcementSnapshot =
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
                item => ({
                    id:item.id,
                    ...item.data()
                })
            );


        studentState.lessons =
            lessonsSnapshot.docs.map(
                item => ({
                    id:item.id,
                    ...item.data()
                })
            );


        studentState.tests =
            testsSnapshot.docs.map(
                item => ({
                    id:item.id,
                    ...item.data()
                })
            );


        studentState.results =
            resultsSnapshot.docs
                .map(
                    item => ({
                        id:item.id,
                        ...item.data()
                    })
                )
                .sort(
                    (a,b) =>
                        (
                            b.createdAt?.seconds || 0
                        )
                        -
                        (
                            a.createdAt?.seconds || 0
                        )
                );


        studentState.announcements =
            announcementSnapshot.docs.map(
                item => ({
                    id:item.id,
                    ...item.data()
                })
            );


        updateStudentDashboard();

        renderStudentCourses();

        renderStudentTests("all");

        renderStudentResults();

        renderStudentAnnouncements();

        updateStudentNotifications();

    } catch (error) {

        console.error(
            "Öğrenci verileri:",
            error
        );

        toast(
            "Veriler yüklenirken hata oluştu."
        );

    }

}


/* =========================================================
   ÖĞRENCİ DASHBOARD
========================================================= */

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
                    (sum,item) =>
                        sum +
                        Number(
                            item.score || 0
                        ),
                    0
                ) /
                results.length
            )
            : 0;


    const values = {

        dashboardLessons:
            lessons,

        dashboardTests:
            tests,

        dashboardAverage:
            average + "%",

        dashboardPoints:
            profile.points || 0,

        profilePoints:
            profile.points || 0,

        profileLessons:
            lessons,

        profileTests:
            tests

    };


    Object
        .entries(values)
        .forEach(
            ([id,value]) => {

                if ($(id)) {

                    $(id)
                        .textContent =
                        value;

                }

            }
        );

}


/* =========================================================
   DERSLER
========================================================= */

function renderStudentCourses() {

    const container =
        $("studentCourses");


    if (!container) return;


    const search =
        (
            $("courseSearch")
                ?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const courses =
        studentState.courses
            .filter(
                course => {

                    const title =
                        String(
                            course.title || ""
                        )
                        .toLowerCase();


                    const description =
                        String(
                            course.description || ""
                        )
                        .toLowerCase();


                    return !search ||
                        title.includes(search) ||
                        description.includes(search);

                }
            );


    const completed =
        studentState.profile
            ?.completedLessons ||
        [];


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
                    course.title ||
                    "Ders"
                )}
            </h3>

            <p class="muted">
                ${escapeHTML(
                    course.description ||
                    ""
                )}
            </p>

            ${
                course.videoUrl
                    ? `
                    <a
                        class="ghost-button"
                        href="${escapeHTML(
                            course.videoUrl
                        )}"
                        target="_blank"
                        rel="noopener noreferrer">

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
                        href="${escapeHTML(
                            course.fileUrl
                        )}"
                        target="_blank"
                        rel="noopener noreferrer">

                        📄 PDF'yi Aç

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
        courses
            .map(makeCard)
            .join("")
        ||
        `
        <div class="card">

            <h3>
                Ders bulunamadı
            </h3>

            <p class="muted">
                Henüz yayınlanmış ders bulunmuyor.
            </p>

        </div>
        `;


    if ($("dashboardCourses")) {

        $("dashboardCourses").innerHTML =
            studentState.courses
                .slice(0,3)
                .map(makeCard)
                .join("")
            ||
            `
            <div class="card">

                <h3>
                    Henüz ders yok
                </h3>

                <p class="muted">
                    Öğretmenin ders eklediğinde
                    burada görünecek.
                </p>

            </div>
            `;

    }


    document
        .querySelectorAll(
            "[data-complete-course]"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>
                        completeStudentCourse(
                            button
                                .dataset
                                .completeCourse
                        );

            }
        );

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


    if (
        completed.includes(courseId)
    ) {

        toast(
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
                +
                10

        }
    );


    toast(
        "Ders tamamlandı. +10 puan ⭐"
    );


    await refreshStudent();

}


/* =========================================================
   TESTLER
========================================================= */

function renderStudentTests(
    filter = "all"
) {

    const container =
        $("studentTests");


    if (!container) return;


    const results =
        studentState.results;


    let tests =
        studentState.tests;


    if (filter === "new") {

        tests =
            tests.filter(
                test =>
                    !results.some(
                        result =>
                            result.testId ===
                            test.id
                    )
            );

    }


    if (filter === "done") {

        tests =
            tests.filter(
                test =>
                    results.some(
                        result =>
                            result.testId ===
                            test.id
                    )
            );

    }


    container.innerHTML =
        tests
            .map(
                test => {

                    const previous =
                        results.find(
                            result =>
                                result.testId ===
                                test.id
                        );


                    return `

                    <article class="test-item">

                        <div>

                            <span class="eyebrow">
                                BERAY TEST
                            </span>

                            <h3>
                                ${escapeHTML(
                                    test.title ||
                                    "Test"
                                )}
                            </h3>

                            <p class="muted">
                                ${escapeHTML(
                                    test.description ||
                                    ""
                                )}
                            </p>

                            <small class="muted">

                                ${
                                    (
                                        test.questions ||
                                        []
                                    ).length
                                }
                                soru

                            </small>

                        </div>


                        <div
                            class="test-action">

                            ${
                                previous
                                ?
                                `
                                <span class="score-pill">

                                    Sonuç:
                                    ${previous.score}%

                                </span>
                                `
                                :
                                ""
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
            )
            .join("")
        ||
        `
        <div class="card">

            <h3>
                Test bulunamadı
            </h3>

            <p class="muted">
                Henüz yayınlanmış test yok.
            </p>

        </div>
        `;


    document
        .querySelectorAll(
            "[data-start-test]"
        )
        .forEach(button => {

            button.onclick =
                () => {

                    const test =
                        studentState.tests
                            .find(
                                item =>
                                    item.id ===
                                    button.dataset
                                        .startTest
                            );


                    startStudentQuiz(
                        test
                    );

                };

        });


    if ($("dashboardTestsList")) {

        $("dashboardTestsList")
            .innerHTML =
            studentState.tests
                .slice(0,3)
                .map(
                    test => `

                    <article
                        class="test-item">

                        <div>

                            <h3>
                                ${escapeHTML(
                                    test.title
                                )}
                            </h3>

                            <p class="muted">
                                ${
                                    (
                                        test.questions
                                        || []
                                    ).length
                                } soru
                            </p>

                        </div>

                        <button
                            class="primary-button"
                            data-dashboard-test="${test.id}">

                            Başla

                        </button>

                    </article>

                    `
                )
                .join("");

        document
            .querySelectorAll(
                "[data-dashboard-test]"
            )
            .forEach(button => {

                button.onclick =
                    () => {

                        const test =
                            studentState.tests
                                .find(
                                    item =>
                                        item.id ===
                                        button.dataset
                                            .dashboardTest
                                );

                        startStudentQuiz(test);

                    };

            });

    }

}


/* =========================================================
   QUIZ
========================================================= */

async function startStudentQuiz(
    test
) {

    if (
        !test ||
        !Array.isArray(test.questions) ||
        !test.questions.length
    ) {

        toast(
            "Bu testte henüz soru yok."
        );

        return;

    }


    openStudentPage(
        "quiz"
    );


    let currentQuestion = 0;
    let correctAnswers = 0;
    let locked = false;


    const renderQuestion =
        () => {

            locked = false;


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
                                    (
                                        currentQuestion + 1
                                    )
                                    /
                                    total
                                ) * 100
                            }%;
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
                                question.options ||
                                []
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
                                            String
                                                .fromCharCode(
                                                    65 + index
                                                )
                                        }
                                    </span>

                                    ${escapeHTML(
                                        option
                                    )}

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

                    button.onclick =
                        async () => {

                            if (locked) {
                                return;
                            }


                            locked = true;


                            const selected =
                                Number(
                                    button
                                        .dataset
                                        .answer
                                );


                            const correctIndex =
                                Number(
                                    question
                                        .correctAnswer
                                );


                            document
                                .querySelectorAll(
                                    "[data-answer]"
                                )
                                .forEach(
                                    (
                                        item,
                                        index
                                    ) => {

                                        item.disabled =
                                            true;


                                        if (
                                            index ===
                                            correctIndex
                                        ) {

                                            item
                                                .classList
                                                .add(
                                                    "correct"
                                                );

                                        }


                                        if (
                                            index ===
                                            selected
                                            &&
                                            index !==
                                            correctIndex
                                        ) {

                                            item
                                                .classList
                                                .add(
                                                    "wrong"
                                                );

                                        }

                                    }
                                );


                            if (
                                selected ===
                                correctIndex
                            ) {

                                correctAnswers++;

                            }


                            const next =
                                document
                                    .createElement(
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
                                    currentQuestion
                                    <
                                    total
                                ) {

                                    renderQuestion();

                                } else {

                                    finishQuiz();

                                }

                            };


                            $("quizBox")
                                .appendChild(
                                    next
                                );

                        };

                });

        };


    const finishQuiz =
        async () => {

            const total =
                test.questions.length;


            const score =
                Math.round(
                    (
                        correctAnswers /
                        total
                    ) * 100
                );


            const wrong =
                total -
                correctAnswers;


            const uid =
                auth.currentUser.uid;


            try {

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
                                .displayName ||
                            studentState
                                .profile
                                ?.name ||
                            "",

                        testId:
                            test.id,

                        testTitle:
                            test.title,

                        correct:
                            correctAnswers,

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
                    await getDoc(
                        userRef
                    );


                const profile =
                    userSnap.data();


                const completed =
                    [
                        ...(profile
                            .completedTests ||
                            [])
                    ];


                if (
                    !completed.includes(
                        test.id
                    )
                ) {

                    completed.push(
                        test.id
                    );

                }


                await updateDoc(
                    userRef,
                    {

                        completedTests:
                            completed,

                        points:
                            (profile.points || 0)
                            +
                            (
                                correctAnswers * 5
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
                            ${correctAnswers}
                            /
                            ${total}
                            doğru cevap
                        </p>

                        <strong class="big-score">
                            ${score}%
                        </strong>

                        <p class="yellow-text">
                            +${correctAnswers * 5}
                            puan
                        </p>

                        <button
                            id="quizReturn"
                            class="primary-button">

                            Testlere Dön

                        </button>

                    </div>

                `;


                $("quizReturn").onclick =
                    async () => {

                        await refreshStudent();

                        openStudentPage(
                            "tests"
                        );

                    };


            } catch (error) {

                console.error(
                    "Test sonucu:",
                    error
                );

                toast(
                    "Sonuç kaydedilemedi."
                );

            }

        };


    renderQuestion();

}


/* =========================================================
   SONUÇLAR
========================================================= */

function renderStudentResults() {

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
                ) /
                scores.length
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


    if (!$("studentResults")) {
        return;
    }


    $("studentResults").innerHTML =
        results
            .map(
                result => `

                <article
                    class="test-item">

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
            )
            .join("")
        ||
        `
        <div class="card">

            <h3>
                Henüz sonuç yok
            </h3>

            <p class="muted">
                Bir test çözdüğünde sonuçların burada görünecek.
            </p>

        </div>
        `;

}


/* =========================================================
   DUYURULAR
========================================================= */

function renderStudentAnnouncements() {

    if (!$("studentAnnouncements")) {
        return;
    }


    $("studentAnnouncements").innerHTML =
        studentState.announcements
            .map(
                item => `

                <article
                    class="announcement-card">

                    <div
                        class="announcement-icon">

                        📢

                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(
                                item.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                item.body
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


function updateStudentNotifications() {

    const count =
        studentState.announcements.length;


    if ($("announcementBadge")) {

        $("announcementBadge")
            .textContent =
            count;


        $("announcementBadge")
            .classList
            .toggle(
                "hidden",
                count === 0
            );

    }


    if ($("notificationCount")) {

        $("notificationCount")
            .textContent =
            count;


        $("notificationCount")
            .classList
            .toggle(
                "hidden",
                count === 0
            );

    }


    if ($("notificationList")) {

        $("notificationList").innerHTML =
            studentState
                .announcements
                .slice(0,10)
                .map(
                    item => `

                    <div
                        class="notification-item">

                        <strong>
                            ${escapeHTML(
                                item.title
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                item.body
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
   ÖĞRETMEN STATE
========================================================= */

const teacherState = {

    profile:null,

    courses:[],

    lessons:[],

    tests:[],

    students:[],

    results:[],

    announcements:[],

    users:[]

};


/* =========================================================
   ÖĞRETMEN BAŞLAT
========================================================= */

async function initializeTeacher(
    user,
    profile
) {

    show($("teacherApp"));


    teacherState.profile =
        profile;


    const name =
        profile.name ||
        user.displayName ||
        "Öğretmen";


    const initial =
        name
            .charAt(0)
            .toUpperCase();


    $("teacherName").textContent =
        name;


    $("dashboardTeacherName")
        .textContent =
        name.split(" ")[0];


    $("teacherAvatar")
        .textContent =
        initial;


    $("sidebarTeacherAvatar")
        .textContent =
        initial;


    $("sidebarTeacherName")
        .textContent =
        name;


    const role =
        profile.role === "admin"
            ? "Admin"
            : "Öğretmen";


    $("teacherRole").textContent =
        role;


    $("sidebarTeacherRole").textContent =
        role;


    $("teacherRoleLabel")
        .textContent =
        profile.role === "admin"
            ? "ADMİN PANELİ"
            : "ÖĞRETMEN PANELİ";


    if (
        profile.role ===
        "admin"
    ) {

        show(
            $("adminUsersNav")
        );

    }


    $("teacherLogout").onclick =
        () => signOut(auth);


    $("teacherMenu").onclick =
        () =>
            $("teacherSidebar")
                ?.classList
                .toggle("open");


    document
        .querySelectorAll(".teacher-nav")
        .forEach(
            button => {

                button.onclick =
                    () =>
                        openTeacherPage(
                            button.dataset.page,
                            button
                        );

            }
        );


    document
        .querySelectorAll("[data-modal]")
        .forEach(
            button => {

                button.onclick =
                    () =>
                        openTeacherModal(
                            button.dataset.modal
                        );

            }
        );


    $("closeModal")?.addEventListener(
        "click",
        () => hide($("modal"))
    );


    await refreshTeacher();

}


/* =========================================================
   ÖĞRETMEN SAYFALARI
========================================================= */

function openTeacherPage(
    pageName,
    button = null
) {

    document
        .querySelectorAll(".teacher-page")
        .forEach(
            page =>
                page.classList
                    .remove("active")
        );


    $("teacher-" + pageName)
        ?.classList
        .add("active");


    document
        .querySelectorAll(".teacher-nav")
        .forEach(
            item =>
                item.classList
                    .remove("active")
        );


    if (button) {

        button.classList
            .add("active");

    }


    const titles = {

        dashboard:
            "Genel Bakış",

        courses:
            "Dersler",

        lessons:
            "Konular",

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


    $("teacherPageTitle")
        .textContent =
        titles[pageName] ||
        "Beray";


    $("teacherSidebar")
        ?.classList
        .remove("open");

}


/* =========================================================
   ÖĞRETMEN VERİLERİ
========================================================= */

async function refreshTeacher() {

    const [
        coursesSnap,
        lessonsSnap,
        testsSnap,
        studentsSnap,
        resultsSnap,
        announcementsSnap
    ] = await Promise.all([


        getDocs(
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
        ),


        getDocs(
            query(
                collection(
                    db,
                    "lessons"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(200)
            )
        ),


        getDocs(
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
        ),


        getDocs(
            query(
                collection(
                    db,
                    "users"
                ),
                where(
                    "role",
                    "==",
                    "student"
                ),
                limit(500)
            )
        ),


        getDocs(
            query(
                collection(
                    db,
                    "results"
                ),
                limit(500)
            )
        ),


        getDocs(
            query(
                collection(
                    db,
                    "announcements"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(100)
            )
        )

    ]);


    teacherState.courses =
        coursesSnap.docs.map(
            item=>({
                id:item.id,
                ...item.data()
            })
        );


    teacherState.lessons =
        lessonsSnap.docs.map(
            item=>({
                id:item.id,
                ...item.data()
            })
        );


    teacherState.tests =
        testsSnap.docs.map(
            item=>({
                id:item.id,
                ...item.data()
            })
        );


    teacherState.students =
        studentsSnap.docs.map(
            item=>({
                id:item.id,
                ...item.data()
            })
        );


    teacherState.results =
        resultsSnap.docs
            .map(
                item=>({
                    id:item.id,
                    ...item.data()
                })
            )
            .sort(
                (a,b)=>
                    (
                        b.createdAt?.seconds ||
                        0
                    )
                    -
                    (
                        a.createdAt?.seconds ||
                        0
                    )
            );


    teacherState.announcements =
        announcementsSnap.docs.map(
            item=>({
                id:item.id,
                ...item.data()
            })
        );


    updateTeacherStats();

    renderTeacherCourses();

    renderTeacherLessons();

    renderTeacherTests();

    renderTeacherStudents();

    renderTeacherResults();

    renderTeacherAnnouncements();


    if (
        teacherState.profile?.role ===
        "admin"
    ) {

        await loadAdminUsers();

    }

}


/* =========================================================
   ÖĞRETMEN İSTATİSTİK
========================================================= */

function updateTeacherStats() {

    $("adminStudentCount")
        .textContent =
        teacherState.students.length;


    $("adminCourseCount")
        .textContent =
        teacherState.courses.length;


    $("adminTestCount")
        .textContent =
        teacherState.tests.length;


    $("adminResultCount")
        .textContent =
        teacherState.results.length;

}


/* =========================================================
   ÖĞRETMEN DERSLER
========================================================= */

function renderTeacherCourses() {

    const container =
        $("teacherCourses");


    if (!container) return;


    container.innerHTML =
        teacherState.courses
            .map(
                course => `

                <article class="card">

                    <div class="card-icon">

                        ${escapeHTML(
                            course.icon ||
                            "📚"
                        )}

                    </div>


                    <h3>
                        ${escapeHTML(
                            course.title
                        )}
                    </h3>


                    <p class="muted">
                        ${escapeHTML(
                            course.description ||
                            ""
                        )}
                    </p>


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

        </div>
        `;


    document
        .querySelectorAll(
            "[data-delete-course]"
        )
        .forEach(
            button => {

                button.onclick =
                    async () => {

                        if (
                            !confirm(
                                "Bu ders silinsin mi?"
                            )
                        ) return;


                        await deleteDoc(
                            doc(
                                db,
                                "courses",
                                button.dataset
                                    .deleteCourse
                            )
                        );


                        toast(
                            "Ders silindi.",
                            "teacher"
                        );


                        await refreshTeacher();

                    };

            }
        );

}


/* =========================================================
   ÖĞRETMEN KONULARI
========================================================= */

function renderTeacherLessons() {

    const container =
        $("teacherLessons");


    if (!container) return;


    container.innerHTML =
        teacherState.lessons
            .map(
                lesson => {

                    const course =
                        teacherState.courses
                            .find(
                                item =>
                                    item.id ===
                                    lesson.courseId
                            );


                    return `

                    <article class="test-item">

                        <div>

                            <span class="eyebrow">

                                ${escapeHTML(
                                    course?.title ||
                                    "Ders"
                                )}

                            </span>


                            <h3>
                                ${escapeHTML(
                                    lesson.title
                                )}
                            </h3>


                            <p class="muted">
                                ${escapeHTML(
                                    lesson.body ||
                                    ""
                                )}
                            </p>


                            ${
                                lesson.videoUrl
                                ?
                                `
                                <a
                                    class="ghost-button"
                                    href="${escapeHTML(
                                        lesson.videoUrl
                                    )}"
                                    target="_blank">

                                    ▶ Video

                                </a>
                                `
                                :
                                ""
                            }


                            ${
                                lesson.fileUrl
                                ?
                                `
                                <a
                                    class="ghost-button"
                                    href="${escapeHTML(
                                        lesson.fileUrl
                                    )}"
                                    target="_blank">

                                    📄 PDF

                                </a>
                                `
                                :
                                ""
                            }

                        </div>


                        <button
                            class="ghost-button danger"
                            data-delete-lesson="${lesson.id}">

                            Sil

                        </button>

                    </article>

                    `;

                }
            )
            .join("")
        ||
        `
        <div class="card">
            <h3>Henüz konu yok.</h3>
        </div>
        `;


    document
        .querySelectorAll(
            "[data-delete-lesson]"
        )
        .forEach(
            button => {

                button.onclick =
                    async () => {

                        if (
                            !confirm(
                                "Bu konu silinsin mi?"
                            )
                        ) return;


                        await deleteDoc(
                            doc(
                                db,
                                "lessons",
                                button.dataset
                                    .deleteLesson
                            )
                        );


                        toast(
                            "Konu silindi.",
                            "teacher"
                        );


                        refreshTeacher();

                    };

            }
        );

}


/* =========================================================
   ÖĞRETMEN TESTLER
========================================================= */

function renderTeacherTests() {

    const container =
        $("teacherTests");


    if (!container) return;


    container.innerHTML =
        teacherState.tests
            .map(
                test => `

                <article class="test-item">

                    <div>

                        <span class="eyebrow">
                            TEST
                        </span>

                        <h3>
                            ${escapeHTML(
                                test.title
                            )}
                        </h3>


                        <p class="muted">
                            ${escapeHTML(
                                test.description ||
                                ""
                            )}
                        </p>


                        <small>
                            ${
                                (
                                    test.questions ||
                                    []
                                ).length
                            }
                            soru
                        </small>

                    </div>


                    <button
                        class="ghost-button danger"
                        data-delete-test="${test.id}">

                        Testi Sil

                    </button>

                </article>

            `
            )
            .join("")
        ||
        `
        <div class="card">
            <h3>Henüz test yok.</h3>
        </div>
        `;


    document
        .querySelectorAll(
            "[data-delete-test]"
        )
        .forEach(
            button => {

                button.onclick =
                    async () => {

                        if (
                            !confirm(
                                "Bu test silinsin mi?"
                            )
                        ) return;


                        await deleteDoc(
                            doc(
                                db,
                                "tests",
                                button.dataset
                                    .deleteTest
                            )
                        );


                        toast(
                            "Test silindi.",
                            "teacher"
                        );


                        refreshTeacher();

                    };

            }
        );

}


/* =========================================================
   ÖĞRENCİLER
========================================================= */

function renderTeacherStudents() {

    const container =
        $("teacherStudents");


    if (!container) return;


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Öğrenci
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
                                            ||
                                            []
                                        ).length
                                    }
                                </td>

                                <td>
                                    ${
                                        (
                                            student.completedTests
                                            ||
                                            []
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


/* =========================================================
   SONUÇLAR
========================================================= */

function renderTeacherResults() {

    const container =
        $("teacherResults");


    if (!container) return;


    const scores =
        teacherState.results
            .map(
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
                ) /
                scores.length
            )
            : 0;


    const best =
        scores.length
            ? Math.max(...scores)
            : 0;


    $("teacherAverage")
        .textContent =
        average + "%";


    $("teacherBest")
        .textContent =
        best + "%";


    $("teacherTotalResults")
        .textContent =
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


/* =========================================================
   DUYURULAR
========================================================= */

function renderTeacherAnnouncements() {

    const container =
        $("teacherAnnouncements");


    if (!container) return;


    container.innerHTML =
        teacherState.announcements
            .map(
                announcement => `

                <article
                    class="announcement-card">

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
            <h3>Henüz duyuru yok.</h3>
        </div>
        `;

}


/* =========================================================
   ADMIN KULLANICILAR
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
            item => ({
                id:item.id,
                ...item.data()
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
                                    ${escapeHTML(
                                        user.role
                                    )}
                                </td>

                                <td>

                                    ${
                                        user.id ===
                                        auth.currentUser.uid

                                        ?

                                        "Mevcut hesap"

                                        :

                                        `
                                        <button
                                            class="ghost-button"
                                            data-change-role="${user.id}"
                                            data-role="${user.role}">

                                            ${
                                                user.role ===
                                                "teacher"

                                                    ? "Öğrenci Yap"
                                                    : "Öğretmen Yap"
                                            }

                                        </button>
                                        `
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
        .forEach(
            button => {

                button.onclick =
                    async () => {

                        const newRole =
                            button.dataset.role ===
                            "teacher"
                                ? "student"
                                : "teacher";


                        await updateDoc(
                            doc(
                                db,
                                "users",
                                button.dataset
                                    .changeRole
                            ),
                            {
                                role:newRole
                            }
                        );


                        toast(
                            "Kullanıcı rolü güncellendi.",
                            "teacher"
                        );


                        await loadAdminUsers();

                    };

            }
        );

}


/* =========================================================
   TEACHER MODAL
========================================================= */

function openTeacherModal(type) {

    show($("modal"));


    /* DERS */

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
                PDF URL

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


    /* KONU */

    if (type === "lesson") {

        if (!teacherState.courses.length) {

            $("modalBody").innerHTML = `

                <h2>
                    Önce ders oluştur
                </h2>

                <p class="muted">
                    Konu eklemek için önce bir ders oluştur.
                </p>

            `;

            return;

        }


        $("modalBody").innerHTML = `

            <span class="eyebrow">
                DERS İÇERİĞİ
            </span>

            <h2>
                Yeni Konu
            </h2>


            <label>
                Ders

                <select
                    id="lessonCourse">

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
                Konu adı

                <input
                    id="lessonTitle"
                    maxlength="150">

            </label>


            <label>
                Konu anlatımı

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
                PDF URL

                <input
                    id="lessonFile">

            </label>


            <button
                id="saveLesson"
                class="primary-button full">

                Konuyu Yayınla

            </button>

        `;


        $("saveLesson").onclick =
            saveTeacherLesson;

    }


    /* DUYURU */

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

                <input
                    id="announcementTitle"
                    maxlength="120">

            </label>


            <label>
                Mesaj

                <textarea
                    id="announcementBody">
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


    /* TEST */

    if (type === "test") {

        buildTestModal();

    }

}


/* =========================================================
   DERS KAYDET
========================================================= */

async function saveTeacherCourse() {

    const title =
        $("newCourseTitle")
        .value
        .trim();


    if (!title) {

        toast(
            "Ders adı gerekli.",
            "teacher"
        );

        return;

    }


    try {

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
                    ||
                    "📚",

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
                        .displayName ||
                    stateName(),

                createdAt:
                    serverTimestamp()

            }
        );


        hide($("modal"));


        toast(
            "Ders yayınlandı ✓",
            "teacher"
        );


        await refreshTeacher();


    } catch (error) {

        console.error(error);

        toast(
            "Ders kaydedilemedi: " +
            error.message,
            "teacher"
        );

    }

}


/* =========================================================
   KONU KAYDET
========================================================= */

async function saveTeacherLesson() {

    const title =
        $("lessonTitle")
        .value
        .trim();


    if (!title) {

        toast(
            "Konu adı gerekli.",
            "teacher"
        );

        return;

    }


    try {

        await addDoc(
            collection(
                db,
                "lessons"
            ),
            {

                courseId:
                    $("lessonCourse")
                    .value,

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

                teacherName:
                    auth.currentUser
                        .displayName ||
                    stateName(),

                createdAt:
                    serverTimestamp()

            }
        );


        hide($("modal"));


        toast(
            "Konu yayınlandı ✓",
            "teacher"
        );


        await refreshTeacher();

    } catch (error) {

        console.error(error);

        toast(
            "Konu kaydedilemedi: " +
            error.message,
            "teacher"
        );

    }

}


/* =========================================================
   DUYURU KAYDET
========================================================= */

async function saveTeacherAnnouncement() {

    const title =
        $("announcementTitle")
        .value
        .trim();


    const body =
        $("announcementBody")
        .value
        .trim();


    if (!title || !body) {

        toast(
            "Başlık ve mesaj gerekli.",
            "teacher"
        );

        return;

    }


    try {

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
                        .displayName ||
                    stateName(),

                createdAt:
                    serverTimestamp()

            }
        );


        hide($("modal"));


        toast(
            "Duyuru yayınlandı ✓",
            "teacher"
        );


        await refreshTeacher();

    } catch (error) {

        console.error(error);

        toast(
            "Duyuru kaydedilemedi: " +
            error.message,
            "teacher"
        );

    }

}


/* =========================================================
   TEST OLUŞTURMA
========================================================= */

function buildTestModal() {

    $("modalBody").innerHTML = `

        <span class="eyebrow">
            SINAV
        </span>

        <h2>
            Yeni Test
        </h2>


        <label>

            Test adı

            <input
                id="testTitle"
                maxlength="120">

        </label>


        <label>

            Açıklama

            <textarea
                id="testDescription">
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


    let questionNumber = 0;


    function addQuestion() {

        questionNumber++;


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "question-editor";


        wrapper.innerHTML = `

            <div
                class="question-editor-title">

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


            <select
                class="question-correct">

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

    }


    $("addQuestion").onclick =
        addQuestion;


    addQuestion();


    $("saveTest").onclick =
        async () => {

            const title =
                $("testTitle")
                .value
                .trim();


            if (!title) {

                toast(
                    "Test adı gerekli.",
                    "teacher"
                );

                return;

            }


            const rows =
                [
                    ...
                    document
                        .querySelectorAll(
                            ".question-editor"
                        )
                ];


            if (!rows.length) {

                toast(
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

                toast(
                    "Soruları eksiksiz doldur.",
                    "teacher"
                );

                return;

            }


            try {

                await addDoc(
                    collection(
                        db,
                        "tests"
                    ),
                    {

                        title,

                        description:
                            $("testDescription")
                            .value
                            .trim(),

                        questions,

                        teacherId:
                            auth.currentUser.uid,

                        teacherName:
                            auth.currentUser
                                .displayName ||
                            stateName(),

                        createdAt:
                            serverTimestamp()

                    }
                );


                hide($("modal"));


                toast(
                    "Test yayınlandı ✓",
                    "teacher"
                );


                await refreshTeacher();


            } catch (error) {

                console.error(error);

                toast(
                    "Test kaydedilemedi: " +
                    error.message,
                    "teacher"
                );

            }

        };

}


/* =========================================================
   YARDIMCI
========================================================= */

function stateName() {

    return (
        teacherState
            .profile
            ?.name
        ||
        "Beray Öğretmeni"
    );

}

