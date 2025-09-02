// Review interface for table display
export interface ReviewType {
  _id: string;
  reviewId: string;
  tenantId: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  helpfulUsers: string[];
  images: string[];
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  moderatorNotes?: string;
  updatedBy?: string;
  __v: number;
}

// Review moderation interface
export interface ModerateReviewData {
  status: "approved" | "rejected";
  moderatorNotes: string;
}

// Review update interface
export interface UpdateReviewData {
  status?: "pending" | "approved" | "rejected";
  moderatorNotes?: string;
}
