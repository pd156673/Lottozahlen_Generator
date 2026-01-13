# 🎰 Lotto Zahlen Generator

Ein interaktiver Lotto-Zahlen-Generator mit Animationen und Speicherfunktion.

## Features

✨ **Animierte Zahlengenerierung**
- Dynamische Animation während der Zahlenerzeugung
- Realistische Ball-Animationen beim Zeichnen
- Nacheinander angezeigten Zahlen für maximalen Effekt

🎲 **Zwei Generierungsmodi**
1. **Zufälliger Generator** - Vollständig zufällige Zahlenkombinationen
2. **Intelligenter Generator** - Vermeidet Zahlenmuster intelligent:
   - ❌ Geburtstagsähnliche Muster (z.B. Tag/Monat)
   - ❌ Arithmetische Sequenzen (1,2,3,4,5,6)
   - ❌ Zu dicht beieinanderliegende Zahlen
   - ✅ Sorgt für gute Verteilung über den gesamten Bereich

📋 **Verlauf speichern**
- Automatisches Speichern aller generierten Kombinationen
- Browser-lokale Speicherung (localStorage)
- Bis zu 20 letzte Kombinationen
- Anzeige des verwendeten Modus (Zufällig/Intelligent)
- Anzeige von Datum und Uhrzeit
- Einzelne Einträge löschen möglich

🎯 **Deutscher Lotto-Standard**
- 6 Zahlen von 1-49
- 1 Zusatzzahl von 0-9

� **Gewinnzahlen überprüfen**
- Gib die echten Gewinnzahlen ein
- Automatische Überprüfung und Vergleich
- Zeigt die Anzahl der Treffer an
- Spezielle Nachricht bei 6 Richtigen: "JACKPOT!" mit Kontaktdaten der Lotto-Zentrale

�🎨 **Moderne Benutzeroberfläche**
- Responsive Design für alle Geräte
- Gradient-Hintergründe und Animationen
- Benutzerfreundliche Bedienung

## Verwendung

### Zahlen generieren

1. Öffne `index.html` in deinem Browser
2. Wähle einen Generierungsmodus:
   - **🎲 Zahlen generieren** - Für vollständig zufällige Kombinationen
   - **✨ Intelligente Zahlen** - Für statistisch ausgewogenere Kombinationen
3. Beobachte die animierte Zahlengenerierung
4. Alle Kombinationen werden automatisch im Verlauf gespeichert

### Gewinnzahlen überprüfen

1. Gib die echten Gewinnzahlen aus der Lotterie ein (6 Zahlen + Zusatzzahl)
2. Klicke auf "✓ Überprüfen"
3. Das Ergebnis wird sofort angezeigt:
   - **Normale Treffer**: Zeigt wie viele Zahlen richtig sind
   - **6 Richtige**: Zeigt eine Glückwunsch-Nachricht mit Kontaktdaten der Lotto-Zentrale

### Weitere Funktionen

- Zurücksetzen-Button zum Löschen der aktuellen Anzeige
- Einzelne Einträge aus dem Verlauf löschen
- Vollständiger Verlauf kann gelöscht werden

### Intelligenter Generator erklärt

Der intelligente Modus analysiert die Zahlen und verhindert automatisch:

- **Geburtstagsähnliche Muster**: Zu viele Zahlen aus dem Bereich 1-31 (wie Tag, Monat)
- **Arithmetische Sequenzen**: Aufeinanderfolgende Zahlen (z.B. 1, 2, 3, 4, 5, 6)
- **Clustered Numbers**: 3+ sehr dicht beieinanderliegende Zahlen
- **Ungleiche Verteilung**: Sorgt für Zahlen aus niedrigem, mittlerem und hohem Bereich

## Dateistruktur

```
├── index.html      # HTML-Struktur
├── style.css       # Styling und Animationen
├── script.js       # Logik und Funktionalität
└── README.md       # Dokumentation
```

## Technologie

- **HTML5** - Struktur
- **CSS3** - Styling mit Animationen und Gradients
- **JavaScript (Vanilla)** - Logik und DOM-Manipulation
- **localStorage API** - Datenpersistierung

## Browser-Kompatibilität

- Chrome/Chromium (empfohlen)
- Firefox
- Safari
- Edge
- Mobile Browser

## Lizenz

Frei verwendbar für private und kommerzielle Zwecke.

---

**Viel Glück beim Spielen! 🍀**