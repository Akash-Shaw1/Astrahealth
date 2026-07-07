const API_URL = 'http://localhost:4000/api';

// Helper to retrieve Clerk JWT token from global window object
async function getHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = await (window as any).Clerk?.session?.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// Resilient API Fetcher wrapper
async function apiRequest<T>(
  method: string,
  path: string,
  body?: any,
): Promise<T> {
  const headers = await getHeaders();
  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errText}`);
  }

  return response.json();
}

export const apiAdapter = {
  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getDoctors(specialty?: string): Promise<any[]> {
    const path = specialty ? `/doctors?specialty=${encodeURIComponent(specialty)}` : '/doctors';
    return apiRequest<any[]>('GET', path);
  },

  async getDoctorById(id: string): Promise<any> {
    return apiRequest<any>('GET', `/doctors/${id}`);
  },

  async searchDoctors(query: string): Promise<any[]> {
    return apiRequest<any[]>('GET', `/doctors?search=${encodeURIComponent(query)}`);
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<string[]> {
    return apiRequest<string[]>('GET', `/doctors/${doctorId}/availability?date=${date}`);
  },

  // Consultations CRUD
  async getConsultations(status?: string): Promise<any[]> {
    const path = status ? `/consultations?status=${status}` : '/consultations';
    return apiRequest<any[]>('GET', path);
  },

  async getConsultationById(id: string): Promise<any> {
    return apiRequest<any>('GET', `/consultations/${id}`);
  },

  async createConsultation(data: any): Promise<any> {
    return apiRequest<any>('POST', '/consultations', data);
  },

  async updateConsultation(id: string, updates: any): Promise<any> {
    return apiRequest<any>('PUT', `/consultations/${id}`, updates);
  },

  async deleteConsultation(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>('DELETE', `/consultations/${id}`);
    return res.success;
  },

  async getConsultationStats(): Promise<any> {
    return apiRequest<any>('GET', '/consultations/stats');
  },

  // Medical Records CRUD
  async getMedicalRecords(familyMemberId?: string): Promise<any[]> {
    const path = familyMemberId ? `/records?familyMemberId=${familyMemberId}` : '/records';
    return apiRequest<any[]>('GET', path);
  },

  async getMedicalRecordById(id: string): Promise<any> {
    return apiRequest<any>('GET', `/records/${id}`);
  },

  async createMedicalRecord(data: any): Promise<any> {
    return apiRequest<any>('POST', '/records', data);
  },

  async updateMedicalRecord(id: string, updates: any): Promise<any> {
    return apiRequest<any>('PUT', `/records/${id}`, updates);
  },

  async deleteMedicalRecord(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>('DELETE', `/records/${id}`);
    return res.success;
  },

  async uploadRecordFile(recordId: string, fileData: { fileName: string; fileSize: string }): Promise<any> {
    return apiRequest<any>('POST', `/records/${recordId}/upload`, fileData);
  },

  // Medications CRUD
  async getMedicines(familyMemberId?: string): Promise<any[]> {
    const path = familyMemberId ? `/medications?familyMemberId=${familyMemberId}` : '/medications';
    return apiRequest<any[]>('GET', path);
  },

  async getMedicineById(id: string): Promise<any> {
    return apiRequest<any>('GET', `/medications/${id}`);
  },

  async addMedicine(data: any): Promise<any> {
    return apiRequest<any>('POST', '/medications', data);
  },

  async updateMedicine(id: string, updates: any): Promise<any> {
    return apiRequest<any>('PUT', `/medications/${id}`, updates);
  },

  async deleteMedicine(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>('DELETE', `/medications/${id}`);
    return res.success;
  },

  async completeMedicine(id: string): Promise<any> {
    return apiRequest<any>('POST', `/medications/${id}/complete`);
  },

  async decrementDose(id: string, amount = 1): Promise<any> {
    return apiRequest<any>('POST', `/medications/${id}/take-dose`, { amount });
  },

  async refillMedicine(id: string, doses: number): Promise<any> {
    return apiRequest<any>('POST', `/medications/${id}/refill`, { additionalDoses: doses });
  },

  // Manual Vitals Entries CRUD
  async getVitals(familyMemberId?: string, days?: number): Promise<any[]> {
    let path = '/vitals';
    const params = [];
    if (familyMemberId) params.push(`familyMemberId=${familyMemberId}`);
    if (days) params.push(`days=${days}`);
    if (params.length > 0) path += `?${params.join('&')}`;

    return apiRequest<any[]>('GET', path);
  },

  async getVitalsTrends(familyMemberId: string, days = 30): Promise<any[]> {
    return apiRequest<any[]>('GET', `/vitals/trends?familyMemberId=${familyMemberId}&days=${days}`);
  },

  async logVitals(data: any): Promise<any> {
    return apiRequest<any>('POST', '/vitals', data);
  },

  async deleteVitals(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>('DELETE', `/vitals/${id}`);
    return res.success;
  },

  // Family Members (Dependents) CRUD
  async getFamilyMembers(): Promise<any[]> {
    return apiRequest<any[]>('GET', '/family-members');
  },

  async getFamilyMemberById(id: string): Promise<any> {
    return apiRequest<any>('GET', `/family-members/${id}`);
  },

  async createFamilyMember(data: any): Promise<any> {
    return apiRequest<any>('POST', '/family-members', data);
  },

  async updateFamilyMember(id: string, data: any): Promise<any> {
    return apiRequest<any>('PUT', `/family-members/${id}`, data);
  },

  async deleteFamilyMember(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>('DELETE', `/family-members/${id}`);
    return res.success;
  },

  // Campaigns Registrations
  async getCampaigns(type?: string, search?: string): Promise<any[]> {
    let path = '/campaigns';
    const params = [];
    if (type) params.push(`type=${type}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) path += `?${params.join('&')}`;

    return apiRequest<any[]>('GET', path);
  },

  async registerForCampaign(campaignId: string, familyMemberId?: string): Promise<any> {
    return apiRequest<any>('POST', `/campaigns/${campaignId}/register`, { familyMemberId });
  },

  async cancelCampaignRegistration(campaignId: string, familyMemberId?: string): Promise<boolean> {
    let path = `/campaigns/${campaignId}/register`;
    if (familyMemberId) path += `?familyMemberId=${familyMemberId}`;
    const res = await apiRequest<{ success: boolean }>('DELETE', path);
    return res.success;
  },

  async getMyCampaignRegistrations(): Promise<any[]> {
    return apiRequest<any[]>('GET', '/campaigns/my-registrations');
  },

  // Feedback Submission
  async submitFeedback(data: any): Promise<any> {
    return apiRequest<any>('POST', '/feedback', data);
  },

  async getFeedback(entityType?: string): Promise<any[]> {
    const path = entityType ? `/feedback?entityType=${entityType}` : '/feedback';
    return apiRequest<any[]>('GET', path);
  },

  // Health Goals
  async getGoals(): Promise<any[]> {
    return apiRequest<any[]>('GET', '/goals');
  },

  async createGoal(data: any): Promise<any> {
    return apiRequest<any>('POST', '/goals', data);
  },

  async updateGoal(id: string, data: any): Promise<any> {
    return apiRequest<any>('PUT', `/goals/${id}`, data);
  },

  async deleteGoal(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>('DELETE', `/goals/${id}`);
    return res.success;
  },

  // Education Module Progress
  async getEducationProgress(): Promise<any[]> {
    return apiRequest<any[]>('GET', '/education/progress');
  },

  async updateEducationProgress(moduleId: string, completionPercent: number): Promise<any> {
    return apiRequest<any>('PUT', `/education/progress/${moduleId}`, { completionPercent });
  },

  // User Profile & Onboarding
  async getProfile(): Promise<any> {
    return apiRequest<any>('GET', '/users/me');
  },

  async updateProfile(data: any): Promise<any> {
    return apiRequest<any>('PUT', '/users/me', data);
  },

  async updateOnboardingDraft(draft: any): Promise<any> {
    return apiRequest<any>('PATCH', '/users/me/onboarding/draft', draft);
  },

  async completeOnboarding(onboardingData: any): Promise<any> {
    return apiRequest<any>('POST', '/users/me/onboarding', onboardingData);
  },
};
