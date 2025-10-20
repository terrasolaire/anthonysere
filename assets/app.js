const CONFIG = {
    contactLink: 'https://terrasolaire.github.io/anthonysere/',
    // Renseignez ici l'URL de votre Worker Cloudflare (ex: https://cv-analytics.yourname.workers.dev/events)
    analyticsEndpoint: 'https://cv-analytics.wyxvgyqftb.workers.dev/events',
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

// Envoi d'un événement vers le collecteur Cloudflare (si configuré)
async function sendEvent(eventName, properties) {
    try {
        if (!CONFIG.analyticsEndpoint) return; // pas d'envoi si non configuré

        const payload = {
            name: eventName,
            properties: {
                ...properties,
                page: location.pathname + location.search,
                pageTitle: document.title || null,
                referrer: document.referrer || null,
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenW: (window.screen && window.screen.width) ? window.screen.width : null,
                screenH: (window.screen && window.screen.height) ? window.screen.height : null,
                ts: new Date().toISOString()
            }
        };

        await fetch(CONFIG.analyticsEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify(payload)
        });
    } catch (_) {
        // silencieux
    }
}

function shareContact() {
    sendEvent('share_contact', { method: navigator.share ? 'native_share' : 'copy_link' });

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
    sendEvent('copy_contact', {});
    copyToClipboard(CONFIG.contactLink);
    showNotification('Lien de la carte de visite copié !');
}

function addToContacts() {
    sendEvent('add_to_contacts', { file: 'Anthony_Sere.vcf' });
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
    // Détecte un "provider" simple pour les réseaux
    let provider = null;
    try {
        const u = new URL(url);
        const h = u.hostname;
        if (h.includes('linkedin')) provider = 'LinkedIn';
        else if (h.includes('facebook')) provider = 'Facebook';
        else if (h.includes('instagram')) provider = 'Instagram';
        else provider = 'Site';
    } catch(_) { provider = 'Site'; }
    sendEvent('contact_click', { type: 'website', value: url, provider });
    window.open(url, '_blank');
}

function openEmail(email) {
    sendEvent('contact_click', { type: 'email', value: email });
    window.location.href = `mailto:${email}`;
}

function openPhone(phone) {
    sendEvent('contact_click', { type: 'phone', value: phone });
    window.location.href = `tel:${phone}`;
}

function openMaps(address) {
    sendEvent('contact_click', { type: 'address', value: address });
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


