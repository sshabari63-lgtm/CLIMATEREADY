# ClimateReady Knowledge Base & Methodology

## 1. What is ClimateReady?
ClimateReady is an open, community-oriented climate resilience and disaster preparedness platform designed for hyper-local heatwave and extreme precipitation/flood risk management. It combines real-time meteorological data (from Open-Meteo), geographic mapping (OpenStreetMap & optional Google Maps), household vulnerability profiling, and practical action checklists to turn abstract weather forecasts into lifesaving preparedness steps.

## 2. Calculation Methodology

### Heat Risk Score (0 - 100)
The Heat Risk Score is computed from three primary meteorological inputs over the upcoming 48 hours:
1. **Maximum Ambient Temperature (Tmax)**:
   - Baseline: Normal comfortable range < 32°C (Score 0-20).
   - Moderate Warmth: 33°C - 37°C (Score 25-50).
   - Severe Heat: 38°C - 42°C (Score 55-80).
   - Extreme Heatwave: > 42°C (Score 85-100).
2. **Apparent Temperature (Heat Index)**:
   - Combines relative humidity and dry-bulb temperature using Steadman's formula.
   - High humidity impedes evaporative cooling through sweat. When Heat Index exceeds 41°C ("Danger"), the heat score receives an additional +15 point weighting. Above 46°C ("Extreme Danger"), it receives +25 points.
3. **Consecutive Hot Days & Tropical Nights**:
   - Minimum nighttime temperature > 26°C prevents physiological recovery and increases cumulative heat stress (+10 points).

### Flood Risk Score (0 - 100)
The Flood Risk Score evaluates both hydrometeorological intensity and terrain/infrastructure vulnerability:
1. **24h & 7-Day Cumulative Rainfall (Weight: 50%)**:
   - < 15 mm: Low baseline (Score < 20).
   - 15 - 64 mm (Moderate to Heavy): (Score 25-50).
   - 65 - 115 mm (Very Heavy / Torrential): (Score 55-80).
   - > 115 mm (Extremely Torrential): (Score 85-100).
2. **Soil Saturation / Consecutive Rain Days (Weight: 25%)**:
   - Antecedent precipitation over the preceding 3-5 days reduces infiltration capacity, leading to rapid surface runoff.
3. **Elevation & Proximity to Water Bodies (Weight: 25%)**:
   - Low-lying deltaic, coastal, or depression basins with poor drainage receive higher vulnerability penalties.

### Preparedness Score (0 - 100)
- Calculated directly from the percentage of completed preparedness checklist actions tailored to the user's specific household profile (e.g. emergency kit packed, water stocked, power backups tested, drainage cleared).
- Note: A 100% Preparedness Score reflects thorough personal precautions, but does *not* constitute absolute safety against severe natural disasters.

## 3. Vulnerable Groups Guidance
- **Elderly**: Higher risk of heat stroke due to reduced thermoregulation and thirst perception. Ensure hourly hydration, cool footbaths, and shaded indoor environments.
- **Infants & Toddlers**: Rapid dehydration rate and sensitive skin. Keep indoors during peak UV/heat hours (11:00 AM - 4:00 PM), dress in loose single-layer cotton.
- **Pregnancy**: Elevated baseline body temperature and blood volume demands. Avoid midday physical exertion and maintain electrolyte balance.
- **Chronic Illness (Cardiovascular, Renal, Asthma)**: Heat strain stresses the cardiovascular system, while humidity exacerbates breathing difficulties. Keep 7 days of medications in waterproof zip pouches.
- **Outdoor Workers**: High heat exhaustion danger. Enforce mandatory 15-minute shaded rest breaks per hour when Heat Index > 40°C.
- **Livestock & Pets**: Vulnerable to heat exhaustion. Provide ample clean drinking water, thatched roofing, and misting systems.

## 4. Emergency Contacts (Static Reference - India)
- **National Emergency Number**: 112 (Unified Emergency Services)
- **Police**: 100
- **Fire & Rescue**: 101
- **Ambulance / Medical**: 108
- **Disaster Management Services (NDMA)**: 1070 / 1078
- **Women Helpline**: 1091
- **Child Helpline**: 1098
*Source: Ministry of Home Affairs, Government of India & National Disaster Management Authority (NDMA).*

## 5. Disclaimers & Operational Boundaries
- ClimateReady provides automated risk assessments and community information. It is NOT an official meteorological agency or emergency service.
- For legally binding and official alerts, users must consult the **India Meteorological Department (IMD)**, **State Disaster Management Authorities (SDMA)**, or relevant national meteorological agencies.
- All community reports are unverified user submissions.
