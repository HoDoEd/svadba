// ===== ДАТА СВАДЬБЫ (измени на свою!) =====
const WEDDING_DATE = new Date('2026-08-13T09:00:00');

// ===== ТАЙМЕР ОБРАТНОГО ОТСЧЁТА =====
function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    
    if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<p>Ура! Этот день настал! 🎉</p>';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== ПРОВЕРКА ВАЛИДНОСТИ ФОРМЫ (для кнопки) =====
function checkFormValidity() {
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const nameYes = document.getElementById('name-yes');
    const nameNo = document.getElementById('name-no');
    const submitBtn = document.querySelector('.btn-submit');
    
    if (!attendance || !submitBtn) return;
    
    let isValid = false;
    
    if (attendance.value === 'yes') {
        // Для "Да" проверяем имя + еда + напитки
        const food = document.getElementById('food');
        const drinks = document.getElementById('drinks');
        isValid = nameYes && nameYes.value.trim() !== '' &&
                  food && food.value !== '' &&
                  drinks && drinks.value !== '';
    } else {
        // Для "Нет" проверяем только имя
        isValid = nameNo && nameNo.value.trim() !== '';
    }
    
    if (isValid) {
        submitBtn.classList.add('active');
        submitBtn.disabled = false;
    } else {
        submitBtn.classList.remove('active');
        submitBtn.disabled = true;
    }
}

// ===== ПОКАЗАТЬ/СКРЫТЬ ПОЛЯ ФОРМЫ =====
function toggleFormFields() {
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const yesFields = document.getElementById('yesFields');
    const noFields = document.getElementById('noFields');
    
    const nameYes = document.getElementById('name-yes');
    const nameNo = document.getElementById('name-no');
    const food = document.getElementById('food');
    const drinks = document.getElementById('drinks');
    const allergy = document.getElementById('allergy');
    const messageNo = document.getElementById('message');
    
    if (!attendance) {
        checkFormValidity();
        return;
    }
    
    if (attendance.value === 'yes') {
        // ✅ Показываем поля для "Да"
        yesFields.classList.remove('hidden');
        noFields.classList.add('hidden');
        
        // ✅ ВКЛЮЧАЕМ все поля для "Да"
        if (nameYes) {
            nameYes.setAttribute('required', 'required');
            nameYes.disabled = false;
        }
        if (food) {
            food.setAttribute('required', 'required');
            food.disabled = false;
        }
        if (drinks) {
            drinks.setAttribute('required', 'required');
            drinks.disabled = false;
        }
        if (allergy) {
            // ✅ ИСПРАВЛЕНО: включаем поле аллергии!
            allergy.disabled = false;
        }
        
        // ✅ ОТКЛЮЧАЕМ поля для "Нет"
        if (nameNo) {
            nameNo.removeAttribute('required');
            nameNo.disabled = true;
        }
        if (messageNo) {
            messageNo.disabled = true;
        }
        
    } else {
        // ✅ Показываем поля для "Нет"
        yesFields.classList.add('hidden');
        noFields.classList.remove('hidden');
        
        // ✅ ВКЛЮЧАЕМ поля для "Нет"
        if (nameNo) {
            nameNo.setAttribute('required', 'required');
            nameNo.disabled = false;
        }
        if (messageNo) {
            messageNo.disabled = false;
        }
        
        // ✅ ОТКЛЮЧАЕМ все поля для "Да"
        if (nameYes) {
            nameYes.removeAttribute('required');
            nameYes.disabled = true;
        }
        if (food) {
            food.disabled = true;
        }
        if (drinks) {
            drinks.disabled = true;
        }
        if (allergy) {
            // ✅ ОТКЛЮЧАЕМ поле аллергии
            allergy.disabled = true;
        }
    }
    
    // ✅ Проверяем валидность после переключения
    checkFormValidity();
}

// ===== ОТПРАВКА ФОРМЫ В GOOGLE ТАБЛИЦЫ =====
// ВАЖНО: Замени URL на свой (инструкция ниже в README)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzyKJubavmE84PuRJj7JD7SiY5tvtzVOzKTI8er3gGydFWhiok_jYwrWwI5QSduQrJN/exec';

document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.querySelector('.btn-submit');
	

    
    // Блокируем кнопку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    statusEl.textContent = '';
    
    // Собираем данные
    const formData = new FormData(this);
	
	// Преобразуем английские значения в русские
	const foodMap = {
    'meat': 'Мясо',
    'fish': 'Рыба',
    'vegetarian': 'Вегетарианское'
	};

	const drinksMap = {
    'wine': 'Вино/Шампанское',
    'strong': 'Крепкое',
    'soft': 'Сок/Минералка'
	};

	const attendanceMap = {
    'yes': 'Придёт',
    'no': 'Не придёт'
	};
	
	const sleepingMap = {
	'yes': 'Да',
	'no': 'Нет'
	};
	
    const data = {
		attendance: attendanceMap[formData.get('attendance')] || formData.get('attendance'),
		name: formData.get('name') || 'Аноним',
		food: foodMap[formData.get('food')] || formData.get('food') || '-',
		drinks: drinksMap[formData.get('drinks')] || formData.get('drinks') || '-',
		allergy: formData.get('allergy') || '-',
		message: formData.get('message') || '-',
		sleeping: sleepingMap[formData.get('sleeping')] || formData.get('sleeping') || '-',
		timestamp: new Date().toLocaleString('ru-RU')
	};
	
	console.log('Данные для отправки:', data);
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Ответ сервера:', response);
        
        statusEl.textContent = '✅ Спасибо! Ваш ответ записан!';
        statusEl.classList.add('success');
        statusEl.classList.remove('error');
        
        // Сброс формы
        this.reset();
        setTimeout(() => {
            toggleFormFields();
        }, 100);
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        statusEl.textContent = '❌ Ошибка отправки. Проверьте консоль (F12).';
        statusEl.classList.add('error');
        statusEl.classList.remove('success');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
});

// ===== ДОБАВЛЯЕМ СЛУШАТЕЛИ НА ПОЛЯ ФОРМЫ (для проверки валидности) =====
document.addEventListener('DOMContentLoaded', function() {
    // Слушаем изменения на всех полях формы
    const formInputs = document.querySelectorAll('#rsvpForm input, #rsvpForm select, #rsvpForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('change', checkFormValidity);
    });
    
    // Initial check
    checkFormValidity();
});

// ===== ПЛАВНЫЙ СКРОЛЛ =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});