# 🚀 Dihor HA Components - Super Custom Cards for Your Dashboard!

Hey there, fellow Home Assistant enthusiast! 👋  
Tired of boring old standard cards? Want to spice up your dashboard with some cool, unique components that will make your smart home look like it's from the future (or at least from 2024)? You've come to the right place! 🎉

## 📦 What's This All About?
Dihor HA Components is a collection of **super awesome, slightly quirky, and totally functional custom UI cards** for Home Assistant. They're designed to make your dashboard more fun, more informative, and definitely more "you"!

## 🎮 Available Cards (So Far...)

### 1. 🕐 Dihor Clock Card - A Clock That Doesn't Suck
Tired of checking your phone for time when you have a giant dashboard? This clock is big, bold, and customizable! Adjust the size to match your mood (or the size of your screen).

```yaml
type: 'custom:dihor-clock-card'
size: 2  # 1 = small, 2 = medium, 3 = "I need to see this from the other room!"
```

### 2. 🎮 Dihor Minecraft Card - For the Blocky Gamers
Got a Minecraft server? Want to show off how many players are online without opening the game? This card is perfect for you! It's like having a mini-server monitor right on your dashboard.

```yaml
type: 'custom:dihor-clock-card'
size: 2  # 1 = small, 2 = medium, 3 = "I need to see this from the other room!"
```

### 3. 👤 Dihor Person Card - The Social Network of Your Smart Home
Display your Home Assistant person entities with style! Perfect for keeping track of who's home, who's away, and who's probably making a mess in the kitchen.

```yaml
type: 'custom:dihor-person-card'
entity: person.my_account  # Replace with your actual person entity
```

## 🛠️ Installation - It's Easier Than Baking Bread!

### Method 1: HACS (Recommended - Like Shopping Online!)
1. Open HACS in your Home Assistant
2. Go to the "Frontend" section
3. Click the "+ Explore & Download Repositories" button
4. Search for "Dihor HA Components"
5. Click "Download" (and maybe a little happy dance? 🕺)
6. After installation, add the resource:
   - URL: `/hacsfiles/dihor-ha-components/dihor-ha-components.js`
   - Type: Module

### Method 2: Manual (For the Adventurous)
1. Download the `dihor-ha-components.js` file from the latest release
2. Put it in your `www/` folder (e.g., `config/www/`)
3. Add the resource:
   - URL: `/local/dihor-ha-components.js`
   - Type: Module

## 🔥 Features That Make You Go "Wow!"

- ✨ **Easy to Install**: Just a few clicks (or a little copy-pasting) and you're in business!
- 🎨 **Customizable**: Tweak colors, sizes, and other settings to match your style
- 📱 **Mobile-Friendly**: Looks great on both big screens and tiny phone displays
- 🔄 **Regular Updates**: We're always adding new features (and fixing bugs... we promise!)
- 🤝 **Community-Driven**: Made by a Home Assistant user, for Home Assistant users!

## 🐛 Found a Bug? Want a Feature?
Hey, we're only human (well, mostly... 🤖). If you find a bug or have a brilliant idea for a new feature, let us know! Open an issue on GitHub or send us a message. We love feedback!

## 📜 License
This project is licensed under the MIT License - which means you can do pretty much whatever you want with it! Just don't blame us if your dashboard becomes too awesome.

---

Made with ❤️ by [Pawel Wielga](https://github.com/PawelWielga)  
"Turning boring dashboards into something worth showing off!" 🚀
