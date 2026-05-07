# Security Specification for Andu Nawle Admin Panel

## 1. Data Invariants
- **Article**: Title, slug, content must be present. Status must be 'draft' or 'published'. Only admins can perform CRUD.
- **JoinRequest**: Firstname, lastname, email, engagementType must be present. Created publicly, read only by admins.
- **ContactMessage**: Name, email, subject, message must be present. Created publicly, read only by admins.
- **User**: Only admins can read/write the `users` collection.
- **Settings**: Publicly readable, writeable only by admins.

## 2. The "Dirty Dozen" Payloads (Red Team Audit)

### 1. Identity Spoofing (JoinRequest)
- **Attack**: User A sends a `JoinRequest` with `firstname: "Hacker", email: "hacker@test.com"`.
- **Expected**: Disallowed if missing required fields like `lastname` or `engagementType`.
- **Reality**: Rules check `firstname`, `lastname`, `email`, `engagementType`, `createdAt`.

### 2. Identity Spoofing (Article)
- **Attack**: Unauthenticated user tries to `create` an article.
- **Expected**: MISSION_DENIED.

### 3. PII Leak (JoinRequest)
- **Attack**: Authenticated user (non-admin) tries to `list` `join_requests`.
- **Expected**: MISSION_DENIED.

### 4. Shadow Update (Article)
- **Attack**: Admin updates an article but tries to inject a field `verifiedBySuperAdmin: true`.
- **Expected**: Should be blocked if not in schema (if using `hasOnly()`).

### 5. Email Spoofing (Admin Access)
- **Attack**: User with email "youknowfeus@gmail.com" but `email_verified: false` tries to access admin data.
- **Expected**: For this app, we explicitly allowed this email to bypass verification for setup, but in production, we should check `email_verified`.

### 6. Resource Poisoning (ID characters)
- **Attack**: Create a document at `/articles/JUNK_CHARACTERS_1.5KB`.
- **Expected**: Blocked by `isValidId()`.

### 7. Time Spoofing (JoinRequest)
- **Attack**: User sends `createdAt: 1999-01-01`.
- **Expected**: Blocked by `data.createdAt == request.time`.

### 8. Denial of Wallet (Large content)
- **Attack**: User sends an article with 10MB of content.
- **Expected**: Blocked by `content.size() <= 65536`.

### 9. Orphaned Write (No author)
- **Attack**: Create article without `authorId`.
- **Expected**: Our rules don't strictly require `authorId` yet, but they should.

### 10. Admin Self-Promotion
- **Attack**: User A creates a document at `/users/USER_A_ID` with `role: "admin"`.
- **Expected**: Blocked because only `isAdmin()` can write to `/users/`.

### 11. Public Settings Corruption
- **Attack**: Guest user tries to `update` `/settings/general`.
- **Expected**: MISSION_DENIED.

### 12. List Query Scraper
- **Attack**: User tries to `list` all contact messages with a generic `getDocs(collection('contact_messages'))`.
- **Expected**: Blocked because they are not admin.

## 3. Test Runner (Draft Rules Test)
A separate test file would verify these, but here we focus on the final ruleset.
