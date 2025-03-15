const generateBtn = document.getElementById("generateBtn");
const textInput = document.getElementById("textInput");
const canvas = document.getElementById("canvas");
const videoOutput = document.getElementById("videoOutput");

const ctx = canvas.getContext("2d");

generateBtn.addEventListener("click", generateCartoon);

function generateCartoon() {
  const text = textInput.value.trim();
  
  if (!text) {
    alert("يرجى إدخال نص.");
    return;
  }

  // إعدادات القماش
  canvas.width = 600;
  canvas.height = 400;
  
  // هنا يمكن استخدام p5.js أو Three.js لرسم النص بطريقة مرحة
  // سنستخدم p5.js لتوفير رسوم كرتونية بسيطة على القماش
  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(600, 400);
      p.background(200, 200, 255);
    };
  
    p.draw = () => {
      p.fill(0);
      p.textSize(30);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(text, p.width / 2, p.height / 2);
    };
  };

  // تشغيل p5.js على القماش
  new p5(sketch, canvas);
  
  // إضافة الرسومات ثلاثية الأبعاد باستخدام Three.js
  add3DGraphics(text);
  
  // تحويل القماش إلى فيديو
  recordCanvasToVideo();
}

function add3DGraphics(text) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  renderer.setSize(600, 400);

  // إضافة مكعب ثلاثي الأبعاد مع نص داخل المشهد
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // إضافة نص ثلاثي الأبعاد
  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textGeometry = new THREE.TextGeometry(text, {
      font: font,
      size: 20,
      height: 5,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);
    textMesh.position.set(-150, 0, 0); // تحديد موقع النص داخل المشهد
  });

  camera.position.z = 5;

  // تحريك الكائنات (مكعب + نص)
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}

function recordCanvasToVideo() {
  const stream = canvas.captureStream(30); // 30 إطار في الثانية
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const videoBlob = new Blob(chunks, { type: 'video/webm' });
    const videoURL = URL.createObjectURL(videoBlob);
    videoOutput.src = videoURL;
  };

  recorder.start();
  setTimeout(() => recorder.stop(), 5000); // تسجيل الفيديو لمدة 5 ثواني
}
