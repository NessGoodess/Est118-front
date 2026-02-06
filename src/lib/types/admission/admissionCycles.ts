export type AdmissionStatus =
    | "active"
    | "not_started"
    | "ended"
    | "not_available";

export interface AdmissionStatusResponse {
    enabled: boolean;
    status: AdmissionStatus;
    message: string | null;
    start_at: string | null;
    end_at: string | null;
    server_time: string;
    cycle_id: number | null;
    cycle_name: string | null;
}


export type ActiveAdmissionStatus = AdmissionStatusResponse & {
    enabled: true;
    status: "active";
};
