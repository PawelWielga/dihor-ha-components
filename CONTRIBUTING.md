# 🤝 Contributing to Dihor HA Components

Hey there! 👋 We're thrilled that you want to contribute to Dihor HA Components! This project is all about making Home Assistant dashboards more fun and functional, and your help makes that possible.

## 🚀 Getting Started

### Prerequisites
- Node.js (we recommend the latest LTS version)
- npm or yarn

### Setup
1. Fork the repository
2. Clone your forked repo to your local machine
3. Run `npm install` to install dependencies
4. Start developing!

## 🛠️ Development Process

### Creating a New Card
1. Create a new directory in `src/cards/` for your card
2. Add a TypeScript file (e.g., `dihor-my-card.ts`), HTML file (e.g., `dihor-my-card.html`), and CSS file (e.g., `dihor-my-card.css`)
3. Import your card in `src/index.ts`
4. Test your changes locally with `npm run dev`

### Building the Package
Run `npm run build` to generate the production bundle in the `dist/` directory.

## 📝 Commit Messages
While we've removed semantic-release, it's still helpful to use clear commit messages. Here are some examples:
- `feat(clock): add timezone option` - for new features
- `fix(minecraft): handle missing sensor` - for bug fixes
- `chore: update dependencies` - for maintenance tasks

## 🎯 Pull Requests
1. Create a new branch for your feature or bug fix
2. Make your changes
3. Test thoroughly
4. Create a pull request with a clear description of your changes

## 📚 Documentation
- The `prepare-docs.js` script copies card files to the `docs/` directory
- Run `npm run prepare-docs` to update the documentation
- Test the documentation with `npm run preview`

## 🐛 Reporting Issues
If you find a bug or have an idea for a new feature:
1. Check if there's already an issue for it
2. If not, create a new issue with:
   - A clear title
   - A detailed description of the problem or feature
   - Steps to reproduce (for bugs)
   - Screenshots (if applicable)

## 🎨 Design Guidelines
- Keep cards simple and focused on one purpose
- Use the existing styling from `theme.css` and `core.css`
- Ensure cards are responsive and work on mobile devices
- Add comments to your code for clarity

## 📄 License
By contributing to Dihor HA Components, you agree that your contributions will be licensed under the MIT License.

---

Thanks again for your interest in contributing! 🎉 Your help is what makes this project awesome.
