export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  isReplied: boolean;
  repliedAt: string | null;
  repliedBy: string | null;
  replyMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isRead?: string;
  isArchived?: string;
  isReplied?: string;
}
