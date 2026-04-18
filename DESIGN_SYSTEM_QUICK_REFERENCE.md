# 🎨 SwiftCart Design System - Quick Reference

## Color Palette

| Color                   | Hex     | Usage                                 |
| ----------------------- | ------- | ------------------------------------- |
| **Primary (Soft Blue)** | #DDEFFD | Backgrounds, highlights, focus states |
| **Accent (Deep Navy)**  | #0F172A | Text, buttons, branding               |
| **Secondary (White)**   | #FFFFFF | Cards, inputs, backgrounds            |
| **Light Gray**          | #F7F8FA | Subtle backgrounds                    |
| **Muted Gray**          | #8B92A5 | Secondary text                        |
| **Success Green**       | #16A34A | Badges, success states                |
| **Warning Amber**       | #F59E0B | Warnings                              |
| **Error Red**           | #DC2626 | Errors, delete actions                |

---

## Component Usage

### Button Examples

```tsx
// Primary Action
<PremiumButton
  title="Sign In"
  onPress={handleLogin}
  variant="primary"
  size="lg"
  fullWidth
/>

// Secondary Action
<PremiumButton
  title="Back"
  onPress={handleBack}
  variant="secondary"
/>

// Outline Style
<PremiumButton
  title="Learn More"
  onPress={handleLearn}
  variant="outline"
/>

// Small Button
<PremiumButton
  title="Shop Now"
  onPress={handleShop}
  variant="primary"
  size="sm"
/>
```

### Input Examples

```tsx
// Email Input
<PremiumInput
  label="Email Address"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  icon="mail"
  error={errors.email}
/>

// Password Input
<PremiumInput
  label="Password"
  placeholder="••••••••"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  icon="lock-closed"
  error={errors.password}
/>

// Text Input
<PremiumInput
  label="Full Name"
  placeholder="John Doe"
  value={name}
  onChangeText={setName}
  icon="person"
/>
```

### Card Examples

```tsx
// Default Card
<PremiumCard padding={16}>
  <Text>Card Content</Text>
</PremiumCard>

// Elevated Card (Product)
<PremiumCard variant="elevated">
  <Image source={{uri}} style={{height: 200}} />
  <Text style={{fontWeight: '700', fontSize: 14}}>Product Name</Text>
</PremiumCard>

// Clickable Card
<PremiumCard
  onPress={() => navigate}
  variant="outlined"
>
  <Text>Tap me</Text>
</PremiumCard>
```

### Toast Examples

```tsx
// Success Toast
<useToast>show('✅ Login Successful', {
  message: 'Welcome back to SwiftCart',
  type: 'success',
  duration: 2000,
})</useToast>

// Error Toast
show('❌ Something went wrong', {
  message: 'Please try again',
  type: 'error',
  duration: 3000,
})

// Info Toast
show('ℹ️ Info', {
  message: 'Your order has been confirmed',
  type: 'info',
  duration: 2000,
})
```

---

## Typography Scale

| Size            | Usage                   |
| --------------- | ----------------------- |
| **xs (12px)**   | Labels, captions        |
| **sm (14px)**   | Secondary text, buttons |
| **base (16px)** | Body text, inputs       |
| **lg (18px)**   | Subheadings             |
| **xl (20px)**   | Section titles          |
| **2xl (24px)**  | Screen titles           |
| **3xl (30px)**  | Major headings          |
| **4xl (36px)**  | Hero text               |

**Font Weights:**

- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## Spacing Scale

| Scale | Size | Usage            |
| ----- | ---- | ---------------- |
| xs    | 4px  | Micro spacing    |
| sm    | 8px  | Small gaps       |
| md    | 12px | Standard padding |
| lg    | 16px | Default padding  |
| xl    | 20px | Section gaps     |
| 2xl   | 24px | Large sections   |
| 3xl   | 32px | Major gaps       |
| 4xl   | 40px | Hero spacing     |
| 5xl   | 48px | Page margins     |

---

## Border Radius

| Type | Size   | Usage          |
| ---- | ------ | -------------- |
| sm   | 8px    | Small elements |
| md   | 12px   | Inputs         |
| lg   | 16px   | Cards          |
| xl   | 20px   | Buttons        |
| 2xl  | 24px   | Large cards    |
| 3xl  | 28px   | Premium feel   |
| full | 9999px | Pills, circles |

---

## Shadow System

| Level  | Elevation | Usage                   |
| ------ | --------- | ----------------------- |
| **sm** | 2         | Subtle depth, inputs    |
| **md** | 4         | Standard cards, buttons |
| **lg** | 8         | Floating elements       |
| **xl** | 12        | Premium depth, modals   |

**How to use:**

```tsx
import { Shadows } from "../../constants/theme";

<View style={[styles.card, Shadows.lg]}>{/* Content */}</View>;
```

---

## Common Patterns

### Form Container

```tsx
<View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.md }}>
  <PremiumInput label="Field 1" {...props} />
  <PremiumInput label="Field 2" {...props} />
  <PremiumButton title="Submit" onPress={submit} fullWidth />
</View>
```

### Section Header

```tsx
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  }}
>
  <Text style={{ fontSize: 20, fontWeight: "700", color: Colors.accent }}>
    Section Title
  </Text>
  <TouchableOpacity>
    <Text style={{ color: Colors.accent, fontWeight: "600" }}>View All →</Text>
  </TouchableOpacity>
</View>
```

### Product Card

```tsx
<PremiumCard variant="elevated">
  <Image
    source={{ uri: productImage }}
    style={{ width: "100%", height: 200, borderRadius: BorderRadius.lg }}
  />
  <View style={{ padding: Spacing.lg, gap: Spacing.sm }}>
    <Text style={{ fontSize: 11, color: Colors.muted, fontWeight: "600" }}>
      CATEGORY
    </Text>
    <Text
      style={{ fontSize: 14, fontWeight: "600", color: Colors.text.primary }}
    >
      Product Name
    </Text>
    <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.accent }}>
      $99.99
    </Text>
  </View>
</PremiumCard>
```

### Empty State

```tsx
<View
  style={{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  }}
>
  <Ionicons name="bag" size={64} color={Colors.muted} />
  <Text
    style={{
      fontSize: 18,
      fontWeight: "700",
      color: Colors.text.primary,
      marginTop: Spacing.lg,
      textAlign: "center",
    }}
  >
    No Items Yet
  </Text>
  <Text
    style={{
      fontSize: 14,
      color: Colors.muted,
      marginTop: Spacing.sm,
      textAlign: "center",
    }}
  >
    Start shopping to fill your cart
  </Text>
</View>
```

---

## Animation Values

| Duration | Milliseconds | Usage                |
| -------- | ------------ | -------------------- |
| fast     | 200ms        | Quick interactions   |
| normal   | 300ms        | Standard transitions |
| slow     | 500ms        | Page changes         |
| slower   | 800ms        | Loading states       |

---

## Color Combinations

### CTA (Call to Action)

- Background: Navy (#0F172A)
- Text: White (#FFFFFF)

### Secondary Actions

- Background: Soft Blue (#DDEFFD)
- Text: Navy (#0F172A)

### Forms

- Background: Light Gray (#F7F8FA)
- Border: Gray (#E5E7EB)
- Focus: Soft Blue (#DDEFFD)

### Success Messages

- Background: Green (#16A34A)
- Text: White (#FFFFFF)

---

## Responsive Breakpoints

| Screen Size | Usage           |
| ----------- | --------------- |
| < 375px     | Small phones    |
| 375-414px   | Standard phones |
| 414-768px   | Large phones    |
| > 768px     | Tablets         |

**Note:** All components use percentage widths and flexible layouts for full responsiveness.

---

## Accessibility Guidelines

- ✅ Min touch target: 44x44px
- ✅ Color contrast ratio: 4.5:1
- ✅ Font sizes: Min 14px
- ✅ Labels on all inputs
- ✅ Icon descriptions
- ✅ Semantic structure

---

## Quick Imports

```tsx
// Colors
import { Colors } from "../../constants/theme";

// Spacing
import { Spacing } from "../../constants/theme";

// Border Radius
import { BorderRadius } from "../../constants/theme";

// Shadows
import { Shadows } from "../../constants/theme";

// UI Components
import {
  PremiumButton,
  PremiumInput,
  PremiumCard,
  LoadingSpinner,
  useToast,
  ToastProvider,
} from "../../src/components/ui";
```

---

## Theme Usage Example

```tsx
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "../../constants/theme";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Premium App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.accent,
    marginBottom: Spacing.xl,
  },
});
```

---

**Remember: Consistency is key to a premium app! Always reference the design system.** ✨
