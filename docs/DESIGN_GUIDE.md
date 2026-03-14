# react-template 設計指南

## 🎨 概述

本設計指南提供了 react-template 前端專案的完整設計系統規範，包含色彩、字體、間距、元件佈局等設計原則。

## 📋 目錄

1. [色彩系統](#色彩系統)
2. [字體排版](#字體排版)
3. [間距系統](#間距系統)
4. [陰影系統](#陰影系統)
5. [邊框與圓角](#邊框與圓角)
6. [元件佈局指南](#元件佈局指南)
7. [響應式設計](#響應式設計)
8. [元件規範](#元件規範)

---

## 🎨 色彩系統

### 主要色彩

```css
/* 主色調 */
--primary: oklch(0.627 0.228 43.96); /* 橙色主色 */
--primary-foreground: oklch(1 0 0); /* 主色文字 */

/* 背景色 */
--background: oklch(0.975 0 0); /* 淺色背景 */
--foreground: oklch(0.129 0.042 264.695); /* 主要文字色 */

/* 卡片色彩 */
--card: oklch(1 0 0); /* 卡片背景 */
--card-foreground: oklch(0.129 0.042 264.695); /* 卡片文字 */

/* 次要色彩 */
--secondary: oklch(0.91 0.007 247.896); /* 次要背景 */
--secondary-foreground: oklch(0.208 0.042 265.755); /* 次要文字 */

/* 第三色彩 */
--tertiary: oklch(0.2734 0.0468 247.77); /* 深色背景 */
--tertiary-foreground: oklch(0.91 0.007 247.896); /* 深色文字 */

/* 靜音色彩 */
--muted: oklch(0.968 0.007 247.896); /* 靜音背景 */
--muted-foreground: oklch(0.554 0.046 257.417); /* 靜音文字 */

/* 強調色彩 */
--accent: oklch(0.968 0.007 247.896); /* 強調背景 */
--accent-foreground: oklch(0.208 0.042 265.755); /* 強調文字 */

/* 破壞性色彩 */
--destructive: oklch(0.577 0.245 27.325); /* 錯誤/危險色 */

/* 邊框色彩 */
--border: oklch(0.929 0.013 255.508); /* 邊框色 */
--input: oklch(0.929 0.013 255.508); /* 輸入框邊框 */
--ring: oklch(0.704 0.04 256.788); /* 焦點環色 */

/* 連結色彩 */
--link: oklch(0.5987 0.219351 259.0395); /* 連結色 */
--link-hover: oklch(0.746 0.1348 251.78); /* 連結懸停 */
--link-active: oklch(0.5044 0.2095 260.97); /* 連結激活 */
```

### 深色模式色彩

```css
.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --primary: oklch(0.69 0.18 43.96);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  /* ... 其他深色模式變數 */
}
```

### 使用範例

```tsx
// 主要按鈕
<Button variant="default">主要動作</Button>

// 次要按鈕
<Button variant="secondary">次要動作</Button>

// 危險按鈕
<Button variant="destructive">刪除</Button>

// 輪廓按鈕
<Button variant="outline">取消</Button>
```

---

## ✍️ 字體排版

### 標題系統

```css
/* H1 - 特殊使用，需特別強調該頁面才使用 */
.h1 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
}

/* H2 - 一般頁面標題，例如 home 的標題 */
.h2 {
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.3;
}

/* H3 - 小標題 ！當前未使用 */
.h3 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

/* H4 - 子標題 ！當前未使用 */
.h4 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}
```

### 文字樣式

```css
/* 預設標準文字 */
.text {
  line-height: 1.5;
}

/* 大文字 ！當前未使用*/
.large {
  font-size: 1.125rem;
  font-weight: 600;
}

/* 小文字 ！當前未使用 */
.small {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}

/* 輔助文字，例如 CardDescription 等元件，用以輔助標題使用 */
.muted {
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

/* 引言 ！當前未使用 */
.lead {
  font-size: 1.25rem;
  color: var(--muted-foreground);
}
```

### 使用範例

```tsx
<Typography variant="h1">主要標題</Typography>
<Typography variant="h2">次要標題</Typography>
<Typography variant="text">正文內容</Typography>
<Typography variant="muted">輔助說明文字</Typography>
<Typography variant="small">小字體文字</Typography>
```

---

## 📏 間距系統

### 常用間距模式

```tsx
// 卡片內容間距
// 卡片內容的區塊間距預設為 spacing-6
<Card className="py-6">
  <CardHeader className="px-6 gap-1.5">
  <CardContent className="px-6">
  <CardFooter className="px-6">
</Card>

// 表單間距
// 每一個表單之間的距離為 spacing-4
// 標籤與輸入框間的距離為 spacing-1
<form className="space-y-4">
  <div className="flex flex-col gap-y-1">
    <Label>標籤</Label>
    <Input className="h-11" />
  </div>
</form>
```

---

## 🌫️ 陰影系統

### 陰影層級

```css
/* 淺陰影 - 用於輸入框、按鈕 */
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* 標準陰影 - 用於卡片 */
.shadow-sm {
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* 中等陰影 - 用於懸浮卡片，例如 dropdown 等等 */
.shadow-md {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* 大陰影 - 用於使用在如登入頁面、忘記密碼等獨立區塊的框 */
.shadow-lg {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

### 使用範例

```tsx
// 登入卡片使用較大陰影
<Card className="shadow-lg">

// 一般按鈕使用淺陰影
<Button className="shadow-xs">

// 下拉選單預設使用中陰影
<Dropdown classname="shadow-md">

// 輸入框使用淺陰影
<Input className="shadow-xs">
```

---

## 🔲 邊框與圓角

### 圓角使用

目前的圓角都預設使用元件內部的預設圓角，除非有特殊設計需求。

```css
/* 小圓角 - 徽章、小按鈕 */
.rounded-md {
  border-radius: 0.375rem;
}

/* 標準圓角 - 按鈕、輸入框 */
.rounded-md {
  border-radius: 0.375rem;
}

/* 大圓角 - 卡片 */
.rounded-xl {
  border-radius: 0.75rem;
}
```

### 使用範例

```tsx
// 卡片預設使用大圓角
<Card className="rounded-xl border">

// 按鈕預設使用標準圓角
<Button className="rounded-md">

// 輸入框預設使用標準圓角
<Input className="rounded-md border">
```

---

## 📱 元件佈局指南

### 頁面佈局結構

記得所有的大區塊需要以 `<section>` 包裹，用於處理和辨識不同區塊的介面設計。

```tsx
// 標準頁面結構
<section className="flex flex-col items-center gap-2">
  <Card className="w-full max-w-lg">
    <CardHeader className="space-y-1 pb-3">
      <CardTitle className="text-2xl font-semibold">
      <CardDescription className="text-center">
    </CardHeader>
    <CardContent>
      <form className="space-y-4">
        // 表單內容
      </form>
    </CardContent>
  </Card>
</section>
```

### 表單佈局

預設個輸入框之間的距離為 spacing-4，若標籤標籤與輸入框為垂直排列，之間距離則為 spacing-1

```tsx
// 標準表單欄位
<div className="flex flex-col gap-y-1">
  <Label htmlFor="field">標籤</Label>
  <Input id="field" className="h-11" placeholder="請輸入..." />
</div>
```

### 卡片內容佈局

```tsx
// 標準卡片結構
<Card className="w-full">
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle>標題</CardTitle>
      <CardAction>
        <Button variant="outline" size="sm">
          動作
        </Button>
      </CardAction>
    </div>
    <CardDescription>描述文字</CardDescription>
  </CardHeader>

  <CardContent>// 主要內容</CardContent>

  <CardFooter className="border-t pt-6">// 底部動作</CardFooter>
</Card>
```

---

## 📱 響應式設計

### 斷點系統

```css
/* Tailwind CSS 響應式斷點 */
sm:   /* @media (min-width: 640px) */
md:   /* @media (min-width: 768px) */
lg:   /* @media (min-width: 1024px) */
xl:   /* @media (min-width: 1280px) */
2xl:  /* @media (min-width: 1536px) */
```

### 響應式佈局模式

當前的 RWD 模式尚未有明確規範，若遇到 RWD 的設計模式統一時，請提出討論後，新增至此文件。

```tsx
// 響應式卡片寬度
<Card className="w-full max-w-lg">

// 響應式標題
<CardTitle className="text-2xl font-semibold lg:text-3xl">

// 響應式文字大小
<Typography className="text-sm md:text-base">

// 響應式間距
<div className="p-4 md:p-6 lg:p-8">

// 響應式顯示/隱藏
<div className="hidden md:block">
```

---

## 🧩 元件規範

### 按鈕 (Button)

```tsx
// 主要按鈕
<Button variant="default" size="default">
  主要動作
</Button>

// 次要按鈕
<Button variant="secondary" size="default">
  次要動作
</Button>

// 框線按鈕
// 用以處理區塊中可點選的按鈕，例如在 Root home 的登入超級使用者身份
<Button variant="outline" size="default">
  輪廓按鈕
</Button>

// 危險按鈕
<Button variant="destructive" size="default">
  危險動作
</Button>

// 不同尺寸
<Button size="sm">小按鈕</Button>
<Button size="default">標準按鈕</Button>
<Button size="lg">大按鈕</Button>
<Button size="icon">
  <Icon />
</Button>
```

**按鈕使用原則：**

- 主要動作使用 `default` 變體
- 次要動作使用 `secondary` 或 `outline` 變體
- 危險操作使用 `destructive` 變體

### 輸入框 (Input)

```tsx
// 標準輸入框
<Input
  type="text"
  placeholder="請輸入文字"
  className="h-11"
/>

// 密碼輸入框
<Input
  type="password"
  placeholder="請輸入密碼"
  className="h-11"
/>

// 帶標籤的輸入框
<div className="flex flex-col gap-y-1">
  <Label htmlFor="email">電子郵件</Label>
  <Input
    id="email"
    type="email"
    placeholder="請輸入電子郵件"
    className="h-11"
  />
</div>
```

**輸入框使用原則：**

- 必須提供有意義的 placeholder
- 與 Label 垂直配對使用時使用 `gap-y-1` 間距
- 若與 Label 水平配對時，則以 Grid 進行排版

### 卡片 (Card)

```tsx
// 標準卡片
<Card className="w-full">
  <CardHeader>
    <CardTitle>卡片標題</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    卡片內容
  </CardContent>
</Card>

// 登入卡片樣式
<Card className="w-full max-w-lg border-0 shadow-lg">
  <CardHeader className="space-y-1 pb-3">
    <CardTitle className="text-2xl font-semibold text-center">
      標題
    </CardTitle>
    <CardDescription className="text-center">
      描述
    </CardDescription>
  </CardHeader>
  <CardContent>
    內容
  </CardContent>
</Card>
```

**卡片使用原則：**

- 預設內邊距為 `py-6` 和 `px-6`
- 使用 `shadow-sm` 提供輕微陰影
- 重要卡片（如登入）使用 `shadow-lg`
- 卡片間距使用 `gap-6`

### 警告框 (Alert)

```tsx
// 錯誤警告
<Alert variant="destructive">
  <OctagonAlert />
  <AlertDescription>
    錯誤訊息內容
  </AlertDescription>
</Alert>

// 一般資訊
<Alert variant="default">
  <Info />
  <AlertDescription>
    一般資訊內容
  </AlertDescription>
</Alert>
```

### 徽章 (Badge)

```tsx
// 不同變體的徽章
<Badge variant="default">預設</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">危險</Badge>
<Badge variant="outline">輪廓</Badge>
```

### 搜尋列 (SearchBar)

```tsx
// 標準搜尋列
<SearchBar
  placeholder="搜尋..."
  value={searchValue}
  onChange={setSearchValue}
  onSearch={handleSearch}
  size="md"
  variant="default"
  showClearButton={true}
/>

// 不同尺寸
<SearchBar size="sm" />
<SearchBar size="md" />
<SearchBar size="lg" />
```

---

## 🎯 設計原則

### 1. 一致性原則

- 所有相同類型的元件保持統一的視覺樣式
- 使用統一的間距系統和色彩系統
- 保持字體大小和權重的一致性

### 2. 可訪問性原則

- 提供適當的焦點視覺回饋 (`focus-visible:ring-ring/50`)
- 保持足夠的色彩對比度和框線分類，不要只是透過顏色的些微差異，這會導致部分使用者難以辨識差異
- 使用語義化的 HTML 結構

### 3. 響應式原則

- 優先設計移動端體驗
- 使用流體佈局和相對單位
- 適當地調整字體大小和間距

### 4. 使用者體驗原則

- 提供清晰的視覺層次
- 使用適當的動畫和過渡效果，需處理 Hover / Focus 等情境
- 保持載入狀態的視覺回饋
- 使用有意義的錯誤訊息

---

## 📝 使用建議

### 1. 開發新功能時

- 優先使用現有的 UI 元件
- 遵循既定的間距和色彩系統
- 確保新元件與整體設計風格一致

### 2. 修改現有元件時

- 考慮對其他頁面的影響
- 保持向後相容性
- 如需調整現有設計，請提出討論並更新相關的設計文件

### 3. 色彩使用建議

- 主要動作使用 primary 色彩
- 危險操作使用 destructive 色彩
- 次要資訊使用 muted 色彩
- 保持深色模式的相容性

### 4. 間距使用建議

- 元件內部使用較小間距 (1-4)
- 元件之間使用中等間距 (4-6)
- 區塊之間使用較大間距 (6-8)

---

## 🔄 版本記錄

- **v1.0** - 初始設計系統建立
- 基於現有元件建立設計規範
- 支援深色模式
- 完整的響應式設計支援

---

_此設計指南會隨著專案發展持續更新。如有任何建議或問題，請聯繫 Chris Kang。_
