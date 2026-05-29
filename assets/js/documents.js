// DOM элементы
const modal = document.getElementById('pdfModal');
const modalTitle = document.getElementById('modalTitle');
const pdfFrame = document.getElementById('pdfFrame');
const modalClose = document.getElementById('modalClose');
const searchInput = document.getElementById('documentSearch');
const searchClear = document.getElementById('searchClear');
const searchEmpty = document.getElementById('searchEmpty');
const documentsList = document.querySelector('.documents-list');

// === ЛОГИКА ПОИСКА ===
searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const links = document.querySelectorAll('.document-link');
    let visibleCount = 0;
    
    // Показываем/скрываем кнопку очистки
    searchClear.style.display = query ? 'flex' : 'none';
    
    links.forEach(link => {
        const title = link.dataset.title?.toLowerCase() || '';
        const matches = title.includes(query);
        
        if (matches) {
            link.style.display = 'flex';
            visibleCount++;
        } else {
            link.style.display = 'none';
        }
    });
    
    // Показываем сообщение "ничего не найдено"
    if (searchEmpty) {
        searchEmpty.style.display = (visibleCount === 0 && query) ? 'flex' : 'none';
    }
    
    // Скрываем/показываем список, если все элементы скрыты
    if (documentsList) {
        documentsList.style.display = (visibleCount === 0 && query) ? 'none' : 'block';
    }
});

// Очистка поиска по кнопке
searchClear?.addEventListener('click', () => {
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        // Триггерим событие input для обновления фильтра
        searchInput.dispatchEvent(new Event('input'));
    }
});

// === ЛОГИКА МОДАЛКИ (твоя существующая) ===
documentsList?.addEventListener('click', (e) => {
    const link = e.target.closest('.document-link');
    if (!link) return;
    
    e.preventDefault();
    
    const pdfPath = link.dataset.pdf;
    const docTitle = link.dataset.title;
    
    if (pdfPath && docTitle) {
        openModal(pdfPath, docTitle);
    }
});

function openModal(pdfPath, title) {
    modalTitle.textContent = title;
    pdfFrame.src = pdfPath + '#toolbar=0&navpanes=0';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    pdfFrame.src = '';
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.querySelector('.modal-content')?.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});