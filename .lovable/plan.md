## Guide Onboarding & KYC Verification System

A complete multi-step wizard for guides + admin review tooling, built on the existing `guide_profiles` table with new tables for documents, languages, and verification status.

### 1. Database changes (migration)

Extend `guide_profiles`:
- `phone`, `wilaya`, `bio`, `years_experience`, `work_history`, `expertise`, `portfolio_links` (text[])
- `session_type` (text: online/in-person/both), `price_per_hour`, `working_hours` (jsonb), `available_days` (text[])
- `verification_status` enum-like text: `draft | submitted | under_review | verified | rejected`
- `submitted_at`, `verified_at`, `rejected_at`

New tables:
- `guide_languages` — `guide_id`, `language`, `proficiency` (basic/intermediate/fluent/native)
- `guide_documents` — `guide_id`, `doc_type` (id_front, id_back, selfie, diploma, training_cert, language_cert, work_proof, other), `file_path`, `file_name`, `uploaded_at`
- (optional) `guide_specializations` if multiple specs per guide

RLS:
- Guide owner can CRUD own rows in all tables
- Admin can read/update everything
- Public can only read `guide_profiles` where `verification_status = 'verified'` AND `is_approved = true`
- `guide_documents` — **NEVER public**. Only owner + admin. RLS denies clients entirely.

Storage buckets:
- `guide-documents` (PRIVATE bucket) — RLS: owner can upload to own folder, admin can read all
- Reuse existing public `guide-photos` for profile photo only

### 2. Multi-step wizard (`/guide/onboarding`)

Single route with step state (1–7) + sticky progress bar:

1. **Basic info** — name, phone, email (prefilled), wilaya (dropdown of 58 wilayas), city, profile photo upload, bio
2. **Identity (KYC)** — ID/passport selector, front + back upload, selfie upload
3. **Languages** — multi-add: language + proficiency rows
4. **Category & specialization** — radio (tourist/student/investor) → dependent specialization picker (reuse `SPECIALIZATIONS` map). Reset specialization on category change.
5. **Proof documents** — multi-file upload grouped by type (diploma, training, language, work, other)
6. **Experience** — years, history, expertise, portfolio links (dynamic list)
7. **Availability & pricing** — working hours, days (checkbox grid), session type, price

Final **Review & Submit** screen → sets `verification_status = 'submitted'`. After submission the wizard becomes read-only with a status banner (Submitted / Under Review / Verified / Rejected with reason).

Validation per step with Zod; "Next" disabled until valid. State persisted to DB on each step (Draft) so guides can resume.

### 3. Public listing & map filtering

Update `GuideList.tsx` and `AlgeriaLeafletMap.tsx` queries:
```
.eq('is_approved', true).eq('verification_status', 'verified')
```

### 4. Admin review (`/admin/guides`)

Enhance existing admin page:
- List with verification_status filter
- Detail panel: all profile fields, languages, signed URLs for each document (admin-only signed URL helper via server function)
- Actions: Mark Under Review, Verify + Approve, Reject with reason
- Documents render inline (image/pdf preview)

Server function `getGuideDocuments(guideId)` with `requireSupabaseAuth` + admin check, returns signed URLs from private bucket.

### 5. Security guarantees

- Private bucket for KYC docs; client never gets signed URLs
- RLS on `guide_documents` denies all non-owner non-admin reads
- Public guide queries always filter `verification_status='verified'`
- Profile cannot be published unless admin approves AND status=verified

### Files to create / edit

Create:
- migration (schema + RLS + bucket + policies)
- `src/pages/guide/Onboarding.tsx` (wizard host)
- `src/components/guide/onboarding/Step{1..7}.tsx`
- `src/components/guide/onboarding/ProgressBar.tsx`
- `src/lib/wilayas.ts` (58 wilayas)
- `src/lib/guideDocuments.functions.ts` (admin signed URLs)
- `src/routes/guide.onboarding.tsx`

Edit:
- `src/pages/admin/Guides.tsx` — review panel + actions
- `src/pages/public/GuideList.tsx` — filter verified
- `src/components/map/AlgeriaLeafletMap.tsx` — filter verified
- `src/pages/guide/Dashboard.tsx` — link to onboarding + status badge
- `src/pages/guide/Profile.tsx` — redirect to onboarding if incomplete
- `src/types/index.ts` — new types

### Open questions

None blocking — defaults: required ID type = either ID or passport; languages drawn from existing language list; price stored per-hour with optional per-session override.

Ready to implement on approval.