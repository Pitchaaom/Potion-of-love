const ingredients = {
  understanding: { color: [173, 216, 230], amount: 0 },
  care: { color: [240, 128, 128], amount: 0 },
  honesty: { color: [144, 238, 144], amount: 0 },
  kindness: { color: [255, 255, 102], amount: 0 },
  patience: { color: [255, 182, 193], amount: 0 },
  loyalty: { color: [211, 211, 211], amount: 0 }
};

let totalAmount = 0;
let filling = null;
let fillingInterval;

// คำนวณสีผสมน้ำ
function mixColors() {
  const mixed = [0, 0, 0];
  for (const key in ingredients) {
    const ingredient = ingredients[key];
    mixed[0] += (ingredient.color[0] * ingredient.amount) / totalAmount;
    mixed[1] += (ingredient.color[1] * ingredient.amount) / totalAmount;
    mixed[2] += (ingredient.color[2] * ingredient.amount) / totalAmount;
  }
  return `rgb(${Math.round(mixed[0])}, ${Math.round(mixed[1])}, ${Math.round(mixed[2])})`;
}

const bottleCapacity = 100; // กำหนดปริมาตรขวดทั้งหมด

// อัปเดตเปอร์เซ็นต์ของแต่ละส่วนผสม
function updatePercentages() {
  Object.keys(ingredients).forEach((type) => {
    const percentageSpan = document.querySelector(
      `.ingredient-button[data-type="${type}"] + .percentage`
    );
    if (percentageSpan) {
      // คำนวณเปอร์เซ็นต์โดยเทียบกับปริมาตรขวดทั้งหมด
      const percentage = Math.round((ingredients[type].amount / bottleCapacity) * 100);
      percentageSpan.textContent = `${percentage}%`;
    }
  });
}

// เริ่มเติมน้ำ
function startFilling(type) {
  if (filling) return;
  filling = type;

  const testTube = document.getElementById('test-tube');
  testTube.style.backgroundColor = `rgb(${ingredients[type].color.join(',')})`;
  testTube.style.opacity = 1;
  testTube.style.transform = 'translateX(-50%) translateY(150px)';

  fillingInterval = setInterval(() => {
    if (totalAmount < bottleCapacity) { // ตรวจสอบไม่ให้เกินปริมาตรขวด
      ingredients[type].amount += 1;
      totalAmount += 1;
      const water = document.getElementById('water');
      water.style.height = `${(totalAmount / bottleCapacity) * 100}%`; // ปรับความสูงของน้ำ
      water.style.backgroundColor = mixColors();
      updatePercentages(); // อัปเดตเปอร์เซ็นต์ทุกครั้งที่เติมน้ำ
    } else {
      document.getElementById('analyzeButton').disabled = false;
      stopFilling();
    }
  }, 100);
}



// หยุดเติมน้ำ
function stopFilling() {
  clearInterval(fillingInterval);
  filling = null;

  const testTube = document.getElementById('test-tube');
  testTube.style.opacity = 0;
  testTube.style.transform = 'translateX(-50%) translateY(0)';
}

// วิเคราะห์ผล
function analyze() {
  const maxIngredient = Object.keys(ingredients).reduce((a, b) =>
    ingredients[a].amount > ingredients[b].amount ? a : b
  );

  const analysisText = {
    understanding: "You are highly understanding!",
    care: "You are very caring!",
    honesty: "You value honesty!",
    kindness: "You are very kind!",
    patience: "You are incredibly patient!",
    loyalty: "You are very loyal!"
  };

  const imagePaths = {
    understanding: "res/images/understanding.jpg", // เปลี่ยน path ตามไฟล์ของคุณ
    care: "res/images/understanding.jpg",
    honesty: "res/images/understanding.jpg",
    kindness: "res/images/understanding.jpg",
    patience: "res/images/understanding.jpg",
    loyalty: "res/images/understanding.jpg"
  };

  document.getElementById('result').innerText = analysisText[maxIngredient];
  const illustration = document.getElementById('illustration');
  illustration.innerHTML = `<img src="${imagePaths[maxIngredient]}" alt="${maxIngredient}" style="max-width: 100%; height: auto; border: 3px solid #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">`;


  // แสดงหน้าผลวิเคราะห์
  document.getElementById('selection-page').style.display = 'none';
  document.getElementById('analysis-page').style.display = 'block';
}

// รีเซ็ตขวดน้ำ
function reset() {
  for (const key in ingredients) {
    ingredients[key].amount = 0;
  }
  totalAmount = 0;
  const water = document.getElementById('water');
  water.style.height = '0';
  water.style.backgroundColor = 'lightblue';
  document.getElementById('analyzeButton').disabled = true;
  updatePercentages(); // รีเซ็ตเปอร์เซ็นต์ทั้งหมด
}


function playAgain() {
  reset();
  document.getElementById('selection-page').style.display = 'flex';
  document.getElementById('analysis-page').style.display = 'none';
}

// ตั้งค่า Event Listeners
document.querySelectorAll('.ingredient-button').forEach((button) => {
  button.addEventListener('mousedown', () => startFilling(button.dataset.type));
  button.addEventListener('mouseup', stopFilling);
});

document.getElementById('analyzeButton').addEventListener('click', analyze);
document.getElementById('resetButton').addEventListener('click', reset);
document.getElementById('playAgainButton').addEventListener('click', playAgain);
