import {
  auth, db, googleProvider,
  signInWithPopup, signOut, onAuthStateChanged,
  doc, getDoc, setDoc, collection, addDoc, serverTimestamp
} from "./firebase.js";

const screens = {
  role: document.getElementById("roleScreen"),
  student: document.getElementById("studentScreen"),
  teacher: document.getElementById("teacherScreen"),
  studentDone: document.getElementById("studentDoneScreen"),
  teacherDone: document.getElementById("teacherDoneScreen")
};

const toastEl = document.getElementById("toast");
let currentRole = null;

const classOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));

const subjectOptions = [
  "Türkçe", "Matematik", "Fen Bilimleri", "Sosyal Bilgiler",
  "İngilizce", "Din Kültürü", "Fizik", "Kimya",
  "Biyoloji", "Tarih", "Coğrafya", "Edebiyat"
];

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 3200);
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function fillSelect() {
  const select = document.getElementById("studentClass");
  classOptions.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = `${c}. sınıf`;
    select.appendChild(option);
  });
}

function makeChecks(containerId, namePrefix, options) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  options.forEach((value, index) => {
    const id = `${namePrefix}-${index}`;
    const label = document.createElement("label");
    label.className = "check-item";
    label.innerHTML = `
      <input type="checkbox" value="${value}" id="${id}">
      <span>${value}</span>
    `;
    container.appendChild(label);
  });
}

function selectedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input:checked`)].map(el => el.value);
}

function setAccountBox(elId, user) {
  document.getElementById(elId).innerHTML =
    `<strong>${user.displayName || "Google kullanıcısı"}</strong><br>${user.email}`;
}

async function googleLogin() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

async function loadStudentProfile(user) {
  const snap = await getDoc(doc(db, "students", user.uid));
  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("studentName").value = data.name || user.displayName || "";
    document.getElementById("studentClass").value = data.class || "";
  } else {
    document.getElementById("studentName").value = user.displayName || "";
  }
}

async function loadTeacherApplication(user) {
  const snap = await getDoc(doc(db, "teacherApplications", user.uid));
  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("teacherName").value = data.name || user.displayName || "";
    document.getElementById("teacherPhone").value = data.phone || "";

    for (const value of data.classes || []) {
      const el = [...document.querySelectorAll("#classChecks input")].find(x => x.value === value);
      if (el) el.checked = true;
    }

    for (const value of data.subjects || []) {
      const el = [...document.querySelectorAll("#subjectChecks input")].find(x => x.value === value);
      if (el) el.checked = true;
    }

    const status = data.status || "pending";
    const box = document.getElementById("teacherStatus");
    box.textContent = `Mevcut başvuru durumu: ${status}`;
    box.classList.remove("hidden");
  }
}

document.getElementById("studentRoleBtn").addEventListener("click", () => {
  currentRole = "student";
  showScreen("student");
});

document.getElementById("teacherRoleBtn").addEventListener("click", () => {
  currentRole = "teacher";
  showScreen("teacher");
});

document.querySelectorAll("[data-back]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRole = null;
    showScreen("role");
  });
});

document.getElementById("studentGoogleBtn").addEventListener("click", async () => {
  try {
    const user = await googleLogin();
    setAccountBox("studentAccountBox", user);
    document.getElementById("studentFormWrap").classList.remove("hidden");
    await loadStudentProfile(user);
  } catch (error) {
    showToast("Google girişi tamamlanamadı: " + error.message);
  }
});

document.getElementById("teacherGoogleBtn").addEventListener("click", async () => {
  try {
    const user = await googleLogin();
    setAccountBox("teacherAccountBox", user);
    document.getElementById("teacherFormWrap").classList.remove("hidden");
    await loadTeacherApplication(user);
  } catch (error) {
    showToast("Google hesabı seçilemedi: " + error.message);
  }
});

document.getElementById("studentSaveBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return showToast("Önce Google ile giriş yap.");

  const name = document.getElementById("studentName").value.trim();
  const className = document.getElementById("studentClass").value;

  if (!name || !className) {
    return showToast("İsim Soyisim ve sınıf alanlarını doldur.");
  }

  try {
    await setDoc(doc(db, "students", user.uid), {
      uid: user.uid,
      name,
      class: className,
      email: user.email || "",
      googleDisplayName: user.displayName || "",
      photoURL: user.photoURL || "",
      blocked: false,
      role: "student",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email: user.email || "",
      role: "student",
      updatedAt: serverTimestamp()
    }, { merge: true });

    showScreen("studentDone");
  } catch (error) {
    showToast("Öğrenci profili kaydedilemedi: " + error.message);
  }
});

document.getElementById("teacherApplyBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return showToast("Önce Google ile giriş yap.");

  const name = document.getElementById("teacherName").value.trim();
  const phone = document.getElementById("teacherPhone").value.trim();
  const classes = selectedValues("classChecks");
  const subjects = selectedValues("subjectChecks");

  if (!name || !phone || classes.length === 0 || subjects.length === 0) {
    return showToast("Tüm öğretmen başvuru bilgilerini doldur.");
  }

  try {
    await setDoc(doc(db, "teacherApplications", user.uid), {
      uid: user.uid,
      name,
      phone,
      email: user.email || "",
      googleDisplayName: user.displayName || "",
      photoURL: user.photoURL || "",
      classes,
      subjects,
      status: "pending",
      verificationStep: 1,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email: user.email || "",
      role: "teacher_applicant",
      updatedAt: serverTimestamp()
    }, { merge: true });

    showScreen("teacherDone");
  } catch (error) {
    showToast("Başvuru gönderilemedi: " + error.message);
  }
});

async function logoutAndReset() {
  await signOut(auth);
  document.getElementById("studentFormWrap").classList.add("hidden");
  document.getElementById("teacherFormWrap").classList.add("hidden");
  showScreen("role");
}

document.getElementById("studentLogoutBtn").addEventListener("click", logoutAndReset);
document.getElementById("teacherLogoutBtn").addEventListener("click", logoutAndReset);

document.getElementById("studentDoneBackBtn").addEventListener("click", () => showScreen("role"));
document.getElementById("teacherDoneBackBtn").addEventListener("click", () => showScreen("role"));

onAuthStateChanged(auth, async user => {
  if (!user) return;

  // Sayfa yenilenince, seçilen role göre formu açık tut.
  if (currentRole === "student") {
    setAccountBox("studentAccountBox", user);
    document.getElementById("studentFormWrap").classList.remove("hidden");
    await loadStudentProfile(user);
  }

  if (currentRole === "teacher") {
    setAccountBox("teacherAccountBox", user);
    document.getElementById("teacherFormWrap").classList.remove("hidden");
    await loadTeacherApplication(user);
  }
});

fillSelect();
makeChecks("classChecks", "class", classOptions);
makeChecks("subjectChecks", "subject", subjectOptions);
