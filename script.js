// script.js

// 현재 시간 표시 함수
function updateCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timeText = `${hours}:${minutes}:${seconds}`;
  document.getElementById('current-time').textContent = timeText;
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// 타이머 관련 변수
let timerInterval;
let remainingTime = 0; // 초 단위
let isRunning = false;

// 입력받은 시간을 초 단위로 계산
function getInputSeconds() {
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

// 초 단위 -> 시:분:초 화면에 표시
function displayTime(totalSeconds) {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');

  document.getElementById('hours').value = hrs;
  document.getElementById('minutes').value = mins;
  document.getElementById('seconds').value = secs;
}

// 알람 사운드 URL
const alarmSounds = {
  quiet: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
  loud: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
};

let selectedAlarm = "quiet"; // 기본값

// 알람 선택 라디오 버튼 이벤트 등록
document.querySelectorAll('input[name="alarmSound"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    selectedAlarm = e.target.value;
  });
});

// 시작 버튼 이벤트
document.getElementById('startBtn').addEventListener('click', () => {
  if (isRunning) return;

  remainingTime = getInputSeconds();
  if (remainingTime <= 0) return;

  isRunning = true;
  timerInterval = setInterval(() => {
    remainingTime--;
    displayTime(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      playAlarm();
    }
  }, 1000);
});

// 중지 버튼 이벤트
document.getElementById('stopBtn').addEventListener('click', () => {
  clearInterval(timerInterval);
  isRunning = false;
});

// 초기화 버튼 이벤트
document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(timerInterval);
  isRunning = false;
  remainingTime = 0;
  displayTime(0);
});

// 알람 소리 재생 함수
function playAlarm() {
  const alarm = new Audio(alarmSounds[selectedAlarm]);
  if (selectedAlarm === "quiet") {
    alarm.loop = true;
    alarm.play();

    // 10초 후 자동 정지 (필요에 따라 조절 가능)
    setTimeout(() => {
      alarm.loop = false;
      alarm.pause();
      alarm.currentTime = 0;
    }, 10000);
  } else {
    // 시끄러운 알람은 1회만 재생
    alarm.play();
  }
}
