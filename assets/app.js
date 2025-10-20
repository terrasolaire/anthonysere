const CONFIG = {
    contactLink: 'https://terrasolaire.github.io/anthonysere/',
    vcardData: `BEGIN:VCARD
VERSION:3.0
N:SERE;Anthony;;;
FN:Anthony SERE
TITLE:Co-fondateur et Directeur
ORG:Terra Solaire
TEL:06 01 99 09 40
TEL;TYPE=WORK:05 49 58 03 67
EMAIL:contact@terrasolaire.com
URL:https://terrasolaire.github.io/anthonysere/
ADR:;;23 Zone Artisanale de Galmoisin;Saint Maurice la Clouère;;86160;France
END:VCARD`
};

// Fonction de tracking Google Analytics 4
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, parameters);
    }
}

// Tracking de la visite de la page
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('page_view', {
        page_title: 'Carte de visite Anthony SERE',
        page_location: window.location.href,
        content_group1: 'carte_visite'
    });
});

function shareContact() {
    trackEvent('share_contact', {
        method: navigator.share ? 'native_share' : 'copy_link',
        event_category: 'engagement',
        event_label: 'partage_carte_visite'
    });
    
    if (navigator.share) {
        navigator.share({
            title: 'Anthony SERE',
            text: 'Carte de visite - Anthony SERE',
            url: CONFIG.contactLink
        });
    } else {
        copyToClipboard(CONFIG.contactLink);
    }
}

function copyContact() {
    trackEvent('copy_contact', {
        event_category: 'engagement',
        event_label: 'copie_lien_carte'
    });
    
    copyToClipboard(CONFIG.contactLink);
    showNotification('Lien de la carte de visite copié !');
}

function addToContacts() {
    trackEvent('add_to_contacts', {
        event_category: 'conversion',
        event_label: 'telechargement_vcard',
        value: 1
    });
    
    const blob = new Blob([CONFIG.vcardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Anthony_Sere.vcf';
    link.click();
    URL.revokeObjectURL(url);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
    }).catch(err => {
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #004779;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function openLink(url) {
    trackEvent('contact_click', {
        event_category: 'contact',
        event_label: 'website',
        contact_type: 'website',
        contact_url: url
    });
    window.open(url, '_blank');
}

function openEmail(email) {
    trackEvent('contact_click', {
        event_category: 'contact',
        event_label: 'email',
        contact_type: 'email',
        contact_email: email
    });
    window.location.href = `mailto:${email}`;
}

function openPhone(phone) {
    trackEvent('contact_click', {
        event_category: 'contact',
        event_label: 'phone',
        contact_type: 'phone',
        contact_phone: phone
    });
    window.location.href = `tel:${phone}`;
}

function openMaps(address) {
    trackEvent('contact_click', {
        event_category: 'contact',
        event_label: 'address',
        contact_type: 'address',
        contact_address: address
    });
    
    const encodedAddress = encodeURIComponent(address);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./service-worker.js')
            .then(function(registration) {
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

