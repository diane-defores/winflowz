---
tags: Rédaction
u_interne: ""
u_externe: ""
datePublié: ""
imageNameKey: ""
_priorité: ""
---

## ✅ MIGRÉ → module-2-windows/ergonomie.md
- (Explorateurs de fichiers alternatifs : Files, Directory Opus, One Commander, Total Commander)
- (CopyQ : gestionnaire de presse-papiers open-source avec historique illimité)
- (Bureaux virtuels Windows : organisation recommandée en 4 bureaux, raccourcis Win+Ctrl)
- (Organisation des fenêtres : Snap Layouts Win+Z, raccourcis natifs snap/maximiser/minimiser)
- (Barre des tâches et menu Démarrer : désencombrer, désactiver widgets/Bing)
- (Gestion applications au démarrage via Gestionnaire des tâches)
- (AutoDarkMode : bascule auto thème clair/sombre)
- (f.lux : réduction lumière bleue le soir)
- (Jiffy Reader : lecture bionique pour lire plus vite)
- (WinXCorners : hot corners façon macOS sur Windows)

## 🔶 À TRIER


### **Make it work without you**

- Automatically [Launch any program on startup](https://www.notion.so/d41c03044aec4550a1fe0bcb1195c258?pvs=21)
- [Use Macros](https://www.notion.so/48eb405fc4f44ff68874975a03cc9b0c?pvs=21)

### **Make it easy to manipulate 🗺**

- Replace the old Windows files explorer 🏷

- [Manage files better](https://www.notion.so/aef87435376a4c01b9fbab20592c12e1?pvs=21) and be sure to [Find better](https://www.notion.so/a1737a5adde340bdb62b996315ff933e?pvs=21)

- Microsoft PowerToys

- Use shortcuts [Windows 10 keyboard shortcuts & hotkeys](https://www.notion.so/7c71399aa3c94bf28ef7f6e0503af532?pvs=21) to fastly switch apps context

- You can use [Use multiple virtual Desktops in Windows 10](https://www.notion.so/9156255ff52f44a9b75cb6b13262b7af?pvs=21) 🌌

- You can launch programs from Windows and also search files with Alt + Space, copy folder path, launch as administrator

    - You can have many concurrent desktops
    - Before we had [Dexpot](https://dexpot.de/?lang=en), and now [Windows natively support concurrent desktops](https://www.cnet.com/tech/services-and-software/how-to-use-multiple-desktops-in-windows-10/).


- [Preme for Windows](https://www.notion.so/6a389a291a2e4d108284d49ab8e96e72?pvs=21) is a small app I love and use everyday for 3 features : controling volume with mouse scrolling on Windows Taskbar, and expanding and minimizing a windows by scrolling on its navbar. But it has some other great time-saving features. The last version is from 2017. I haven't found any bug but I guess it's not a great practice to use such an old release, if you know about something similar, I'm eager to know !

### **Organize it : Find your best way to manage those windows 🚩**

### **Find the perfect clipboard 🏷**

### **Make it beautiful and relaxing**

- [Simplify & clean](https://www.notion.so/856bd82fbf6c4f2c89c113d8d1d1ae54?pvs=21) your experience
- Automatically switches between the dark and light theme of Windows 10 with [AutoDarkMode](https://www.notion.so/10a4c2f33938497ab589a5cc70f5150c?pvs=21)
- [f.lux: software to make your life better](https://www.notion.so/6c5788f1a502496b9e5e8e09c4e7a227?pvs=21) adapts the luminescence of your screen thoughout the day

### **Troubleshoot**

- window management

## Switching apps
### Native task views
Task view is included as a button on the taskbar. To use it just press the Win+Tab combination and the open windows will be shown with a timescale. You can remove it in the settings of the taskbar.
### WinXCorners
## Taskbar

18. Open Task Manager from Taskbar
----------

In Windows 10, you would right-click on the taskbar and open Task Manager from the menu. This feature has been removed in Windows 11. However, you can still open Task Manager from the taskbar in Windows 11.

1. To do so, right-click on the Start Menu icon and select "Task Manager."
2. You can also open other utilities like Device Manager, Power options, Shutdown, and more from this menu.

**Also read:**[10 Ways to Open the Task Manager in Windows](https://www.maketecheasier.com/open-task-manager-windows/)

19. Open Last Active Window from Taskbar
----------

When you open multiple instances of the same app, they are grouped together under one icon in Taskbar. You need to hover the mouse over the app icon to select the window to open. An easy way is to directly launch the last active window by clicking the app icon.

To do so, you need to make some Registry changes as shown below. However, please [back up your registry](https://www.maketecheasier.com/backup-restore-windows-registry/) before following these steps:

1. Open Windows Search and type `regedit`.

1. In the "Registry Editor," type or copy and paste the following address into the address bar:

```
HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced
```

1. Right-click in an empty space on the right panel and select "New→ DWORD (32-bit) Value."

1. Name it "LastActiveClick."

1. Right-click on the LastActiveClick item and select "Modify" from the menu. A pop-up window will appear.
2. Change the "Value data" to "1" and click 'OK."

1. Restart your PC.

20. Show Seconds in Windows 11 Clock
----------

Unlike Windows 10 where you could [show seconds on the Windows 10 Taskbar clock](https://www.maketecheasier.com/show-seconds-in-windows-clock/) using Registry, the same method won't work in Windows 11. However, you can use a third-party app called [ElevenClock ](https://github.com/martinet101/ElevenClock)to show seconds in the system clock on Windows 11.

21. Ungroup Folders or Apps in Taskbar in Windows 11
----------

Earlier, every instance of an app or folder appeared separately in the taskbar. Now, all items from the same app are grouped. Unfortunately, you cannot ungroup them directly in Windows 11. You will have to install [Explorer Patch](https://github.com/valinet/ExplorerPatcher) to achieve this. Do read the instructions on the Github page to install or uninstall the patch.

1. Run the newly installed app.
2. Right-click on your taskbar and select "Properties."

1. The Properties window will open. Go to the Taskbar section from the left sidebar. Click on "Combine Taskbar icons on Main taskbar" and select "Never combine."

1. Restart your PC. This app will also allow you to make taskbar icons smaller.

**Also read:**[How to Get Classic Volume Mixer Back in Windows 11](https://www.maketecheasier.com/classic-volume-mixer-windows/)

22. Add Old Volume Mixer to Taskbar
----------

With Windows 11, Microsoft has revamped the Sound shortcuts in the taskbar. you can no longer access Volume Mixer directly from the taskbar. But if you are a fan of the classic Volume Mixer, you can pin it to the taskbar and access it quickly from there.

To do so, follow these steps:

1. Use Win + R to open Run on your computer. Type `sndvol.exe` and press Enter.

1. The classic Volume Mixer will open. Right-click on its icon in the taskbar and select "Pin to taskbar."

23. Make Taskbar Icons Smaller in Windows 11
----------

By changing registry values, you can change the size of the taskbar as shown below:

1. Use Win + R to open the Run window. Type `Regedit` and press the Enter key.
2. Type or copy and paste the following address into the address bar:

```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
```

1. Right-click in the right panel and select "New→ DWORD (32-bit) Value."

1. A new entry will be created. Rename it "TaskbarSi.'
2. Double-click on the newly-created TaskbarSi and enter '0″ under "Value data," where 0 means smallest. You can also enter "2," which means the largest with "1" meaning default. Click "OK" to save.

1. Restart your PC.

**Tip**: The Windows 10 taskbar could be easily customized with TaskbarX, a third-party utility. You can use its successor [TaskbarXI ](https://github.com/ChrisAnd1998/TaskbarXI/releases)on Windows 11 to make taskbar icons smaller and change other properties.

24. View Additional Calendars and Clocks
----------

When you click on the date and time in the taskbar, it shows the calendar and notification panel. You can add additional calendars and clocks to this area.

1. To do so, go to "Windows Settings → Time & language → Date & time."
2. Click on the drop-down box next to "Show additional calendars in the taskbar' and select the desired calendar.
3. Similarly, scroll down and click on "Additional clocks." Select the additional timezones to show.


### 1. How can I lock or unlock the taskbar in Windows 11? ###

In Windows 11, the taskbar is locked by default. Unfortunately, you cannot unlock it.

### 2. What is the chat icon on the taskbar? ###

The chat icon is associated with the Microsoft Teams app, which comes preinstalled on Windows 11. You can message contacts quickly, create a new meeting or start a conversation right from the taskbar.

Mehvish is a tech lover from Kashmir. With a degree in computer engineering, she's always been happy to help anyone who finds technology challenging. She's been writing about technology for over six years, and her favorite topics include how-to guides, explainers, tips and tricks for Android, iOS/iPadOS, Windows, social media, and web apps.
**Also read:** [24 of the Best Tips to Use and Customize Windows 11 Taskbar](/ "24 of the Best Tips to Use and Customize Windows 11 Taskbar")


## Clear Taskbar, Start Menu, Programs Clutter

After installing Windows 11, you'll likely find some extra apps listed in your Start menu and on your taskbar. If you'd prefer not to have all the clutter, you can get rid of anything you don't need, such as recommended apps and app icons.

For your taskbar, go to "Settings -> Personalization -> Taskbar."

From here, you can toggle Search, Widgets, and Task View on and off. For other icons, right-click the icon and choose "Unpin from taskbar." You can add any open apps to your taskbar the same way. Right-click and choose "Pin to taskbar."

For Start menu items, right-click an app and choose "Unpin from Start." You can also search for apps and choose "Pin to Start" from the Search feature. You may also want to get rid of the "Recommended" section. However, removing this section won't give you extra space – it just leaves a blank area in the Start menu – but it does look nicer.


To remove recommended apps and documents from the Start menu, open "Settings -> Personalization -> Start."

Toggle the items to off that you don't want to appear on the Start menu. You can also customize which folders show next to the "Power" button.
### Remove all programs you won't need
Like Xbox
## Desktop

[GitHub - RamonUnch/AltSnap: Maintained continuation of Stefan Sundin's AltDrag](https://github.com/RamonUnch/AltSnap?tab=readme-ov-file)
	**Léger**, disponible **gratuitement**, **en français** et **ne nécessitant même pas d'installation** (application portable), _AltSnap_ est **un utilitaire permettant de gérer plus facilement vos fenêtres sur votre ordinateur**.
	Habituellement, pour déplacer une fenêtre ou la redimensionner, vous devez cliquer sur sa barre de titre. Avec _AltSnap_, il suffit d'appuyer sur la touche **Alt** de votre clavier et d'effectuer un clic gauche pour **la déplacer**, un clic droit pour **la redimensionner**, un clic sur le bouton central de la souris pour **afficher son menu d'actions** (toujours afficher au-dessus, minimiser, maximiser, centrer, etc.), faire défiler la molette pour **modifier sa transparence**, etc.
	Pour les plus exigeants, de nombreux paramètres personnalisables et d'autres fonctionnalités sont disponibles dans les paramètres d'_AltSnap_.
	Par défaut en anglais, _AltSnap_ est également disponible **en français**. Pour cela, après avoir exécuté _AltSnap_, cliquez avec le bouton droit de la souris sur son icône dans la zone de notification de la barre des tâches, à côté de l'horloge. Sélectionnez alors la commande **Configure**. Dans l'onglet **General**, déroulez la liste **Language** et sélectionnez **Français**. Cliquez enfin sur le bouton **Apply**.
[TidyTabs Window Manager: give every program a tabbed user interface](https://www.nurgo-software.com/products/tidytabs)
	Disponible **gratuitement** pour une utilisation personnelle, TidyTabs est un **utilitaire permettant de révolutionner la gestion de vos fenêtres sur votre ordinateur, pour gagner en efficacité**.
	Fini le temps de passer par la barre des tâches pour passer d'une application ouverte à une autre, ou avec le raccourci clavier **Alt** + **Tab**. En effet, TidyTabs ajoute **un onglet à vos fenêtres**, et vous pouvez regrouper différents programmes ouverts dans une seule et même fenêtre. **Vous passez ainsi d'un programme à l'autre, via un simple onglet**, comme dans votre navigateur Web.
	A noter que dans cette version gratuite de TidyTabs, vous pouvez regrouper **jusqu'à 3 programmes (onglets) dans une même fenêtre**. Pour en avoir plus, vous devrez vous tourner vers la version payante de ce logiciel, mais qui reste à un prix abordable.
	Après l'installation de TidyTabs, l'onglet s'affiche en passant la souris en haut à gauche de la fenêtre. Vous pouvez glisser/déposer un onglet d'une autre fenêtre pour les regrouper, ou à l'inverse les dissocier, comme le montre cette animation :
	![](https://images.pcastuces.com/logitheque/zoom/tidytabs.gif)
[AquaSnap Window Manager: dock, snap, tile, organize](https://www.nurgo-software.com/products/aquasnap)
	- AquaSnap est un outil de bureau qui permet de redimensionner automatiquement les fenêtres en les faisant glisser vers les côtés ou les coins de l'écran.
	- Il offre des fonctionnalités similaires à Aero Snap de Windows 10, permettant de diviser l'écran en moitiés ou en quarts.
	- AquaSnap permet également d'aligner facilement les fenêtres, de maximiser rapidement une fenêtre en double-cliquant sur son bord, et d'ajouter des fonctionnalités supplémentaires aux cadres de fenêtres.
	- Il est compatible avec plusieurs langues et versions de Windows, offrant une optimisation native et une facilité d'utilisation.
[FontViewOK 8.41 A quick visual overview of all installed font](https://www.softwareok.com/?seite=Freeware/FontViewOK)
	## Only the written form is remembered, but the font name is forgotten. Here FontViewOK can help, to find the font name again. Font-View-OK, creates a quick visual overview of all installed fonts, or fonts from a certain folder and helps to compare the font.




## Screen

[Port of macOS Mojave Dynamic Desktop feature to Windows 10](https://github.com/t1m0thyj/WinDynamicDesktop)
Disponible **gratuitement**, **en français** et **ne nécessitant même pas d'installation** (application portable), _WinDynamicDesktop_ est **un logiciel permettant de faire évoluer votre fond d'écran en fonction de l'heure**.

Concrètement, _WinDynamicDesktop_ affiche sur votre Bureau un sublime fond d'écran changeant au gré des heures, comme si vous contempliez ce paysage de vos propres yeux devant une fenêtre pendant 24 heures. Vous visualisez ainsi ce paysage au lever du soleil, puis en pleine journée, au coucher du soleil et la nuit.

A noter que _WinDynamicDesktop_ utilise votre géolocalisation pour déterminer les heures de lever/coucher du soleil du jour mais vous pouvez également les définir manuellement.

Se logeant dans la zone de notification de la barre des tâches à côté de l'horloge, _WinDynamicDesktop_ propose par défaut une quinzaine de fonds d'écran et plus de trois cents sont disponibles [en ligne](https://windd.info/themes/free.html).
## Widgets
Windows 11 intègre une fonction Widgets qui permet d'afficher un panneau présentant diverses tuiles adaptées à vos centres d'intérêts : météo, actualités, sport, etc. Ce panneau peut être affiché avec le raccourci clavier Windows + W ou via une icône présente dans la barre des tâches. Vous pouvez retirer l'icône en suivant [cette astuce](https://www.pcastuces.com/pratique/astuces/6438.htm). Mais la fonction Widgets reste alors présente dans Windows. Voici comment la désinstaller totalement.

1. Cliquez avec le bouton droit de la souris sur le bouton **Démarrer**.
2. Dans le menu qui s'affiche, cliquez sur **Terminal (administrateur)**.
3. Saisissez alors la commande suivante et validez par la touche **Entrée**.
    > Get-AppxPackage *WebExperience* | Remove-AppxPackage
4. Les Widgets sont alors désinstallés de Windows.
5. Si un jour vous souhaitez les réinstaller, utilisez la commande suivante. Validez par la touche **Entrée** puis confirmez 2 fois par **Y** pour terminer l'installation.
    > winget install --id 9MSSGKG348SP
## StartUp and Shutdown
[Alternate Shutdown](https://www.alternate-tools.com/pages/c_shutdown.php?lang=GER)
	This program offers the ability to shut down a computer either after a certain amount of time or on a specific date.
	It additionally provides the option to restart the computer after a shutdown or put the computer to sleep. Furthermore, it is possible to force the shutdown, whereby open programs are closed even if they do not respond.
	The program can also be displayed as a tray icon and thus does not take up space on the taskbar if the shutdown is to take place after a longer period of time. It requires the . NET Framework 2.0 (included in the operating system from Windows Vista onwards).




## windosq
[Window Resizer for PC | Resizes Windows apps](https://vovsoft.com/software/window-resizer/)
- 🔍 Programme utilitaire Windows Resizer pour redimensionner n'importe quelle fenêtre à une taille précise
- 🖥️ Utile pour la conception de pages web
- 📏 Redimensionner les applications Windows à n'importe quelle dimension
- 🤖 Logiciel utilitaire pour redimensionner les programmes en identifiant le titre de la fenêtre
- 📷 Prendre une capture d'écran d'une fenêtre avec Window Resizer


## read better
# **Read faster**

# **Reading at 1.5x speed**

A new #lifehack has been making the rounds on the interwebs recently. You might've _read_ it, too. It's selectively bolding certain parts of the beginning of words to be able to read faster. It looks funny, **some**thing **ki**nd **o**f **li**ke **th**is, but it seems to work.

The science behind it? Turns out the bottleneck while reading is our eyes and not our brain. Reading this way helps our brain "autocomplete" the rest of the word after only seeing the first few characters, speeding up the process.

That's how [Jiffy Reader](https://www.producthunt.com/posts/jiffy-reader) was born. Jiffy is an open-source browser extension that applies that technique when you're browsing articles. _"The way that Jiffy Reader works is by taking a certain part of every or some of the words and changing the font weight. For example, in our default settings, we take the first half of every word and make it bolder. This allows for a more seamless reading experience,"_ the makers shared.

Tools like these ([Bionic Reading](https://www.producthunt.com/posts/bionic-reading/) was one of the first to draw buzz) work by guiding your eyes over the page using fixation points. This encourages a smoother reading experience while maintaining comprehension of the words.

- If you don't want or don't have time to read/listen to entire books, there are service that summarize the best books for you :
    - [Blinkist: Big ideas in small packages](https://www.notion.so/2e69cd0ef1734d5bacaea8b71dbe4ccc?pvs=21)
    - [Shortform – The World's Best Book Summaries](https://www.shortform.com/?utm_source=lucy&utm_medium=partner)
    - [Optimize <- It's now FREE !](https://www.optimize.me/?trackID=ccd32654-1723-4724-91b0-1fc5d05aab0a)
    - [Optimize.me](http://optimize.me/) is a collection of PhilosophersNotes on the best books along with an Optimal Living 101 class that distills the absolute best ideas—giving you more wisdom in less time to help you live your greatest life.
    - It's like Blinkist but more in depth. They also have many nice reviews on the mobile app store.
- [genei | AI-powered summarisation & research tool](https://www.notion.so/4f5d5c08ada5425d8b7f474f818ec146?pvs=21)

# **Read for you!**

- [Narro](https://www.notion.so/d25c1c8c9d874439a098a174fc1c6ca4?pvs=21)
- [https://read2me.online/?ref=producthunt](https://read2me.online/?ref=producthunt)
- [https://intelligent-speaker.com/](https://intelligent-speaker.com/)
- [Natural Reader Text to Speech](https://www.notion.so/4e0fd2ec21bd4bc49aa9a2e28082bafc?pvs=21)
- [LSD Software](https://www.notion.so/3ae73bbb2aaa4a60ab50f5da1dbccbe2?pvs=21)
- [Wavenet for Chrome](https://www.notion.so/1538223a0f8e4baea1326af764bcc759?pvs=21)
- [elocance | save and listen to emails, documents and articles on the go](https://www.notion.so/219ea88104824333ba89a47d96e6a627?pvs=21)

# **Read on the computer**

- If your Adobe reader croaks or feels glitchy while scrolling, try [Sumatra PDF](https://www.notion.so/d513d1e3f4ea4ba2a37f2fc669713b4b?pvs=21) instead. It's so lightweight you'll fly. Plus you can easily highlight text.
- [Google Dictionary (by Google)](https://www.notion.so/2cbb575ad30d4935917aa3085b69858d?pvs=21) Have you ever come across a word you're not familiar with while doing research online? Instead of Googling it in a separate tab, quickly highlight the word and click on the Google Dictionary extension to get the definition.
- [Mercury Reader](https://chrome.google.com/webstore/detail/mercury-reader/oknpjjbmpnndlpmnhmekjpocelpnlfdi) gets a clean and easily readable versions of your favorite webpages, articles, and news anymore by striping out surrounding webpage clutter, formatting, and advertising, for a clean, easily readable view for your comfort, while also including social sharing features and Send to Kindle functionality.
- [Readme](https://chrome.google.com/webstore/detail/readme-text-to-speech-rea/npdkkcjlmhcnnaoobfdjndibfkkhhdfn) is a text-to-speech reader that works right within your Chrome browser to increase accessibility as you write or read articles. It can also help you listen to your drafts out loud for proofreading purposes. Listening to your writing can be an excellent way to catch errors.

# **Useful hacks**

- [Instant Dictionary](https://chrome.google.com/webstore/detail/instant-dictionary-by-goo/mfembjnmeainjncdflaoclcjadfhpoim) lets you quickly look up the definitions of words or phrases, either by double-clicking a word or clicking on the extension button next to your omnibar (if the extension can't supply a definition, it offers a Google search as a quick second option)
- [Dark Reader](https://www.notion.so/d7ffc745a8ad4adb8a0f16f9679a047f?pvs=21) helps you adapt colors to the time of the day so you're not blinded by the light at night
- Answer `@threadreaderapp unroll` to any Twitter thread for a nice Reading Mode
