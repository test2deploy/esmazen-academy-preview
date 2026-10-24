const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const services = {
  aile: {
    kicker: 'Bireysel veya grup çalışması',
    title: 'Aile Dizimi',
    body: `
      <p>Aile sistemindeki tekrarları, ilişkisel dinamikleri ve geçmişten taşındığı düşünülen duygusal yükleri fark etmeye yönelik destekleyici bir kişisel gelişim çalışmasıdır.</p>
      <ul>
        <li>Online bireysel veya grup formatında uygulanabilir.</li>
        <li>Aile üyelerinin çalışmaya katılması gerekmez.</li>
        <li>Çalışma öncesinde ele almak istediğiniz konu birlikte netleştirilir.</li>
      </ul>
      <p><strong>Not:</strong> Tıbbi veya psikolojik teşhis ve tedavi yöntemi değildir.</p>
    `
  },
  jaas: {
    kicker: 'Bireysel çalışma ve eğitim',
    title: 'Jean Adrienne Arınma Sistemi',
    body: `
      <p>JAAS, yaşamın farklı alanlarında tekrar eden düşünce ve davranış kalıplarını fark etmeye odaklanan yapılandırılmış bir kişisel gelişim yaklaşımıdır.</p>
      <ul>
        <li>Bire bir, online veya yüz yüze çalışma seçeneği.</li>
        <li>JAAS 1. Seviye uygulayıcılık eğitimi belirli tarihlerde grup olarak sunulur.</li>
        <li>Süreç ve eğitim takvimi ön görüşmede paylaşılır.</li>
      </ul>
    `
  },
  chtq: {
    kicker: 'Özle bağ kurma çalışması',
    title: 'CHTQ',
    body: `
      <p>Kişinin kendi yaşamına farklı bir pencereden bakmasına, deneyimleri arasındaki bağlantıları fark etmesine ve içsel kaynaklarıyla temas kurmasına odaklanan bireysel bir çalışmadır.</p>
      <p>Seansın kapsamı, ele almak istediğiniz konu ve kişisel ihtiyacınız doğrultusunda ön görüşmede belirlenir.</p>
    `
  },
  bilincalti: {
    kicker: 'İçsel dönüşüm yolculuğu',
    title: 'Bilinçaltı Farkındalık Çalışmaları',
    body: `
      <p>Tekrarlayan kalıpları, zorlandığınız alanları ve yerleşmiş inançları daha yakından fark etmeniz için kişiye özel bir süreç sunar.</p>
      <ul>
        <li>Keşif ve değerlendirme görüşmesi</li>
        <li>Farkındalık soruları ve rehberli pratikler</li>
        <li>Günlük yaşam için kişiye özel egzersiz önerileri</li>
      </ul>
    `
  },
  access: {
    kicker: 'Yüz yüze uygulama',
    title: 'Access Bars',
    body: `
      <p>Baş bölgesindeki belirli noktalara hafif dokunuşlarla uygulanan, gevşeme ve kişisel farkındalık odaklı tamamlayıcı bir wellness çalışmasıdır.</p>
      <p>Uygulama yüz yüze gerçekleştirilir. Deneyimler kişiden kişiye değişebilir; tıbbi bir tedavi değildir.</p>
    `
  },
  healy: {
    kicker: 'Cihaz ve kullanım danışmanlığı',
    title: 'Healy Danışmanlığı',
    body: `
      <p>Healy cihazları hakkında genel bilgilendirme, ihtiyaçlara göre model seçeneklerini değerlendirme, sipariş ve kurulum sürecinde bire bir destek sunulur.</p>
      <p>Healy genel esenlik amacıyla kullanılan bir cihazdır; tıbbi teşhis veya tedavi cihazı değildir. Sağlık sorunları için uzman hekime başvurulmalıdır.</p>
    `
  }
};

const serviceDialog = document.querySelector('#service-dialog');
const dialogKicker = document.querySelector('#dialog-kicker');
const dialogTitle = document.querySelector('#dialog-title');
const dialogContent = document.querySelector('#dialog-content');
const dialogClose = document.querySelector('.dialog-close');
const dialogContact = document.querySelector('#dialog-contact');

document.querySelectorAll('[data-service]').forEach((card) => {
  card.addEventListener('click', () => {
    const service = services[card.dataset.service];
    dialogKicker.textContent = service.kicker;
    dialogTitle.textContent = service.title;
    dialogContent.innerHTML = service.body;
    serviceDialog.showModal();
  });
});

dialogClose.addEventListener('click', () => serviceDialog.close());
dialogContact.addEventListener('click', () => serviceDialog.close());
serviceDialog.addEventListener('click', (event) => {
  if (event.target === serviceDialog) serviceDialog.close();
});

const chatLauncher = document.querySelector('#chat-launcher');
const chatPanel = document.querySelector('#chat-panel');
const chatClose = document.querySelector('#chat-close');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('#chat-messages');
const chatSuggestions = document.querySelector('#chat-suggestions');

function toggleChat(open) {
  chatPanel.hidden = !open;
  chatLauncher.setAttribute('aria-expanded', String(open));
  if (open) setTimeout(() => chatInput.focus(), 80);
}

chatLauncher.addEventListener('click', () => toggleChat(chatPanel.hidden));
chatClose.addEventListener('click', () => toggleChat(false));

function normalize(text) {
  return text
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9çğıöşü\s]/gi, ' ');
}

function getAnswer(question) {
  const q = normalize(question);

  if (/acil|intihar|kendime zarar|kriz/.test(q)) {
    return 'Bu konuda sohbet üzerinden yönlendirme yapamam. Kendin veya bir başkası acil tehlikedeyse bulunduğun ülkedeki acil yardım hattını ara ve bir sağlık profesyoneline ulaş.';
  }
  if (/doktor|tedavi|terapi|tani|depresyon|hastalik|ilac|psikolog|psikiyatri/.test(q)) {
    return 'Esmazen Academy çalışmaları tıbbi veya psikolojik tanı, tedavi ya da terapi yerine geçmez. Sağlıkla ilgili konularda doktorunuzun veya ilgili sağlık profesyonelinin önerilerini takip etmelisiniz.';
  }
  if (/aile|dizim|kok|nesil/.test(q)) {
    return 'Aile Dizimi, aile sistemindeki tekrarları ve ilişkisel dinamikleri fark etmeye yönelik destekleyici bir kişisel gelişim çalışmasıdır. Bireysel veya grup formatında, online yapılabilir; aile üyelerinin katılması gerekmez.';
  }
  if (/jaas|jean|adrienne|arinma/.test(q)) {
    return 'JAAS bire bir, online veya yüz yüze uygulanabilir. Ayrıca belirli tarihlerde JAAS 1. Seviye uygulayıcılık eğitimi düzenlenir. Güncel takvim için iletişim bölümünden bilgi alabilirsin.';
  }
  if (/chtq|ozum|oz ile|ozle/.test(q)) {
    return 'CHTQ, kişinin kendi yaşamına farklı bir pencereden bakmasına ve içsel kaynaklarıyla temas kurmasına odaklanan bireysel bir çalışmadır. Kapsam, ön görüşmede ele almak istediğin konuya göre belirlenir.';
  }
  if (/bilincalti|farkindalik|kalip|tekrar/.test(q)) {
    return 'Bilinçaltı farkındalık süreci; keşif görüşmesi, farkındalık soruları ve kişiye uygun günlük pratiklerden oluşur. Amaç, tekrar eden kalıpları daha yakından görmen için alan açmaktır.';
  }
  if (/access|bars/.test(q)) {
    return 'Access Bars, yüz yüze gerçekleştirilen gevşeme ve farkındalık odaklı tamamlayıcı bir wellness uygulamasıdır. Tıbbi bir tedavi değildir.';
  }
  if (/healy|cihaz|frekans/.test(q)) {
    return 'Healy danışmanlığında cihaz seçenekleri, sipariş ve kurulum süreci hakkında genel destek verilir. Cihaz tıbbi teşhis veya tedavi yerine geçmez.';
  }
  if (/online|zoom|uzaktan|nerede/.test(q)) {
    return 'Birçok çalışma Zoom üzerinden online yapılabilir. Yalnızca sakin ve rahatsız edilmeyeceğin bir alan ayırman yeterlidir. Access Bars ise yüz yüze uygulanır.';
  }
  if (/egitim|atolye|kurs|takvim/.test(q)) {
    return 'JAAS 1. Seviye, Aura–Çakralar–Meridyenler, Öz Sevgi, Anne/Baba Soyu ve İç Çocuk temalı eğitim ve atölyeler bulunuyor. Tarihler dönemsel olarak açıklanır.';
  }
  if (/randevu|iletisim|ucret|fiyat|kayit|katil/.test(q)) {
    return 'Randevu, ücret ve güncel takvim bilgileri için İletişim bölümünden ulaşabilirsin. Bu taslakta telefon ve e-posta bilgileri henüz eklenmedi.';
  }
  if (/hangi|calisma|hizmet|neler/.test(q)) {
    return 'Başlıca çalışmalar: Aile Dizimi, JAAS, CHTQ, Bilinçaltı Farkındalık, Access Bars ve Healy danışmanlığı. İstersen birinin adını yaz; kısa bilgi vereyim.';
  }
  if (/merhaba|selam|hey|nasilsin/.test(q)) {
    return 'Merhaba. Çalışmalar, eğitimler, online seanslar veya randevu süreci hakkında ne öğrenmek istersin?';
  }

  return 'Bu soruyu mevcut site bilgileriyle net yanıtlayamadım. “Çalışmalar”, “online seans”, “eğitimler” veya belirli bir çalışma adını sorabilirsin. Kişisel bir konu için Esma ile iletişime geçmen en doğrusu olur.';
}

function addMessage(text, sender) {
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function ask(question) {
  const cleaned = question.trim();
  if (!cleaned) return;
  addMessage(cleaned, 'user');
  chatInput.value = '';
  window.setTimeout(() => addMessage(getAnswer(cleaned), 'assistant'), 320);
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  ask(chatInput.value);
});

chatSuggestions.addEventListener('click', (event) => {
  const button = event.target.closest('[data-question]');
  if (button) ask(button.dataset.question);
});
