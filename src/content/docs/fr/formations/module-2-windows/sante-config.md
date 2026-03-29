---
title: "Santé & Configuration Système"
description: "Diagnostique, nettoie et optimise ton système Windows avec les bons outils"
sidebar:
  label: "Santé système"
  order: 2
---

> Un système en bonne santé, c'est la fondation de tout le reste. Inutile d'installer des outils de productivité sur une machine qui rame.

## Diagnostiquer l'espace disque

Avant d'optimiser quoi que ce soit, tu dois savoir où part ton espace. Deux outils se distinguent pour ça.

### Outils d'analyse disque

| Outil | Type | Points forts |
|-------|------|-------------|
| **SpaceSniffer** | Treemap visuel | Vue instantanée des gros fichiers, navigation par zoom |
| **TreeSize Free** | Arborescence | Tri par taille, export, intégration menu contextuel |
| **WizTree** | Arborescence | Lecture MFT directe, ultra-rapide sur les disques NTFS |

**Conseil pratique** : lance SpaceSniffer sur ton disque C: en premier. Les blocs les plus gros sautent aux yeux immédiatement. Tu vas probablement découvrir des dossiers de cache ou des anciennes installations que tu avais oubliés.

### Le stockage, ce n'est pas seulement l'espace libre

Gérer ton stockage ne consiste pas seulement à "faire de la place". C'est aussi une question de continuité de travail, de sécurité, et de capacité à récupérer vite quand quelque chose casse.

Un poste mal géré côté stockage finit souvent par produire :
- des ralentissements inutiles
- des sauvegardes absentes ou incomplètes
- des fichiers dispersés dans trop d'endroits
- une reprise de travail chaotique après panne, vol, erreur humaine ou corruption

Autrement dit : si tu perds tes données, tu ne perds pas seulement des fichiers. Tu perds du temps, du contexte, de la confiance, parfois des semaines de travail.

### Sauvegarde : la discipline invisible qui sauve les vrais pros

La sauvegarde n'est pas un sujet "admin". C'est un sujet de productivité très concret.

Le minimum sérieux est de distinguer :
- **le stockage de travail** : ce que tu utilises au quotidien
- **la sauvegarde** : une copie récupérable si le premier support casse ou si tu fais une erreur

Une bonne logique de base :
- garder tes fichiers importants dans des emplacements clairs
- éviter de dépendre d'un seul disque ou d'un seul appareil
- avoir au moins une sauvegarde locale ou externe
- idéalement combiner sauvegarde locale et sauvegarde distante selon la sensibilité de tes données

Le vrai réflexe n'est pas "j'espère ne rien perdre". Le vrai réflexe est :
- si mon PC meurt aujourd'hui, combien de travail puis-je récupérer proprement demain ?

Si la réponse est floue, ton système n'est pas encore sûr.

## Optimiser ton DNS

Quand tu tapes une adresse dans ton navigateur, ton PC ne va pas directement "sur le site". Il commence par interroger un **serveur DNS** pour traduire un nom de domaine en adresse IP. En pratique, le DNS est donc un traducteur du web.

Le point important, c'est que le DNS n'est pas neutre. Un DNS lent, mal configuré, filtrant ou peu fiable peut donner l'impression que :
- le web rame
- certains sites mettent trop de temps à s'ouvrir
- un service fonctionne "mal" alors que le vrai problème vient surtout de la résolution DNS

Par défaut, ton PC utilise souvent le DNS de ton fournisseur d'accès. Ce n'est pas forcément dramatique, mais ce n'est pas toujours le meilleur choix en vitesse, en fiabilité ou en respect de la vie privée.

Changer de DNS, c'est gratuit et ça prend deux minutes.

### Les meilleurs DNS publics

| Fournisseur | Adresse primaire | Adresse secondaire | Atout principal |
|-------------|-----------------|--------------------|-----------------|
| **Cloudflare** | 1.1.1.1 | 1.0.0.1 | Rapidité |
| **Quad9** | 9.9.9.9 | 149.112.112.112 | Sécurité |
| **Google** | 8.8.8.8 | 8.8.4.4 | Fiabilité |

### Comment changer ton DNS

1. Ouvre **Paramètres > Réseau et Internet > Wi-Fi** (ou Ethernet)
2. Clique sur ton réseau, puis **Attribution du serveur DNS > Modifier**
3. Passe en **Manuel**, active **IPv4**
4. Entre les adresses du fournisseur choisi
5. Enregistre et teste avec un `nslookup google.com` dans le terminal

**Notre recommandation** : Cloudflare pour la vitesse brute, Quad9 si la sécurité est ta priorité.

La bonne lecture n'est pas : "changer de DNS va magiquement réparer internet".

La bonne lecture, c'est :
- un DNS peut être un petit goulet d'étranglement réel
- il peut aussi être un point de contrôle important
- et il est utile de vérifier ce point avant d'accuser Windows, ton navigateur ou une application cloud

Si tu viens de changer de DNS et que le comportement paraît incohérent, un `ipconfig /flushdns` peut aussi aider à purger le cache local.

### NextDNS : quand tu veux reprendre le contrôle du filtrage

Si tu veux aller plus loin qu'un simple DNS public, **NextDNS** est une option très intéressante. C'est un DNS configurable qui permet de bloquer :
- trackers
- pubs
- domaines malveillants
- certains sites ou catégories de sites selon tes propres règles

Son intérêt est qu'il agit plus largement qu'une simple extension navigateur. Tu peux nettoyer une partie du trafic au niveau système ou réseau, avec une logique plus fine.

Il faut juste bien comprendre son rôle :
- **Cloudflare** = vitesse
- **Quad9** = sécurité simple
- **NextDNS** = contrôle, filtrage, personnalisation

Pour un utilisateur avancé, NextDNS peut devenir une très bonne couche de base pour réduire le bruit numérique et certaines distractions avant même qu'elles arrivent jusqu'au navigateur.

### Où changer ton DNS : PC ou routeur ?

Tu peux changer ton DNS à deux niveaux :
- **sur le PC** : pratique pour tester ou pour personnaliser une seule machine
- **sur la box / le routeur** : utile si tu veux appliquer la même logique à tout ton réseau

Le bon choix dépend de ton objectif :
- test rapide ou besoin individuel : change le DNS sur le PC
- cohérence globale à la maison ou au bureau : change-le au niveau du routeur

## Gestionnaires de paquets

Installer des logiciels en téléchargement depuis des sites web, c'est du siècle dernier. Les gestionnaires de paquets automatisent l'installation, la mise à jour et la désinstallation.

Sur Windows, le bon réflexe moderne est de favoriser la ligne de commande. Installer tes outils par CLI te donne un système plus reproductible, plus rapide à reconstruire, et plus facile à documenter. Au lieu de cliquer sur dix sites différents, tu peux garder une liste claire de ce que tu installes et rejouer la même logique sur une autre machine.

### Winget d'abord, winstall ensuite

**winget** est le gestionnaire de paquets officiel de Microsoft. C'est lui qu'il faut privilégier.

Exemples :

```powershell
# Rechercher un paquet
winget search powertoys

# Installer un outil
winget install Microsoft.PowerToys

# Mettre à jour tous les paquets compatibles
winget upgrade --all
```

**winstall** est utile comme interface visuelle au-dessus de winget. Tu sélectionnes des applications dans le navigateur, puis l'outil te génère la commande `winget` correspondante ou un script `.bat` / `.ps1`. C'est donc un bon pont entre découverte visuelle et exécution en ligne de commande.

La bonne lecture de winstall n'est pas "je remplace la CLI". C'est :
- je parcours rapidement le catalogue `winget`
- je prépare une sélection propre
- puis je reviens à une logique de script ou de commande reproductible

Autrement dit, **winstall t'aide à préparer**, mais **winget reste la base sérieuse** de ton système.

### Quand utiliser le Microsoft Store

Le **Microsoft Store** n'est pas la méthode la plus puissante, mais il reste utile dans certains cas :
- pour les applications Microsoft ou très bien intégrées à Windows
- pour les utilisateurs qui veulent une installation propre sans chercher un installateur sur le web
- pour des mises à jour gérées de façon assez transparente sur certaines apps

La bonne hiérarchie, pour nous, est la suivante :
- **winget** si tu veux un système propre, documenté et rejouable
- **Microsoft Store** si tu veux une installation simple et officielle pour une application bien supportée
- téléchargement manuel seulement quand les deux options précédentes ne conviennent pas

Autrement dit : le Store n'est pas l'ennemi. Ce n'est juste pas le meilleur levier si ton objectif est de construire un setup vraiment reproductible.

### Chocolatey vs Scoop

| Critère | Chocolatey | Scoop |
|---------|-----------|-------|
| **Installation** | Nécessite admin | Fonctionne sans admin |
| **Catalogue** | ~10 000 paquets | ~5 000 paquets |
| **Philosophie** | Installe comme un `.exe` classique | Installe dans un dossier utilisateur |
| **Mises à jour** | `choco upgrade all` | `scoop update *` |
| **Idéal pour** | Logiciels desktop (Chrome, VS Code) | Outils CLI et dev |

**En pratique**, beaucoup de power users utilisent les deux : Chocolatey pour les gros logiciels, Scoop pour les outils en ligne de commande.

```powershell
# Installer Chocolatey (en admin)
Set-ExecutionPolicy Bypass -Scope Process -Force
irm https://community.chocolatey.org/install.ps1 | iex

# Installer Scoop (sans admin)
irm get.scoop.sh | iex
```

## Applications desktop vs SaaS : comprendre ce que tu contrôles

Toutes les applications ne vivent pas au même endroit, et cela change beaucoup de choses dans ton expérience de travail.

En simplifiant :
- une **application desktop** tourne principalement sur ta machine
- un **SaaS** tourne principalement dans le navigateur ou sur l'infrastructure d'un service distant

Une application desktop offre souvent :
- plus de contrôle local
- un meilleur accès aux fichiers, aux raccourcis et aux performances matérielles
- moins de dépendance à la connexion internet
- parfois une meilleure sensation de vitesse et de robustesse

Un SaaS offre souvent :
- accès depuis n'importe quel appareil
- synchronisation plus simple
- collaboration plus naturelle
- déploiement et mises à jour centralisés

Mais les compromis ne sont pas les mêmes.

Avec une application locale, tu gardes plus facilement la main sur :
- tes fichiers
- ton rythme de mise à jour
- certaines intégrations système
- une partie de ta vie privée et de ta résilience hors ligne

Avec un SaaS, tu gagnes en fluidité de partage, mais tu acceptes aussi davantage de dépendance :
- à la connexion
- au fournisseur
- à ses changements d'interface, de prix ou de politique
- à une logique plus abstraite de "ton outil vit chez quelqu'un d'autre"

Il n'y a pas de réponse unique. Le bon réflexe est de te demander :
- ai-je besoin de collaboration ou surtout de contrôle local ?
- ai-je besoin d'un accès partout ou d'un poste de travail robuste et maîtrisé ?
- si le service tombe ou change, que perds-je concrètement ?

Reprendre la main sur son environnement de travail, c'est aussi savoir pourquoi on choisit une app locale, un SaaS, ou un mélange des deux.

### Productivité et souveraineté numérique

Ce point est important : la productivité ne consiste pas seulement à aller vite. Elle consiste aussi à travailler avec des outils que tu comprends, que tu peux remplacer, et dont tu acceptes lucidement les dépendances.

Les suites dominantes comme Google Workspace ou Microsoft 365 gagnent souvent sur :
- la fluidité
- la collaboration
- l'intégration
- l'habitude

Mais elles te font aussi accepter certains compromis :
- tes données vivent dans un écosystème que tu ne contrôles pas vraiment
- les règles du jeu peuvent changer sans toi
- le confort peut masquer une dépendance forte à un fournisseur unique

À l'inverse, des outils plus souverains, plus privés, ou plus locaux te donnent parfois :
- plus de contrôle sur tes données
- un cadre juridique différent
- une meilleure résilience si tu veux éviter d'être entièrement captif d'un seul acteur

Le bon raisonnement n'est donc pas "Google est mauvais" ou "tout doit être auto-hébergé". Le bon raisonnement est :
- quel niveau de confort est-ce que je veux acheter avec ma dépendance ?
- quel niveau de contrôle est-ce que je veux préserver sur mon environnement de travail ?

Une petite alternative comme [Internxt](https://internxt.com/) peut être intéressante à connaître dans cette logique : non pas comme remplacement universel de Google, mais comme exemple d'outil cloud orienté confidentialité, contrôle et ancrage européen. L'idée à retenir n'est pas la marque. C'est le réflexe : ne pas confondre outil pratique et dépendance invisible.

## Portable ou installé : deux philosophies de logiciel

Beaucoup d'outils Windows existent en deux versions :
- **Installer**
- **Portable**

La différence n'est pas cosmétique. Elle change la façon dont l'application vit sur ton système.

Une version **installée** :
- s'intègre mieux à Windows
- crée souvent des raccourcis, des associations de fichiers, un désinstalleur
- stocke plus volontiers ses paramètres dans `AppData` ou dans des emplacements système
- est souvent plus naturelle pour un poste principal stable

Une version **portable** :
- peut être placée dans n'importe quel dossier ou sur une clé USB
- garde souvent ses fichiers de configuration à côté de l'exécutable
- modifie moins le système
- facilite les tests, le transport et certains usages plus propres ou plus temporaires

La bonne question n'est donc pas "quelle version est la meilleure ?", mais :
- est-ce que je veux une intégration profonde et confortable ?
- ou est-ce que je veux un outil plus autonome, plus déplaçable, plus facile à isoler ?

En pratique :
- **Installer** pour les outils que tu utilises tous les jours sur ton poste principal
- **Portable** pour tester, pour transporter, pour limiter l'empreinte système, ou pour garder des outils très maîtrisés dans un dossier dédié

Encore une fois, le sujet central est le contrôle. Plus tu comprends où vivent tes apps et leurs paramètres, plus ton poste devient reproductible et maîtrisé.

## Évaluer si ta machine est vraiment suffisante

Beaucoup de gens jugent un ordinateur avec des chiffres mal interprétés. Ils regardent uniquement les GHz, ou uniquement le nom du processeur, puis en tirent une conclusion trop rapide. En réalité, la bonne question n'est pas "ma machine est-elle puissante en théorie ?", mais **est-elle suffisante pour mon usage réel ?**

### Les composants qui changent vraiment ton expérience

Pour être productif, tu n'as pas besoin d'un monstre de benchmark. Tu as besoin d'une machine cohérente, réactive, et adaptée à ton vrai travail.

Voici les composants qui comptent vraiment et pourquoi.

#### Processeur (CPU)

Le processeur est le cerveau d'exécution de la machine. C'est lui qui encaisse une grande partie des calculs généraux :
- navigation lourde
- bureautique
- développement
- compression
- exports
- scripts
- multitâche

Un meilleur CPU aide surtout quand :
- tu ouvres beaucoup d'applications en même temps
- tu compiles, rends, exportes ou transformes beaucoup de données
- ton workflow demande des réponses rapides sous charge

Mais il faut éviter le piège des chiffres bruts : plus de GHz ne veut pas automatiquement dire meilleure machine. L'architecture, le nombre de cœurs, le comportement thermique et la génération comptent énormément.

#### Mémoire vive (RAM)

La RAM est l'espace de travail immédiat de ton système. Plus tu ouvres d'apps, d'onglets, de fichiers lourds ou de contextes différents, plus elle compte.

Quand tu manques de RAM :
- la machine swap plus souvent sur le disque
- tout paraît plus lent
- les bascules entre apps deviennent pénibles
- ton poste perd en fluidité mentale autant qu'en fluidité technique

Repères simples :
- **8 Go** : acceptable pour usage léger, mais vite limité
- **16 Go** : base confortable pour la plupart des gens
- **32 Go** : très utile pour multitâche sérieux, création, dev, ou outils lourds

#### Stockage : SSD avant tout

Le stockage ne sert pas seulement à "mettre des fichiers". Il influence directement la sensation de vitesse du poste.

Un **SSD** change énormément :
- démarrage plus rapide
- ouverture d'apps plus fluide
- recherches plus rapides
- moins de friction générale

À l'inverse, un vieux disque dur mécanique peut donner l'impression qu'un PC entier est mauvais alors qu'une partie du problème vient simplement du support de stockage.

Le bon réflexe en 2026 :
- SSD pour le système
- espace suffisant pour éviter de vivre en tension permanente
- logique claire de sauvegarde au lieu de stocker tout au hasard

#### Carte graphique (GPU)

Le GPU n'est pas indispensable à tout le monde. Pour beaucoup de workflows bureautiques ou admin, ce n'est pas le facteur principal.

En revanche, il devient important si tu fais :
- 3D
- montage vidéo
- rendu
- jeux
- IA locale
- certains usages créatifs accélérés

Le piège classique est de payer très cher un GPU qui ne servira presque jamais dans ton usage réel.

#### Chauffe, bruit et stabilité

Une machine "puissante" mais bruyante, brûlante ou instable peut être mauvaise pour la productivité.

Pourquoi :
- le bruit fatigue
- la chauffe réduit le confort
- le throttling réduit les performances réelles
- une machine instable casse la confiance et le flow

Il faut donc juger la puissance réelle, pas seulement la fiche technique.

#### Écran, clavier, autonomie : les faux secondaires

Ces éléments sont parfois traités comme des détails, alors qu'ils ont un impact quotidien énorme.

- un mauvais écran fatigue plus vite
- un clavier médiocre ajoute de la friction à chaque frappe
- une batterie faible ou un chargeur envahissant limite la mobilité

Autrement dit : la productivité ne dépend pas seulement des composants "nobles". Elle dépend aussi de l'ergonomie concrète de la machine.

Pour te faire une idée sérieuse, regarde surtout :
- **le processeur** : architecture, nombre de cœurs, comportement réel sur tes usages
- **la RAM** : 16 Go est souvent une base confortable ; 32 Go devient très utile si tu ouvres beaucoup d'outils lourds
- **le stockage** : un SSD change énormément le ressenti général
- **le GPU** : important surtout pour 3D, rendu, vidéo, IA locale, jeux, ou certains logiciels créatifs
- **la chauffe et le bruit** : une machine puissante sur le papier peut devenir médiocre si elle throttle vite

Le piège classique est de comparer des chiffres bruts sans contexte. Un CPU à 2,6 GHz n'est pas automatiquement meilleur qu'un autre à 1,6 GHz. L'architecture, les cœurs, les threads, la gestion thermique et le type de tâches comptent autant, sinon plus.

### Règle simple par profil

- **Bureautique / navigation / admin** : une machine récente avec SSD et 16 Go de RAM suffit souvent largement
- **Développement / multitâche sérieux** : vise un CPU correct, 16 à 32 Go de RAM, SSD confortable
- **Création lourde / 3D / vidéo / IA locale** : CPU plus solide, plus de RAM, et souvent un vrai GPU dédié

### Comment vérifier sans te raconter d'histoire

Le meilleur test reste l'usage :
- ton navigateur rame-t-il avec plusieurs onglets et apps ouvertes ?
- les exportations, compilations ou rendus sont-ils acceptables ?
- la machine chauffe-t-elle au point de dégrader ton confort ?
- est-ce la puissance qui te manque, ou surtout un système mal organisé ?

Des benchmarks peuvent aider à comparer, mais ils doivent rester secondaires. Ils servent à confirmer une intuition, pas à remplacer le ressenti d'usage.

## Cloud computer / cloud PC : quand ton poste de travail ne vit plus chez toi

Un **cloud computer** ou **cloud PC** est un ordinateur qui tourne à distance dans un datacenter, mais que tu utilises comme s'il était devant toi. Ton clavier, ta souris et ton écran restent chez toi ; la puissance de calcul, elle, tourne ailleurs.

C'est un concept beaucoup plus intéressant qu'il n'en a l'air, parce qu'il change la relation entre :
- ton matériel physique
- la puissance dont tu disposes
- l'endroit depuis lequel tu travailles
- la manière dont tu sécurises ou reproduis ton environnement

### Ce que ça change concrètement

Avec un poste dans le cloud, tu peux :
- accéder à un environnement Windows puissant depuis une machine faible
- retrouver le même setup depuis plusieurs lieux ou plusieurs appareils
- séparer plus clairement le terminal léger que tu transportes et la vraie machine de travail
- éviter certains achats de matériel immédiats si ton besoin est ponctuel ou variable

Autrement dit, tu ne possèdes plus seulement un ordinateur : tu accèdes à une **capacité de travail**.

### Les vrais avantages

- **Flexibilité** : tu peux travailler depuis un laptop modeste, une tablette, voire parfois un navigateur
- **Puissance à la demande** : utile pour 3D, rendu, vidéo, dev plus lourd, ou logiciels Windows spécifiques
- **Continuité** : ton environnement reste au même endroit même si ton appareil local change
- **Séparation claire** : ta machine locale devient un terminal d'accès, pas forcément ton environnement principal

Pour certains profils, c'est extrêmement libérateur. Tu peux voyager léger, garder une machine silencieuse, et continuer à accéder à un poste plus robuste.

### Les limites réelles

Mais il faut être lucide :
- tu dépends de ta connexion
- la latence compte, surtout pour certains usages interactifs
- les coûts mensuels peuvent s'accumuler
- certaines applications, certains périphériques ou certains workflows s'accommodent mal du distant
- tu externalises une partie du contrôle vers un fournisseur

Le cloud PC n'est donc pas "meilleur". C'est une autre architecture, avec d'autres compromis.

### Quand c'est une bonne idée

Le modèle devient particulièrement intéressant si :
- tu as besoin d'un Windows puissant sans acheter immédiatement une grosse machine
- tu veux accéder au même poste depuis plusieurs endroits
- tu as des besoins intermittents en puissance
- tu veux isoler certains workflows ou certains environnements

### Exemples actuels

- **Shadow** : approche grand public, très orientée "vrai PC Windows dans le cloud"
- **Windows 365** : vision Microsoft du poste de travail cloud, plus orientée entreprise
- **Amazon WorkSpaces** : infrastructure de bureau distant gérée, plutôt pro
- **Vagon** : intéressant pour du streaming applicatif et des usages créatifs/visuels

Le bon réflexe est de ne pas regarder seulement la fiche marketing. Demande-toi toujours :
- où vit réellement la machine ?
- qui contrôle les données ?
- que se passe-t-il si la connexion devient mauvaise ?
- est-ce que le gain de flexibilité compense la dépendance supplémentaire ?

### Puter : une version encore plus légère

**Puter** pousse l'idée plus loin côté navigateur : un environnement de bureau accessible depuis le web. Ce n'est pas l'équivalent d'un vrai cloud PC robuste, mais c'est intéressant comme poste de secours, comme démonstration du concept, ou comme environnement léger toujours disponible.

Garde-le dans un coin de ta tête comme solution de continuité ou d'urgence, pas comme remplacement complet de ton poste principal.

## Vérifier Windows Update régulièrement

La maintenance d'un poste Windows ne consiste pas seulement à installer de bons outils. Elle consiste aussi à éviter que le système dérive trop longtemps sans correctifs. Beaucoup de problèmes de stabilité, de compatibilité ou de sécurité viennent simplement d'un système laissé trop longtemps sans mises à jour.

Le bon réflexe est simple :
- ouvre **Paramètres > Windows Update**
- clique sur **Rechercher des mises à jour**
- installe les correctifs de sécurité importants sans trop attendre
- planifie les redémarrages au lieu de les subir

L'objectif n'est pas d'être obsédé par chaque update mineure. L'objectif est d'éviter deux pièges :
- un poste qui accumule du retard et devient plus fragile
- une grosse vague de mises à jour subie au pire moment

Un système à jour ne te rend pas plus productif par magie. En revanche, il réduit beaucoup de frictions invisibles :
- bugs déjà corrigés ailleurs
- problèmes de pilotes ou de compatibilité
- failles de sécurité évitables
- comportements étranges que tu finis par normaliser alors qu'ils viennent juste d'un poste mal entretenu

Comme souvent, la bonne stratégie n'est pas la perfection. C'est l'entretien régulier.

### Pour aller plus loin

- [**IsMyTouchScreenOK**](https://www.softwareok.com/?seite=Microsoft/IsMyTouchScreenOK) : petit utilitaire utile si tu veux tester rapidement un écran tactile, vérifier des points tactiles défectueux, ou contrôler un appareil pendant sa période de garantie.
- [**KeepMouseSpeedOK**](https://www.softwareok.com/?seite=Microsoft/KeepMouseSpeedOK) : utile si tu veux garder une vitesse de pointeur stable et éviter certains changements de sensation liés au système ou à des contextes particuliers.
- [**AutoPowerOptionsOK**](https://www.softwareok.com/?seite=Microsoft/AutoPowerOptionsOK/Screenshot-0) : petit outil intéressant si tu veux ajuster plus finement certains comportements d'alimentation et éviter des réglages d'énergie trop rigides selon tes usages.
- [**GetPixelColor**](https://www.softwareok.com/?seite=Microsoft/GetPixelColor) : pratique si tu as parfois besoin de relever rapidement une couleur exacte à l'écran pour du design, de l'UI ou du repérage visuel.
- [**DontSleep**](https://www.softwareok.com/?seite=Microsoft/DontSleep) : très utile pour empêcher temporairement la mise en veille, l'hibernation ou l'arrêt automatique pendant un téléchargement, un export, un rendu ou une session distante.
- [**DirPrintOK**](https://www.softwareok.com/?seite=Freeware/DirPrintOK) : peut dépanner si tu dois exporter ou imprimer rapidement le contenu d'un dossier pour un inventaire, un archivage ou un partage administratif.

## Effacement sécurisé : quand supprimer ne suffit pas

Supprimer un fichier puis vider la corbeille ne garantit pas toujours qu'il soit vraiment difficile à récupérer. Pour la plupart des usages quotidiens, ce n'est pas un drame. En revanche, si tu manipules des documents sensibles, des exports clients, des scans d'identité, des fichiers financiers ou des archives temporaires contenant des données privées, il devient utile de distinguer :
- **supprimer pour faire de la place**
- **supprimer pour réduire le risque de récupération**

### [Blank And Secure](https://www.softwareok.com/?seite=Microsoft/BlankAndSecure)

Blank And Secure est un petit outil portable conçu pour cet usage précis. Son intérêt n'est pas de remplacer ton explorateur de fichiers tous les jours, mais d'offrir une suppression plus prudente quand tu veux effacer un fichier ou un lot de fichiers avec une intention de confidentialité plus forte.

Le bon cadre mental est :
- ce n'est pas un outil de ménage général
- c'est un outil de **gestion de fichiers sensibles**
- il a du sens pour certains cas ciblés, pas pour l'ensemble du disque

Point important : sur les SSD modernes, l'effacement sécurisé est un sujet plus nuancé que sur les anciens disques mécaniques. Donc le réflexe premium n'est pas "j'écrase tout en boucle". Le vrai réflexe est plutôt :
- identifier quels fichiers méritent plus de prudence
- éviter de les laisser traîner inutilement
- comprendre que la sécurité dépend aussi du chiffrement, du stockage et de l'organisation générale du poste

Autrement dit, Blank And Secure peut être utile, mais il doit rester un **outil ciblé**, pas un rituel aveugle.

## Évaluer la sécurité de ton poste

Prends cinq minutes pour vérifier ces points :

- **Windows Update** : tout est à jour ? Les mises à jour de sécurité sont non négociables.
- **Antivirus** : Windows Defender suffit largement. Désinstalle les antivirus tiers qui ralentissent ta machine.
- **Pare-feu** : activé et configuré. Vérifie dans Paramètres > Confidentialité et sécurité.
- **Comptes** : désactive le compte admin par défaut, utilise un compte standard au quotidien.

## Checklist santé système

- [ ] Analyser l'espace disque et supprimer les fichiers inutiles
- [ ] Configurer un DNS rapide et sécurisé
- [ ] Installer un gestionnaire de paquets
- [ ] Vérifier les mises à jour Windows
- [ ] Désinstaller les logiciels inutiles préinstallés (bloatware)

## Ressources officielles

- [SpaceSniffer](http://www.uderzo.it/main_products/space_sniffer/) - l'analyse disque en treemap.
- [TreeSize Free](https://www.jam-software.com/treesize_free) - l'arborescence claire pour identifier les gros dossiers.
- [WizTree](https://www.diskanalyzer.com/) - l'analyse ultra-rapide des volumes NTFS.
- [NextDNS](https://nextdns.io/) - le DNS filtrant configurable.
- [Cloudflare DNS](https://developers.cloudflare.com/1.1.1.1/) - l'option rapide et simple.
- [Quad9](https://quad9.net/) - l'option orientée sécurité.
- [winstall](https://winstall.app/) - l'interface visuelle pour préparer des commandes ou scripts `winget`.
- [Blank And Secure](https://www.softwareok.com/?seite=Microsoft/BlankAndSecure) - l'outil de suppression prudente pour les fichiers sensibles.
