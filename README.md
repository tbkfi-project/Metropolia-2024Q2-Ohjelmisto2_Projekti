### Kuvaus
Metropolia: Tieto- ja viestintätekniikan tutkinto-ohjelma, Ohjelmisto 2 -kurssin projekti.

### Ryhmä D
Tuomo Björk (tuomo.bjork@metropolia.fi) \
Aaro Jylhämäki (aaro.jylhamaki@metropolia.fi) \
Tuuli Lappalainen (tuuli.lappalainen@metropolia.fi) \
Noel Kokkonen (noel.kokkonen@metropolia.fi)

### Ajanseuranta ja kommunikaatio
[Ajanseuranta](https://docs.google.com/spreadsheets/d/1XTxX56RbdpmkC3JlASPzWTHJM8URglg02o75aTJh6Sc/) \
[Discord](https://discord.com/channels/1207577718405857341/1207577718875623468)


### Ohjelman jatkokehitys ja käyttö

- Clone/lataa lähdekoodi laitteelle ja valmistele kehitysympäristösi.
- Riippuvaisuudet voit asentaa suorittamalla `setup.sh` (bash), joka luo virtuaalisen python ympäristön (`/.venv`) projektin pääkansioon. Tai yleisesti suorittamalla: `pip install -r requirements.txt`, lähdekoodin root-kansiossa.
- Määrittele ympäristömuuttujasi `config`-kansiossa olevalla `.env.template`:lla. Tee tiedostosta kopio: `.env`, ja määrittele sen sisällä olevat muuttujat omaan ympäristöösi sopiviksi.
- Peli käynnistyy `main.py`-tiedoston kautta.

- Saat tietokannasta kopion suorittamalla `source '\path\to\ryhma_d_flight_game.sql\file'` MySQL-ohjelmassasi. Valmiiksi alustettu tietokanta ('ryhma_d_flight_game.sql') löytyy projektin pääkansiosta. 
- Pelin vaatiman tietokannan saa myös alustettua manuaalisesti suorittamalla 'ryhma_d_flight_game.sql'-tiedoston sisällön mm. HeidiSQL-sovelluksen 'Query'-osiossa.
- Tietokannan nimen voi muuttaa 'ryhma_d_flight_game.sql'-tiedoston 'CREATE DATABASE'-kohdan kautta.
