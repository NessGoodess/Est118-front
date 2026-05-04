export type AdmissionCycleStatus = 'draft' | 'active' | 'closed';

export interface AdmissionCycle {
    id: number;
    name: string;
    start_at: string;
    end_at: string;
    status: AdmissionCycleStatus;
    last_folio_number: number;
    created_at?: string;
    updated_at?: string;
    preenrollments_count: number;
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
