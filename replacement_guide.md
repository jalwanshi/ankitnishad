# Ankit Nishad Portfolio - Customisation & Data Replacement Guide

This guide details exactly where and how to replace the current dummy content (text, statistics, images, links, and credentials) with your original details.

---

## 1. Visual Assets (Images & PDF)

Replace the placeholder images in the `public/assets/` directory with your actual assets. Keep the filenames exactly the same so they link automatically:

| Asset Name | File Path | Target Dimensions | Visual Style / Recommendations |
| :--- | :--- | :--- | :--- |
| **Hero Portrait** | [hero-portrait.png](file:///Users/weblozy/Documents/portfolio/public/assets/hero-portrait.png) | **800 x 1000 px** (4:5 Aspect Ratio) | High-contrast **Black & White studio portrait** in a dark blazer, looking confident and approachable. Clean grey background. |
| **About Portrait** | [about-portrait.png](file:///Users/weblozy/Documents/portfolio/public/assets/about-portrait.png) | **800 x 1000 px** (4:5 Aspect Ratio) | High-contrast **Black & White action photo** (e.g. working at a desk, strategic thinking). |
| **Case Study Cover** | [hospital-automation-cover.png](file:///Users/weblozy/Documents/portfolio/public/assets/hospital-automation-cover.png) | **1600 x 1000 px** (16:10 Aspect Ratio) | High-contrast **Black & White abstract graphic** or system flowchart blueprint representing healthcare automation. |
| **Your Resume** | `/public/assets/resume.pdf` | Standard A4/Letter size | Save your final professional CV as a PDF file named `resume.pdf` in the `public/assets/` folder. |

---

## 2. Text Content & Career Data

All public website content is centralise in the data file:
📂 [portfolioData.ts](file:///Users/weblozy/Documents/portfolio/src/constants/portfolioData.ts)

Open this file and replace the values inside:

### A. General Profile (`profileData`)
* **Email:** Replace `"hello@ankitnishad.com"` with your actual email.
* **Phone:** Replace `"+91 12345 67890"` with your actual phone number.
* **LinkedIn:** Replace `"https://linkedin.com/in/ankitnishad"` with your actual profile link.
* **Booking URL:** Replace `"https://cal.com/ankitnishad"` with your Calendly or Cal.com scheduling link.
* **Taglines & Bios:** Customise the short and full biographies to describe your personal consulting approach.

### B. Stats & Counters (`profileData.metrics`)
* **projectsDelivered:** e.g., `"+200"`
* **businessConsultations:** e.g., `"+50"`
* **toolsHandled:** e.g., `"50+"`
* **industryDomains:** e.g., `"18+"`
* **happyClients:** e.g., `"20+"`
* **automationsBuilt:** e.g., `"200+"`

### C. Career Timeline (`careerData`)
* For each milestone block, update:
  * `company`: Company name.
  * `duration`: Date range (e.g., `"2023 - Present"`).
  * `designation`: Your exact role title.
  * `roleSummary`: Short overview of the role.
  * `responsibilities`: Array of bullet points representing daily operations.
  * `achievements`: Quantified results (e.g., "Automated patient billing, saving 40% time").
  * `skills` & `tools`: Tag arrays (e.g. `["Make.com", "Odoo"]`).

### D. Portfolio Case Studies (`projectsData`)
Update or expand the case studies:
* `clientContext`: Client background description.
* `businessChallenge`: Problem description.
* `operationalGaps`: Bullet list of inefficiencies.
* `proposedSolution`: System solution summary.
* `ankitRole`: Your contribution.
* `actualResults`: Metric keys (`timeSaved`, `workReduced`, `dataAccuracy`).

---

## 3. Connecting to Your Live Firebase Project

To connect your forms and admin dashboard to a live Firebase instance:

1. Create a project in the **[Firebase Console](https://console.firebase.google.com/)**.
2. Enable **Firestore Database**, **Authentication** (Email/Password), and **Storage**.
3. Create a new file named `.env.local` in the root folder of the project.
4. Copy the keys from [.env.example](file:///Users/weblozy/Documents/portfolio/.env.example) and fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Once this is complete, the contact page and admin panel will save and fetch data directly from your live database.
