var committeeData = {
  web: {
    to: "webdevelopmenthead@gmail.com",
    cc: "webdevhrseniorsx25@gmail.com"
  },
  Logistics: {
    to: "logisticsheads25@gmail.com",
    cc: "logisticshrseniorsx25@gmail.com"
  },
  Marketing: {
    to: "marketing.XProject.25@gmail.com",
    cc: "marketingseniorsx25@gmail.com"
  },
  FR: {
    to: "headsfrxproject25@gmail.com",
    cc: "frseniorsx25@gmail.com"
  },
  PR: {
    to: "prheadsx@gmail.com",
    cc: "prhrseniorsx25@gmail.com"
  },
  SR: {
    to: "Srheads1@gmail.com",
    cc: "srhrseniorsx25@gmail.com"
  },
  PM: {
    to: "pmheadsX25@gmail.com",
    cc: "pmhrseniorsx25@gmail.com"
  },
  AC: {
    to: "acheads.xproject25@gmail.com",
    cc: "achrseniorsx25@gmail.com"
  },
  GD: {
    to: "gdxproject25@gmail.com",
    cc: "gdhrseniorssx@gmail.com"
  },
  camera: {
    to: "Photography.heads.xproject@gmail.com",
    cc: "photographyhrseniorsx25@gmail.com"
  },
  HR: {
    to: "hrheadsxproject25@gmail.com",
    cc: "srhrseniorsx25@gmail.com"
  }
};
function updateHeadAndHR() {
  var committee = document.getElementById("committeeSelect").value;
  var subject = document.getElementById("subjectSelect").value;

  if (committeeData[committee]) {
    let head = committeeData[committee].to;
    let hr = committeeData[committee].cc;

    if (subject === "excuse") {
      document.getElementById("to").value = hr;
      document.getElementById("cc").value = head;
    } else if (subject === "task") {
      document.getElementById("to").value = head;
      document.getElementById("cc").value = hr;
    } else {
      document.getElementById("to").value = "";
      document.getElementById("cc").value = "";
    }
  }
}
function toggleSubjectFields() {
  const subject = document.getElementById("subjectSelect").value;
  document.getElementById("excuseOptions").classList.toggle("hidden", subject !== "excuse");
  document.getElementById("taskUpload").classList.toggle("hidden", subject !== "task");
  updateHeadAndHR(); // لتحديث to و cc بعد تغيير الـ subject
}
function submitForm() {
  const subject = document.getElementById("subjectSelect").value;
  const committee = document.getElementById("committeeSelect").value;
  const description = document.getElementById("description").value || "";
  const senderName = document.getElementById("senderName").value.trim();
  const senderEmail = document.getElementById("senderEmail").value.trim();

  let head = "";
  let hr = "";

  if (committeeData[committee]) {
    head = committeeData[committee].to;
    hr = committeeData[committee].cc;
  }

  let to = "", cc = "";

  if (subject === "task") {
    to = head;
    cc = hr;
  } else if (subject === "excuse") {
    to = hr;
    cc = head;
  }

  let body = "Dear All,\nHope this email finds you well.\n\n";

  if (subject === "task") {
    body += `Here's (Task - please find attached).\n\n`;
  } else if (subject === "excuse") {
    const sessionTime = document.getElementById("sessionTime").value;
    const excuseReason = document.getElementById("excuseReason").value;
    body += `Kindly be informed that I will not be able to attend (${sessionTime}) because of (${excuseReason}).\n\n`;
  }

  if (description.trim()) {
    body += "Additional Notes:\n" + description + "\n\n";
  }

  body += `Regards,\n${senderName}\n${senderEmail}`;

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&cc=${encodeURIComponent(cc)}&su=${encodeURIComponent(subject.toUpperCase())}&body=${encodeURIComponent(body)}`;

  if (/Mobi|Android/i.test(navigator.userAgent)) {
    const mailtoLink = `mailto:${encodeURIComponent(to)}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(subject.replace('_', ' ').toUpperCase())}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

  } else {
    
    window.open(gmailLink, '_blank');
  }
}
