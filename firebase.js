// firebase.js - conexão dos scraps públicos
// Este arquivo usa o Firestore que você criou no Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoDCKXwyKTOGvklvtAxc1kap2uC3kQIUIA",
  authDomain: "nivermaju.firebaseapp.com",
  projectId: "nivermaju",
  storageBucket: "nivermaju.firebasestorage.app",
  messagingSenderId: "523575512560",
  appId: "1:523575512560:web:86d04f3f2ac561e9b2135",
  measurementId: "G-ZRJLXF51YS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const scrapsRef = collection(db, "scraps");

function cleanText(value, max=500){
  return String(value || "").replace(/[<>]/g, "").trim().slice(0,max);
}

function randomAvatar(){
  const n = Math.floor(Math.random() * 9) + 1;
  return `avatares/avatar${n}.jpg`;
}

export async function enviarScrap(nome, mensagem){
  const nomeLimpo = cleanText(nome, 40) || "Visitante";
  const mensagemLimpa = cleanText(mensagem, 500);
  if(!mensagemLimpa) throw new Error("Escreva uma mensagem antes de enviar.");
  await addDoc(scrapsRef, {
    nome: nomeLimpo,
    mensagem: mensagemLimpa,
    avatar: randomAvatar(),
    createdAt: serverTimestamp(),
    site: "niver-maju"
  });
}

export function ouvirScraps(callback){
  const q = query(scrapsRef, orderBy("createdAt", "desc"), limit(80));
  return onSnapshot(q, snapshot => {
    const scraps = [];
    snapshot.forEach(doc => scraps.push({ id: doc.id, ...doc.data() }));
    callback(scraps);
  }, error => {
    console.error(error);
    callback([], error);
  });
}
