# Canvas & Professional Code Display - User Guide

## 🎨 What's New?

Your AI chat now displays code just like ChatGPT, Claude, and GitHub Copilot! Plus, you can edit code side-by-side with the chat.

---

## 📋 Professional Code Blocks

When the AI generates code, you'll see:

### Visual Features:
```
┌─ CODE BLOCK ──────────────────────────┐
│ 🔴 🟡 🟢              JavaScript  📋 ⛶  │  ← macOS-style controls
├───────────────────────────────────────┤
│ const greeting = "Hello World";       │  ← Syntax highlighting
│ console.log(greeting);                │
└───────────────────────────────────────┘
```

### Buttons:
- **📋 Copy** - Copy code to clipboard (shows ✓ when copied)
- **⛶ Open in Canvas** - Opens code in side editor

---

## 🖥️ Canvas Feature (Side-by-Side Editor)

### Opening Canvas:

**Method 1: From Code Blocks**
1. AI generates code in chat
2. Hover over code block
3. Click the ⛶ (maximize) icon
4. Canvas opens on the right side

**Method 2: Manual**
1. Click the `+` button in chat input
2. Select "Open Canvas"

### Canvas Layout:

```
┌──────────────────┬──────────────────┐
│                  │  🔴 🟡 🟢    ✕   │
│   Your Chat      │  Canvas          │
│   Conversation   │                  │
│                  │  JavaScript ▼    │
│   AI: Here's     │  [Editor]        │
│   the code...    │  [Preview]       │
│   [code block]   │  [Notes]         │
│                  │                  │
│   You: Can you   │  1 const x = 1   │
│   improve it?    │  2 const y = 2   │
│                  │  3 ...           │
└──────────────────┴──────────────────┘
```

### Canvas Tabs:

#### 📝 Editor Tab
- Write and edit code
- Line numbers on the left
- Syntax highlighting
- Auto-indentation

#### 🎨 Preview Tab
- See syntax-highlighted read-only version
- macOS-style window design
- Perfect for code review

#### 📄 Notes Tab
- Write documentation
- Add explanations
- Keep notes alongside code

### Controls:

**Top Bar:**
- **Language Selector** - Choose from 16+ languages
  - JavaScript, TypeScript, Python, Java
  - C++, C#, Go, Rust, Ruby, PHP
  - Swift, Kotlin, HTML, CSS, JSON, Markdown
  
- **Copy Button** - Copy all code
- **Download Button** - Save as file (auto extension)
- **✕ Close** - Close canvas

---

## 🎯 Common Use Cases

### 1. Code Review
```
You: "Write a function to sort an array"
AI: [generates code with syntax highlighting]
You: Click ⛶ → Review in Canvas Preview tab
```

### 2. Code Editing
```
You: "Create a React component"
AI: [generates component]
You: Click ⛶ → Edit in Canvas Editor → Download
```

### 3. Learning
```
You: "Explain async/await"
AI: [explains with code examples]
You: Open examples in Canvas
    Add notes in Notes tab
    Download for later
```

### 4. Side-by-Side Work
```
Chat on left:        Canvas on right:
"Add error          [Edit code live]
handling to         [See changes]
this code"          [Download when done]
```

---

## 📱 Mobile Experience

On mobile devices:
- Code blocks: Full width with scroll
- Canvas: Opens full screen
- Swipe between Editor/Preview/Notes tabs
- Close button returns to chat

---

## 💡 Pro Tips

1. **Quick Copy**: Hover code block → Click 📋
2. **Multi-file Work**: Open canvas, edit, download, get next file
3. **Code Comparison**: Keep chat open, compare AI suggestions in canvas
4. **Documentation**: Use Notes tab while reviewing code
5. **Language Switch**: Change language in canvas dropdown anytime

---

## 🎨 Supported Languages

| Language   | Extension | Highlighting |
|------------|-----------|--------------|
| JavaScript | .js       | ✅           |
| TypeScript | .ts       | ✅           |
| Python     | .py       | ✅           |
| Java       | .java     | ✅           |
| C++        | .cpp      | ✅           |
| C#         | .cs       | ✅           |
| Go         | .go       | ✅           |
| Rust       | .rs       | ✅           |
| Ruby       | .rb       | ✅           |
| PHP        | .php      | ✅           |
| Swift      | .swift    | ✅           |
| Kotlin     | .kt       | ✅           |
| HTML       | .html     | ✅           |
| CSS        | .css      | ✅           |
| JSON       | .json     | ✅           |
| Markdown   | .md       | ✅           |

---

## ⌨️ Keyboard Shortcuts

- **Enter** - Send message (in chat)
- **Shift + Enter** - New line (in chat)
- **Ctrl/Cmd + C** - Copy (in canvas)
- **Tab** - Indent (in canvas editor)

---

## 🐛 Troubleshooting

**Code not highlighting?**
- Check if language is detected (shows in header)
- Try manual language selection in canvas

**Canvas not opening?**
- Check if screen width is sufficient (desktop: 1024px+)
- On mobile, it opens full screen

**Copy button not working?**
- Check browser clipboard permissions
- Try manual selection + copy

---

## 🚀 Examples

### Example 1: Python Function
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```
**Appears with:** Python label, copy button, syntax colors

### Example 2: React Component
```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```
**Appears with:** JavaScript label, JSX highlighting

### Example 3: JSON Config
```json
{
  "name": "my-app",
  "version": "1.0.0"
}
```
**Appears with:** JSON label, property highlighting

---

## 📞 Need Help?

The canvas feature is designed to work seamlessly with your chat workflow. Just ask the AI to:
- "Write some code" → Get professional blocks
- "Show me an example" → Copy or open in canvas
- "Help me debug this" → Edit in canvas while chatting

**Enjoy your professional coding experience! 🎉**
