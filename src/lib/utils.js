export function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

export function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(new Date(date));
}

export function formatDateTime(date) {
    return `${formatDate(date)} at ${formatTime(date)}`;
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

export function isDuplicateItem(items, newItem) {
    return items.some(item => 
        item.name.toLowerCase().trim() === newItem.toLowerCase().trim()
    );
}
