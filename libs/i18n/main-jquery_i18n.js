jQuery(document).ready(function() {
    var update_texts = function() {
        $('body').i18n();
    };

    $.i18n().load({
        'en': {
            'menu1': 'Open a skin...',
            'username': 'from an username',
            'url': 'from an URL',

            'menu2': 'Save/apply a skin...',
            'png': 'in .png format',
            'net': 'on Minecraft.net',
            'pe': 'on Minecraft PE',

            'about': 'About',

            'cancel': 'Cancel',
            'ok': 'OK',

            'modal1': 'Type in a Minecraft username to open it’s skin:',
            'modal2': 'Type in the full web address to a skin image:',
            'modal3-1': 'Type the web address below:',
            'modal3-2': 'Or scan the QR code, on your mobile device with Minecraft Pocket Edition.',
            'modal4-1': 'Minecraft SkinViewer is a Minecraft skins viewer.',
            'modal4-2': 'You can open a skin from an external link (for example, a direct link to the skin image), or from a Minecraft user.',
            'modal4-3': 'This tool also offers you the possibility to download the displayed skin, apply it to Minecraft.net or apply it to Minecraft Pocket Edition using a QR Code or a web address.',
            'modal4-4': 'Minecraft SkinViewer is a project originally developed by Corbin Davenport and now maintained by Atnode.',
            'modal4-5': 'View the Minecraft SkinViewer Git Repository',

            'js1': 'Skin loaded!',
            'warning': 'Warning',
            'js2': 'Minecraft SkinViewer cannot check if the skin is valid when opened from a URL.',
            'js3': 'This appears to be a skin designed for Minecraft 1.7 and below. It will load fine in Minecraft 1.8 and up, but may look weird on Minecraft Pocket Edition.',
            'js4': 'Minecraft SkinViewer cannot check if the skin is valid when opened from a URL. Judging from the size, this skin appears to be designed for Minecraft 1.7 and below. It will load fine in Minecraft 1.8 and up, but may look weird on Minecraft Pocket Edition.',
            'hum': 'Hum...',
            'js5': 'This does not appear to be a valid skin file.',
            'js6': 'There was an error loading the skin :(',
            'js7-1': 'Invalid username',
            'js7-2': 'Minecraft usernames cannot contain spaces or be blank.',
            'js8-1': 'Invalid URL',
            'js8-2': 'URLs cannot contain spaces or be blank.',

            'js-skinfirst': 'Open a skin first!',
			
			'default': 'Default',
			'nicetodraw': 'Nice to draw',
			'walk': 'Walk',
			'walk2': 'Walk 2',
			'hug': 'Hug',
			'Jump': 'Jump',
			'lookup': 'Look up',
			'random': 'Random'
        },
        'fr': {
            'menu1': 'Ouvrir un skin...',
            'username': 'à partir d’un pseudo',
            'url': 'à partir d’une URL',

            'menu2': 'Sauvegarder/appliquer un skin...',
            'png': 'au format .png',
            'net': 'sur Minecraft.net',
            'pe': 'sur Minecraft PE',

            'about': 'À propos',

            'cancel': 'Annuler',
            'ok': 'OK',

            'modal1': 'Entrez un pseudo d’utilisateur de Minecraft pour ouvrir son skin :',
            'modal2': 'Entrez une URL complète d’un skin :',
            'modal3-1': 'Tapez l’adresse web ci-dessous :',
            'modal3-2': 'Ou scannez le QR code sur votre appareil mobile avec Minecraft Pocket Edition.',
            'modal4-1': 'Minecraft SkinViewer est une visionneuse de skins Minecraft.',
            'modal4-2': 'Vous pouvez ouvrir un skin à partir d’une adresse web (par exemple, un lien direct vers l’image d’un skin) ou à partir d’un pseudo d’utilisateur de Minecraft.',
            'modal4-3': 'Cet outil vous offre également la possibilité de télécharger le skin affiché, de l’appliquer à Minecraft.net ou de l’appliquer à Minecraft Pocket Edition en utilisant un QR Code ou une adresse web.',
            'modal4-4': 'Minecraft SkinViewer est un projet initialement développé par Corbin Davenport et désormais maintenu par Atnode.',
            'modal4-5': 'Voir le dépôt Git de Minecraft SkinViewer',

            'js1': 'Chargement du skin réussi !',
            'warning': 'Attention',
            'js2': 'Minecraft SkinViewer ne peut pas vérifier si le skin est valide lorsqu’il est ouvert à partir d’une URL.',
            'js3': 'Cela semble être un skin conçu pour Minecraft 1.7 et antérieur. Il sera chargé correctement dans Minecraft 1.8 et plus, mais peut sembler étrange dans Minecraft Pocket Edition.',
            'js4': 'Minecraft SkinViewer ne peut pas vérifier si le skin est valide lorsqu’il est ouvert à partir d’une URL. À en juger par la taille, cela semble être un skin conçu pour Minecraft 1.7 et antérieur. Il sera chargé correctement dans Minecraft 1.8 et plus, mais peut sembler étrange dans Minecraft Pocket Edition.',
            'hum': 'Hum...',
            'js5': 'Cela ne semble pas être un fichier de skin valide.',
            'js6': 'Une erreur c’est produite lors du chargement du skin :(',
            'js7-1': 'Pseudo invalide',
            'js7-2': 'Les noms d’utilisateur Minecraft ne peuvent pas contenir d’espaces ou être vierges.',
            'js8-1': 'URL invalide',
            'js8-2': 'Les URLs ne peuvent pas contenir d’espaces ou être vierges.',
			
			'js-skinfirst': 'Vous devez ouvrir un skin en premier !',

			'default': 'Défaut',
			'nicetodraw': 'Facile à dessiner',
			'walk': 'Marche',
			'walk2': 'Marche 2',
			'hug': 'Câlin',
			'jump': 'Saut',
			'lookup': 'Lever les yeux',
			'random': 'Aléatoire'
        }
    })

    update_texts();
});