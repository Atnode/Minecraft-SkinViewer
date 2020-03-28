jQuery(document).ready(function() {
    var update_texts = function() {
        $('body').i18n();
    };

    $.i18n().load({
        'en': { 'en.json' },
        'fr': { 'fr.json' }
    })

    update_texts();
});