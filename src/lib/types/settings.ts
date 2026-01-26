export type AdmissionCycleStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

export interface AdmissionCycle {
    id: number;
    start_date: string;
    end_date: string;
    name: string;
    status: AdmissionCycleStatus;
    created_at?: string;
    updated_at?: string;
}

export interface CreateAdmissionCyclePayload {
    start_date: string;
    end_date: string;
    name: string;
}

export interface AdmissionStatus {
    enabled: boolean;
    message: string;
    cycle_id?: number;
    cycle_name?: string;
    start_date?: string;
    end_date?: string;
}
