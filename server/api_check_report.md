# REST API Validation Report

Generated at: 2026-07-06T12:05:01.601Z

| Test Endpoint | Method | Path | Status | Success | Details |
|---|---|---|---|---|---|
| **Health Check** | `GET` | `/health` | 200 | ✅ | `{"status":"ok","timestamp":"2026-07-06T12:05:00.035Z"}` |
| **Doctors List** | `GET` | `/doctors` | 401 | ❌ | `{"message":"Missing or invalid Authorization header","error":"Unauthorized","statusCode":401}` |
| **Single Doctor Profile** | `GET` | `/doctors/doc_1` | 401 | ❌ | `{"message":"Missing or invalid Authorization header","error":"Unauthorized","statusCode":401}` |
| **Doctor Availability** | `GET` | `/doctors/doc_1/availability?date=2026-07-07` | 401 | ❌ | `{"message":"Missing or invalid Authorization header","error":"Unauthorized","statusCode":401}` |
| **Profile (No Auth)** | `GET` | `/users/me` | 401 | ❌ | `{"message":"Missing or invalid Authorization header","error":"Unauthorized","statusCode":401}` |
| **Profile (Seed Auth Bypass)** | `GET` | `/users/me` | 200 | ✅ | `{"id":"00000000-0000-0000-0000-000000000001","clerkUserId":"user_seed_clerk_id","email":"demo-patient@astrahealth.com","...` |
| **Profile (New Mock Provisioning)** | `GET` | `/users/me` | 200 | ✅ | `{"id":"09c42764-50bd-4402-88fb-56f330b16691","clerkUserId":"mock_new_developer_user","email":"mock-user-mock_new_d@examp...` |
| **Save Onboarding Draft** | `PATCH` | `/users/me/onboarding/draft` | 200 | ✅ | `{"id":"00000000-0000-0000-0000-000000000001","clerkUserId":"user_seed_clerk_id","email":"demo-patient@astrahealth.com","...` |
| **Get Consultations** | `GET` | `/consultations` | 200 | ✅ | `[]` |

## Detailed Responses

### Health Check (`GET /health`)
**Status:** 200 | **Success:** true
```json
{
  "status": "ok",
  "timestamp": "2026-07-06T12:05:00.035Z"
}
```

### Doctors List (`GET /doctors`)
**Status:** 401 | **Success:** false
```json
{
  "message": "Missing or invalid Authorization header",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Single Doctor Profile (`GET /doctors/doc_1`)
**Status:** 401 | **Success:** false
```json
{
  "message": "Missing or invalid Authorization header",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Doctor Availability (`GET /doctors/doc_1/availability?date=2026-07-07`)
**Status:** 401 | **Success:** false
```json
{
  "message": "Missing or invalid Authorization header",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Profile (No Auth) (`GET /users/me`)
**Status:** 401 | **Success:** false
```json
{
  "message": "Missing or invalid Authorization header",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Profile (Seed Auth Bypass) (`GET /users/me`)
**Status:** 200 | **Success:** true
```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "clerkUserId": "user_seed_clerk_id",
  "email": "demo-patient@astrahealth.com",
  "firstName": "Arindam",
  "lastName": "Chatterjee",
  "avatarUrl": "/patient-arindam.png",
  "phone": "+91 98301 23456",
  "dateOfBirth": "1973-04-12T00:00:00.000Z",
  "gender": "Male",
  "address": "Flat 3B, Lake Gardens, Kolkata, WB 700045",
  "bloodGroup": "B+",
  "emergencyContactName": "Madhumita Chatterjee",
  "emergencyContactPhone": "+91 98740 56789",
  "emergencyContactRelationship": "Spouse",
  "preferredLanguage": "en",
  "preferredHospital": "Apollo Hospital",
  "insuranceProvider": "Star Health Insurance",
  "insurancePolicyNumber": "SH-983021-99",
  "knownConditions": [
    "Hypertension"
  ],
  "allergies": [
    "None"
  ],
  "notificationPrefs": {
    "appointments": true,
    "medications": true,
    "updates": false,
    "marketing": false
  },
  "onboardingComplete": true,
  "onboardingDraft": null,
  "isActive": true,
  "createdAt": "2026-07-04T23:54:30.689Z",
  "updatedAt": "2026-07-04T23:54:30.689Z"
}
```

### Profile (New Mock Provisioning) (`GET /users/me`)
**Status:** 200 | **Success:** true
```json
{
  "id": "09c42764-50bd-4402-88fb-56f330b16691",
  "clerkUserId": "mock_new_developer_user",
  "email": "mock-user-mock_new_d@example.com",
  "firstName": "Mock",
  "lastName": "User",
  "avatarUrl": "/placeholder.svg",
  "phone": null,
  "dateOfBirth": null,
  "gender": "Unspecified",
  "address": null,
  "bloodGroup": null,
  "emergencyContactName": null,
  "emergencyContactPhone": null,
  "emergencyContactRelationship": null,
  "preferredLanguage": "en",
  "preferredHospital": null,
  "insuranceProvider": null,
  "insurancePolicyNumber": null,
  "knownConditions": [],
  "allergies": [],
  "notificationPrefs": {
    "appointments": true,
    "medications": true,
    "updates": false,
    "marketing": false
  },
  "onboardingComplete": false,
  "onboardingDraft": null,
  "isActive": true,
  "createdAt": "2026-07-06T12:05:01.548Z",
  "updatedAt": "2026-07-06T12:05:01.548Z"
}
```

### Save Onboarding Draft (`PATCH /users/me/onboarding/draft`)
**Status:** 200 | **Success:** true
```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "clerkUserId": "user_seed_clerk_id",
  "email": "demo-patient@astrahealth.com",
  "firstName": "Arindam",
  "lastName": "Chatterjee",
  "avatarUrl": "/patient-arindam.png",
  "phone": "+91 98301 23456",
  "dateOfBirth": "1973-04-12T00:00:00.000Z",
  "gender": "Male",
  "address": "Flat 3B, Lake Gardens, Kolkata, WB 700045",
  "bloodGroup": "B+",
  "emergencyContactName": "Madhumita Chatterjee",
  "emergencyContactPhone": "+91 98740 56789",
  "emergencyContactRelationship": "Spouse",
  "preferredLanguage": "en",
  "preferredHospital": "Apollo Hospital",
  "insuranceProvider": "Star Health Insurance",
  "insurancePolicyNumber": "SH-983021-99",
  "knownConditions": [
    "Hypertension"
  ],
  "allergies": [
    "None"
  ],
  "notificationPrefs": {
    "appointments": true,
    "medications": true,
    "updates": false,
    "marketing": false
  },
  "onboardingComplete": true,
  "onboardingDraft": {
    "step": 2,
    "profile": {
      "phone": "+1234567890"
    }
  },
  "isActive": true,
  "createdAt": "2026-07-04T23:54:30.689Z",
  "updatedAt": "2026-07-06T12:05:01.588Z"
}
```

### Get Consultations (`GET /consultations`)
**Status:** 200 | **Success:** true
```json
[]
```

