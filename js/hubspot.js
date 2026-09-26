/**
 * HubSpot CRM Integration for Cajun Ventures
 * ==========================================
 *
 * This module handles form submissions to HubSpot CRM via the Forms API.
 * It works alongside the existing Netlify Forms submission for redundancy.
 *
 * CONFIGURATION REQUIRED:
 * Replace the placeholder values below with your actual HubSpot credentials:
 * - HUBSPOT_PORTAL_ID: Your HubSpot portal ID (found in HubSpot settings)
 * - HUBSPOT_CONTACT_FORM_ID: Form GUID for contact form
 * - HUBSPOT_QUOTE_FORM_ID: Form GUID for quote request form
 *
 * To get these values:
 * 1. Log into HubSpot
 * 2. Go to Marketing > Forms
 * 3. Create a form or use an existing one
 * 4. Click "Share" or "Embed" to find the Portal ID and Form GUID
 */

const HubSpotConfig = {
    // IMPORTANT: Replace these with your actual HubSpot credentials
    portalId: 'YOUR_PORTAL_ID', // e.g., '12345678'
    forms: {
        contact: 'YOUR_CONTACT_FORM_ID', // e.g., 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        quote: 'YOUR_QUOTE_FORM_ID'      // e.g., 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    },
    // HubSpot Forms API endpoint
    apiEndpoint: 'https://api.hsforms.com/submissions/v3/integration/submit'
};

/**
 * Field mapping from website form fields to HubSpot contact properties.
 *
 * STANDARD HUBSPOT PROPERTIES (use these directly):
 * - email, firstname, lastname, phone, company, website
 * - address, city, state, zip, country
 * - jobtitle, message
 *
 * FOR CUSTOM FIELDS, you must create them in HubSpot first:
 * 1. Go to Settings > Data Management > Properties
 * 2. Click "Create property"
 * 3. Select "Contact" as the object type
 * 4. Use the internal name shown below (e.g., 'service_needed')
 *
 * RECOMMENDED CUSTOM PROPERTIES TO CREATE IN HUBSPOT:
 * - service_needed (Single-line text) - Type of service requested
 * - property_location (Single-line text) - Property address/city
 * - property_quantity (Single-line text) - Size in acres
 * - land_condition (Dropdown) - Current land condition
 * - project_timeline (Dropdown) - When work is needed
 * - preferred_contact (Dropdown) - Phone/Text/Email
 * - referral_source (Dropdown) - How they heard about us
 * - form_subject (Single-line text) - Contact form subject
 */
const FieldMappings = {
    // Contact form field mappings
    contact: {
        'name': 'firstname',           // Will be split into first/last automatically
        'email': 'email',              // Standard HubSpot property
        'phone': 'phone',              // Standard HubSpot property
        'subject': 'form_subject',     // CUSTOM: Create in HubSpot or use 'message'
        'message': 'message'           // Standard HubSpot property
    },
    // Quote form field mappings
    quote: {
        'name': 'firstname',           // Will be split into first/last automatically
        'email': 'email',              // Standard HubSpot property
        'phone': 'phone',              // Standard HubSpot property
        'location': 'property_location', // CUSTOM: Create property_location in HubSpot
        'service': 'service_needed',   // CUSTOM: Create service_needed in HubSpot
        'quantity': 'property_quantity', // CUSTOM: Create property_quantity in HubSpot
        'condition': 'land_condition', // CUSTOM: Create land_condition in HubSpot
        'timeline': 'project_timeline', // CUSTOM: Create project_timeline in HubSpot
        'description': 'message',      // Standard HubSpot property
        'referral': 'referral_source', // CUSTOM: Create referral_source in HubSpot
        'contact-method': 'preferred_contact' // CUSTOM: Create preferred_contact in HubSpot
    }
};

/**
 * Parse a full name into first and last name components
 * @param {string} fullName - The complete name string
 * @returns {object} Object with firstname and lastname properties
 */
function parseName(fullName) {
    if (!fullName) return { firstname: '', lastname: '' };

    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
        return { firstname: parts[0], lastname: '' };
    }

    return {
        firstname: parts[0],
        lastname: parts.slice(1).join(' ')
    };
}

/**
 * Get the page context for HubSpot tracking
 * @returns {object} Page context object
 */
function getPageContext() {
    return {
        pageUri: window.location.href,
        pageName: document.title
    };
}

/**
 * Get HubSpot tracking cookie (hutk) if available
 * The hutk cookie is set by the HubSpot tracking code
 * @returns {string|null} The hutk cookie value or null
 */
function getHubSpotCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'hubspotutk') {
            return value;
        }
    }
    return null;
}

/**
 * Build the HubSpot form submission payload
 * @param {FormData} formData - The form data to submit
 * @param {string} formType - Either 'contact' or 'quote'
 * @returns {object} The formatted payload for HubSpot API
 */
function buildHubSpotPayload(formData, formType) {
    const fields = [];
    const mapping = FieldMappings[formType];

    // Handle name field specially to split into first/last
    const nameValue = formData.get('name');
    if (nameValue) {
        const { firstname, lastname } = parseName(nameValue);
        fields.push({ name: 'firstname', value: firstname });
        if (lastname) {
            fields.push({ name: 'lastname', value: lastname });
        }
    }

    // Map remaining fields
    for (let [formField, hubspotField] of Object.entries(mapping)) {
        if (formField === 'name') continue; // Already handled

        const value = formData.get(formField);
        if (value && value.trim()) {
            fields.push({
                name: hubspotField,
                value: value.trim()
            });
        }
    }

    // Build the complete payload
    const payload = {
        fields: fields,
        context: {
            ...getPageContext(),
            ipAddress: '' // Left empty; HubSpot will detect automatically
        }
    };

    // Add HubSpot tracking cookie if available
    const hutk = getHubSpotCookie();
    if (hutk) {
        payload.context.hutk = hutk;
    }

    return payload;
}

/**
 * Submit form data to HubSpot Forms API
 * @param {FormData} formData - The form data to submit
 * @param {string} formType - Either 'contact' or 'quote'
 * @returns {Promise<object>} API response
 */
async function submitToHubSpot(formData, formType) {
    // Validate configuration
    if (HubSpotConfig.portalId === 'YOUR_PORTAL_ID') {
        console.warn('HubSpot integration not configured. Please set your Portal ID and Form IDs in js/hubspot.js');
        return { success: false, error: 'HubSpot not configured' };
    }

    const formId = HubSpotConfig.forms[formType];
    if (!formId || formId.includes('YOUR_')) {
        console.warn(`HubSpot form ID not configured for form type: ${formType}`);
        return { success: false, error: 'Form ID not configured' };
    }

    const url = `${HubSpotConfig.apiEndpoint}/${HubSpotConfig.portalId}/${formId}`;
    const payload = buildHubSpotPayload(formData, formType);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('HubSpot submission successful:', data);
            return { success: true, data: data };
        } else {
            const errorText = await response.text();
            console.error('HubSpot submission failed:', response.status, errorText);
            return { success: false, status: response.status, error: errorText };
        }
    } catch (error) {
        console.error('HubSpot submission error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Initialize HubSpot integration for all forms on the page
 * This function attaches event listeners to forms with data-hubspot attribute
 */
function initHubSpotForms() {
    // Find forms with HubSpot integration enabled
    const forms = document.querySelectorAll('form[data-hubspot]');

    forms.forEach(form => {
        const formType = form.dataset.hubspot; // 'contact' or 'quote'

        // Add listener that runs alongside existing form submission
        form.addEventListener('hubspot-submit', async (e) => {
            const formData = new FormData(form);
            const result = await submitToHubSpot(formData, formType);

            // Dispatch custom event with result for optional handling
            form.dispatchEvent(new CustomEvent('hubspot-complete', {
                detail: result
            }));
        });
    });

    console.log(`HubSpot integration initialized for ${forms.length} form(s)`);
}

// Export functions for use in main.js
window.HubSpot = {
    init: initHubSpotForms,
    submit: submitToHubSpot,
    config: HubSpotConfig
};

// Auto-initialize when DOM is ready (optional - can be called from main.js instead)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHubSpotForms);
} else {
    initHubSpotForms();
}
