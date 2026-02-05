
# UrbanSave AI - Implementation Plan

## 🎨 Design Vision
A polished Modern SaaS aesthetic with:
- Smooth gradients (emerald/teal energy theme)
- Rounded cards with subtle shadows
- Micro-animations and transitions
- Sleek dark/light theme toggle
- Professional dashboard-like layouts

---

## 📄 Pages & Features

### 1. Landing Page
- Hero section with animated gradient background
- Product name "UrbanSave AI" with animated tagline
- Feature highlights with animated icons
- CTA button to start the setup flow
- Smooth scroll sections explaining the platform benefits

### 2. Admin Setup Form (User Input Page)
- Multi-step animated form wizard
- Step 1: Select type (Campus / Society / Building) with visual cards
- Step 2: Consumption data (kWh, bill amount, rooms/blocks)
- Step 3: Appliance selection with interactive checkboxes
- Step 4: Occupancy pattern selector (time-based grid)
- Progress indicator with smooth transitions
- Submit redirects to personalized dashboard

### 3. Main Dashboard
- **Top Banner**: Animated community savings counter ("₹X saved, Y kWh reduced")
- **Consumption Breakdown**: Donut/pie chart showing appliance distribution
- **Predicted Bill Card**: Large number display with trend indicator
- **Wastage Zones**: Bar chart highlighting lighting, AC, idle usage
- **Quick Stats Grid**: Cards showing key metrics with icons
- All charts with loading animations and hover interactions

### 4. Mode Selector Component
- Three beautiful mode cards with distinct visual identities:
  - 🌱 **Eco Mode** - Green theme, prioritize environment
  - ⚖️ **Balanced Mode** - Blue theme, comfort + savings
  - 💰 **Budget Mode** - Amber theme, maximize cost savings
- Visual comparison showing trade-offs (sliders/meters)
- Dynamic updates to recommendations and savings estimates based on selection
- Smooth transition animations between modes

### 5. Recommendations & What-If Simulation
- AI recommendation cards with priority badges
- Interactive sliders:
  - "Auto-off after X minutes" (5-60 min range)
  - "Reduce AC usage by Y%" (0-50% range)
- Real-time calculated impact display:
  - Predicted bill reduction
  - Energy savings visualization
- Before/After comparison charts

### 6. Adaptive Learning & Notifications
- Floating notification popup component
- "Did you apply this recommendation?" Yes/No buttons
- Learning feedback indicator with animated brain icon
- History of user feedback with adaptation status
- "System adapting..." animated indicator

### 7. Research & Insights Dashboard
- **Aggregated Insights** section with summary cards
- **Wastage Causes Chart**: Horizontal bar chart
- **Savings by Admin Type**: Grouped bar chart comparing Campus/Society/Building
- **India State Heatmap**: 
  - Interactive SVG map of India
  - Color-coded by energy consumption intensity
  - Hover tooltips showing state-level data
  - Legend showing consumption ranges
- Export insights button (mock functionality)

---

## 🛠 Technical Architecture

### Component Structure
```
/components
  /layout (Header, Sidebar, ThemeToggle)
  /dashboard (ChartCards, StatsGrid, SavingsBanner)
  /forms (SetupWizard, ModeSelector, WhatIfSliders)
  /visualizations (IndiaHeatmap, ConsumptionCharts)
  /notifications (FeedbackPopup, AdaptiveIndicator)
  /ui (shadcn components)
  
/pages
  - Landing
  - Setup
  - Dashboard
  - ModeSelection
  - Recommendations
  - Insights

/services
  - mockApi.ts (simulated API responses)
  - calculations.ts (prediction formulas)
  - storage.ts (localStorage helpers)
```

### Data Flow
- User input stored in localStorage and React context
- Mock API services with realistic response delays
- Calculations based on input with configurable algorithms
- Structured for easy Supabase integration later

### Charts & Visualizations
- **Recharts** (already installed) for all data visualizations
- Custom SVG India map component with state paths
- Smooth animations using CSS transitions

---

## ✨ Polish & UX Details
- Page transition animations
- Loading skeletons for data fetching states
- Toast notifications for user actions
- Responsive design (desktop-first, mobile-friendly)
- Keyboard navigation support
- Hover effects on all interactive elements

---

## 📊 Mock Data Strategy
- Realistic consumption patterns based on admin type
- Randomized but plausible wastage zones
- State-level mock data for India heatmap
- Community savings counter with animated updates

