export type AdmissionCycleStatus = 'draft' | 'active' | 'closed';

export interface AdmissionCycle {
    id: number;
    start_at: string;
    end_at: string;
    name: string;
    status: AdmissionCycleStatus;
    created_at?: string;
    updated_at?: string;
}

export interface CreateAdmissionCyclePayload {
    start_at: string;
    end_at: string;
    name: string;
}

export interface AdmissionStatus {
    enabled: boolean;
    message: string;
    cycle_id?: number;
    cycle_name?: string;
    start_at?: string;
    end_at?: string;
}
