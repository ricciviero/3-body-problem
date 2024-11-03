# Guida Rapida: Merge Branch Git

Questa guida spiega come effettuare il merge tra due branch Git utilizzando il terminale integrato di VS Code.

## Prerequisiti
- Visual Studio Code installato
- Repository Git inizializzato
- Due branch: `master` e `dev`

## Processo di Merge

### 1. Preparazione
Prima di iniziare il merge, assicurati di:
- Aver committato tutte le modifiche pendenti
- Essere aggiornato con il repository remoto

```bash
git fetch origin
```

### 2. Passare al Branch Master
```bash
git checkout master
```

### 3. Aggiornare il Branch Master
```bash
git pull origin master
```

### 4. Eseguire il Merge
```bash
git merge dev
```

Se non ci sono conflitti, il merge verrà completato automaticamente.
In caso di conflitti, VS Code mostrerà le differenze e dovrai risolverle manualmente.

### 5. Pushare le Modifiche
Dopo aver completato il merge, pusha le modifiche:
```bash
git push origin master
```

## Eliminazione Branch

### Eliminare Branch Locale
Dopo aver verificato che il merge sia andato a buon fine:
```bash
git branch -d dev
```
Se il branch non è stato completamente mergiato, usa `-D` per forzare l'eliminazione:
```bash
git branch -D dev
```

### Eliminare Branch Remoto
Per eliminare il branch remoto da GitHub:
```bash
git push origin --delete dev
```

## Verifica
Per verificare lo stato dei branch:
- Lista branch locali: `git branch`
- Lista branch remoti: `git branch -r`
- Lista tutti i branch: `git branch -a`