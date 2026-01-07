export interface CurrentStudent {
    id: number;
    credential_id: string;
    name: string;
    photo_url: string;
    grade: string;
    group: string;
    registered_at: string;
  }
  
  export interface CurrentData {
    credential_id: string;
    event: string;
    message: string;
    reader: string;
    status: string;
    student: CurrentStudent;
    timestamp: string;
  }