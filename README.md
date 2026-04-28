---

# 🚀 ox_lib Redesign NUI Pack

A modern, clean and enhanced redesign of the **ox_lib menu UI**, focused on usability, aesthetics and smooth interaction.

---

## ✨ Overview

This redesign improves the default ox_lib menu by introducing:

* 🎨 A refined and modern interface
* 🖱️ Proper mouse interaction on menu open
* ⚡ Smooth and responsive behavior
* 💡 Better user experience overall

---

## 📸 Preview

<img width="100%" src="https://github.com/user-attachments/assets/75ef9742-8bae-411d-a455-43027a5d457f" />
<img width="100%" src="https://github.com/user-attachments/assets/18afbf58-da04-4383-81aa-72fd5a37e655" />
<img width="100%" src="https://github.com/user-attachments/assets/f9461687-defe-4429-ba30-bf9ea6f0c8dc" />
<img width="100%" src="https://github.com/user-attachments/assets/134ac7fc-5030-4023-a393-9073801e3a2c" />
<img width="100%" src="https://github.com/user-attachments/assets/d93799a9-99cc-4afa-b3ed-3803483138b5" />
<img width="100%" src="https://github.com/user-attachments/assets/f64f4b0f-9130-4b30-b6f9-69c0bd848d82" />
<img width="100%" src="https://github.com/user-attachments/assets/e69f1f7b-3a0b-43bd-b73c-8f242345b144" />
<img width="100%" src="https://github.com/user-attachments/assets/79d74755-860d-4d97-8fae-5f8c857c408d" />
<img width="100%" src="https://github.com/user-attachments/assets/0fe1b531-fb0d-4be0-8629-de03f72e018b" />
<img width="100%" src="https://github.com/user-attachments/assets/5f8695c5-3a57-41a7-9ebf-af9f26d53f08" />
<img width="100%" src="https://github.com/user-attachments/assets/028e76bb-3999-4256-808a-a395b6e78ba7" />

---

## ⚙️ Required Fix (Mouse Interaction)

To correctly enable mouse usage when opening the menu, apply the following changes inside **ox_lib**:

### 📁 Path

```
ox_lib/resource/interface/client/menu.lua
```

---

### 🔧 Changes

#### ➤ Inside `confirmSelected`

```lua
-- lib.resetNuiFocus()
```

---

#### ➤ Inside `lib.showMenu`

```lua
-- lib.setNuiFocus(not menu.disableInput, true)
```

---

#### ➤ Add this

```lua
SetNuiFocus(true, true)
```

---

## 🧠 Notes

* This fix is **essential** for proper mouse interaction
* Designed to work seamlessly with ox_lib
* Minimal changes, maximum usability

---

## 📄 License

Custom usage license. Redistribution or resale is not allowed.

---






<img width="1919" height="1076" alt="Screenshot 2026-04-26 110731" src="https://github.com/user-attachments/assets/75ef9742-8bae-411d-a455-43027a5d457f" />

<img width="1919" height="1079" alt="Screenshot 2026-04-26 110539" src="https://github.com/user-attachments/assets/18afbf58-da04-4383-81aa-72fd5a37e655" />

<img width="1919" height="1079" alt="Screenshot 2026-04-26 105645" src="https://github.com/user-attachments/assets/f9461687-defe-4429-ba30-bf9ea6f0c8dc" />

<img width="1917" height="1078" alt="Screenshot 2026-04-26 105620" src="https://github.com/user-attachments/assets/134ac7fc-5030-4023-a393-9073801e3a2c" />

<img width="1919" height="1079" alt="Screenshot 2026-04-26 105601" src="https://github.com/user-attachments/assets/d93799a9-99cc-4afa-b3ed-3803483138b5" />

<img width="1919" height="1077" alt="Screenshot 2026-04-26 105442" src="https://github.com/user-attachments/assets/f64f4b0f-9130-4b30-b6f9-69c0bd848d82" />

<img width="1913" height="1078" alt="Screenshot 2026-04-26 121259" src="https://github.com/user-attachments/assets/e69f1f7b-3a0b-43bd-b73c-8f24234b5144" />

<img width="1919" height="1079" alt="Screenshot 2026-04-26 121230" src="https://github.com/user-attachments/assets/79d74755-860d-4d97-8fae-5f8c857c408d" />

<img width="1919" height="1079" alt="Screenshot 2026-04-26 112513" src="https://github.com/user-attachments/assets/0fe1b531-fb0d-4be0-8629-de03f72e018b" />

<img width="1919" height="1079" alt="Screenshot 2026-04-26 110906" src="https://github.com/user-attachments/assets/5f8695c5-3a57-41a7-9ebf-af9f26d53f08" />

<img width="1919" height="1076" alt="Screenshot 2026-04-26 105520" src="https://github.com/user-attachments/assets/028e76bb-3999-4256-808a-a395b6e78ba7" />
