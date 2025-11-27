
function validateFormData(data) {
    const errors = {};

    if (!data.name || typeof data.name !== 'string' || data.name.length > 255) {
        errors.name = 'Please enter a valid name. It should not exceed 255 characters.';
    }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = 'Please enter a valid email address.';
    }
    if (!data.phone || typeof data.phone !== 'string' || data.phone.length > 20) {
        errors.phone = 'Please enter a valid phone number (maximum 20 characters).';
    }
    if (!data.faculty || typeof data.faculty !== 'string' || data.faculty.length > 100) {
        errors.faculty = 'Please enter the name of your faculty. It should not exceed 100 characters.';
    }
    if (!data.university || typeof data.university !== 'string' || data.university.length > 100) {
        errors.university = 'Please enter the name of your college. It should not exceed 100 characters.';
    }
    if (!data.level || typeof data.level !== 'string' || data.level.length > 100) {
        errors.level = 'Please specify your level (e.g., First Year, Second Year). It should not exceed 100 characters.';
    }
    if (!data.strengths || typeof data.strengths !== 'string') {
        errors.strengths = 'Please describe your strengths.';
    }
    if (!data.weaknesses || typeof data.weaknesses !== 'string' ) {
        errors.weaknesses = 'Please describe your weaknesses.';
    }
    if (!data.committee || typeof data.committee !== 'string' || data.committee.length > 100) {
        errors.committee = 'Please specify the committee you want to join. It should not exceed 100 characters.';
    }

    return errors;
}

const toggleBtn = document.querySelector(".toggle-btn");
const toggleBtnIcon = document.querySelector(".toggle-btn i");
const dropdown = document.querySelector(".dropdown");

toggleBtn.onclick = function () {
dropdown.classList.toggle("open");
const isOpen = dropdown.classList.contains("open");
toggleBtnIcon.classList = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
};

// end-nav

// form

const labels = document.querySelectorAll(".form-control label");
labels.forEach((label) => {
label.innerHTML = label.innerText

  .split("")
  .map(
    (letter, idx) =>
      `<span style="transition-delay:${idx * 70}ms">${letter}</span>`
  )
  .join("");
});


  const form = document.querySelector('form');
  const submitButton = document.querySelector('.login-btn');

 
  const messageDiv = document.createElement('div');
  messageDiv.style.marginTop = '10px';
  submitButton.parentNode.insertBefore(messageDiv, submitButton);
  
  form.addEventListener('submit', async (e) => {
e.preventDefault();

const data = {
name: document.querySelector('#name').value.trim(),
email: document.querySelector('#email').value.trim(),
phone: document.querySelector('#phone').value.trim(),
faculty: document.querySelector('#faculty').value.trim(),
university: document.querySelector('#university').value.trim(),
level: document.querySelector('#level').value.trim(),
strengths: document.querySelector('#strengths').value.trim(),
weaknesses: document.querySelector('#weaknesses').value.trim(),
committee: document.querySelector('#weakness-options').value.trim(),
committee2: document.querySelector('#weakness-options2').value.trim(),
};

const errors = validateFormData(data);

console.log(errors) 
if (Object.keys(errors).length > 0) {

// Display errors
// Object.keys(errors).forEach((field) => {
//     document.querySelector(`#${field}-error`).textContent = errors[field];
// });

const message = Object.values(errors)[0] || 'An unexpected error occurred.';
messageDiv.textContent = message;
messageDiv.style.color = 'red';
return;
}

try {
const response = await axios.post(
'https://x-project.co/public/api/applications/store',
data
);
console.log(response.status)
if (response.status === 201) {
const formContainer = document.querySelector('.form-container');
formContainer.innerHTML = `
  <div class="top">
      <img src="img/logo.png" alt="Project Logo" />
      <h1>X-Project</h1>
  </div>
  <div class="success-container">
      Application submitted successfully!
  </div>
`;
}else{ formContainer.innerHTML = `
  <div class="top">
      <img src="img/logo.png" alt="Project Logo" />
      <h1>X-Project</h1>
  </div>
  <div class="success-container">
      error 
  </div>
`;}
} catch (error) {
console.error('Error:', error.response?.data || error.message);
const message = error.response?.data?.message || 'An unexpected error occurred.';
messageDiv.textContent = message;
messageDiv.style.color = 'red';
}
});

function validateFormData(data) {
    const errors = {};

    if (!data.name || typeof data.name !== 'string' || data.name.length > 100) {
        errors.name = 'Please enter a valid name. It should not exceed 100 characters.';
    }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = 'Please enter a valid email address.';
    }
    if (!data.phone || typeof data.phone !== 'string' || data.phone.length > 20) {
        errors.phone = 'Please enter a valid phone number (maximum 20 characters).';
    }
    if (!data.faculty || typeof data.faculty !== 'string' || data.faculty.length > 100) {
        errors.faculty = 'Please enter the name of your faculty. It should not exceed 100 characters.';
    }
    if (!data.university || typeof data.university !== 'string' || data.university.length > 100) {
        errors.university = 'Please enter the name of your college. It should not exceed 100 characters.';
    }
    if (!data.level || typeof data.level !== 'string' || data.level.length > 100) {
        errors.level = 'Please specify your level (e.g., First Year, Second Year). It should not exceed 100 characters.';
    }
    if (!data.strengths || typeof data.strengths !== 'string' ) {
        errors.strengths = 'Please describe your strengths.';
    }
    if (!data.weaknesses || typeof data.weaknesses !== 'string') {
        errors.weaknesses = 'Please describe your weaknesses.';
    }
    if (!data.committee || typeof data.committee !== 'string' || data.committee.length > 100) {
        errors.committee = 'Please specify the committee you want to join. It should not exceed 100 characters.';
    }

    return errors;
}
  

  // document.querySelector('.login-btn').addEventListener('click', function (event) {
  //   event.preventDefault(); // منع السلوك الافتراضي للفورم

  //   // تحقق من أن جميع الحقول تم تعبئتها
  //   let inputs = document.querySelectorAll('input, select');
  //   let allFilled = true;

  //   inputs.forEach(input => {
  //       if (!input.value) {
  //           allFilled = false;
  //       }
  //   });
  //   if (allFilled) {
  //       // إزالة كل شيء ما عدا الصورة
  //       const formContainer = document.querySelector('.form-container');

  //       // الاحتفاظ بالصورة فقط
  //       const logo = formContainer.querySelector('.top').innerHTML;

  //       // استبدال محتوى الفورم بالرسالة مع الإبقاء على الصورة
  //       formContainer.innerHTML = `
  //           <div class="top">
  //               ${logo}
  //           </div>
  //           <div id="success-message" class="success-container">
  //               Application submitted successfully!
  //           </div>
  //       `;

        // تعديل تصميم رسالة النجاح لجعلها أنيقة
//         const successMessage = document.getElementById('success-message');
//         successMessage.style.marginTop = '20px';
//     } else {
//         alert('Please fill out all fields before submitting.');
//     }
// }); 

// end-form